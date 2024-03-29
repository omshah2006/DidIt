import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue, set, get, push } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Social({ navigation }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');

  const getUUID = async () => {
    try {
      const value = await AsyncStorage.getItem('@session_id');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddFriend = (username) => {
    getUUID().then((uuid) => {
      if (uuid !== username) {
        const db = getDatabase(firebase);
        const uuidForUsernameRef = ref(db, 'users/');
        get(uuidForUsernameRef).then((snapshot) => {
          const users = snapshot.val();
          for (const userUUID in users) {
            if (users[userUUID]["info"]["username"] === username) {
              const friendsRef = ref(db, 'users/' + uuid + '/friends/');
              get(friendsRef).then((friendsSnapshot) => {
                const friends = friendsSnapshot.val();
                if (friends && Object.values(friends).some((friend) => friend.friend_uuid === userUUID)) {
                  console.log('User already a friend');
                } else {
                  push(ref(db, 'users/' + uuid + '/friends/'), {
                    friend_uuid: userUUID,
                    name: username
                  });
                }
              });
            }
          }
        });
      }
    });
  };
  

  useEffect(() => {
    const db = getDatabase(firebase);
    const pullUsers = () => {
      const usersRef = ref(db, 'users/');

      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        const allUsers = [];

        for (const uuid in usersData) {
          if (Object.hasOwnProperty.call(usersData, uuid)) {
            const userRef = ref(db, 'users/' + uuid);

            onValue(userRef, (snapshot) => {
              const userData = snapshot.val();

              if (userData) {
                allUsers.push(userData);
              }
            });
          }
        }

        setUsers(allUsers);
      });
    };

    getUUID().then((uuid) => {
      const usernameref = ref(db, 'users/' + uuid + '/info/username');
      onValue(usernameref, (snapshot) => {
        console.log('Username pulling from cloud');
        const data = snapshot.val();
        setUsername(data);
      });
    });

    pullUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonCircle2} onPress={() => navigation.navigate("Home")}>
          <Image style={styles.image2} source={require('../assets/back.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{username}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultContainer}>
        {users.map((value, index) => (
          <View key={index} style={styles.imageContainer}>
            <View style={styles.rowContainer}>
              {value.info && value.info.username ? (
                <>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddFriend(value.info.username)}
                  >
                    <Text style={styles.button}>{value.info.username}</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
            {value.info && value.info.moment ? (
              <Text style={styles.moment}>{value.info.moment}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  buttonCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    marginRight: 150,
    marginBottom: 10,
    marginTop: 20,
  },
  image2: {
    width: 45,
    height: 45,
    marginLeft: 7,
    marginTop: 7,
  },
  button: {
    backgroundColor: '#FF5B42',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  resultContainer: {
    maxHeight: 500,
    borderRadius: 15,
  },
  userContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 15,
    elevation: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'rgba(251, 91, 90, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  moment: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
});
