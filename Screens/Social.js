import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text, FlatList } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue, set, get, push } from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Social({ navigation }) {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');


  const displayUsers = (users) => {
    return (
      <View>
        {users.map((value, index) => (
          <View key={index} style={styles.imageContainer}>
            <View style={styles.rowContainer}>
              {value.info && value.info.username ? (
                <>
                  <Text style={styles.username}>{value.info.username}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddFriend(value.info.username)}
                  >
                    <Text style={styles.button}>Add Friend</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
            {value.info && value.info.moment ? (
              <Text style={styles.moment}>{value.info.moment}</Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  };
  
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
        const uuidForUsernameRef = ref(db, 'users/')
        get(uuidForUsernameRef)
        .then((snapshot) => {
          const users = snapshot.val();
          for (userUUID in users) {
            // console.log(users[userUUID]["info"]["username"])
            // console.log(username)
            if (users[userUUID]["info"]["username"] === username) {
              // const currentUserFriendRef = ref(db, 'users/' + uuid + '/friends');
              push(ref(db, 'users/' + uuid + '/friends/'), {
                friend_uuid: userUUID,
                name: username
              });
              // Check if the 'friends' object exists for the current user
              // get(currentUserFriendRef)
              //   .then((snapshot) => {
              //     const friendsData = snapshot.val();
      

      
              //     // if (friendsData === null) {
              //     //   // Create 'friends' object if it doesn't exist
              //     //   push(ref(db, 'users/' + uuid + '/friends/'), {
              //     //     friend: username
              //     //   });
                  
              //     // } else {
              //     //   // Append the 'username' to the 'friends' folder for the current user
              //     //   if (!friendsData[username]) {
              //     //     push((currentUserFriendRef), {
              //     //         name: username
              //     //     });
                        
              //     //   } else {
              //     //     console.log(`${username} is already a friend.`);
              //     //   }
              //     // }
              //   })
              //   .catch((error) => {
              //     console.error('Failed to fetch friends data:', error);
              //   });
            }
          }
        })
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
        updateUsers(allUsers);
      });
    };

    const updateUsers = (allUsers) => {
      setUsers(allUsers);
    };

    getUUID().then((uuid) => {
      const usernameref = ref(db, 'users/' + uuid + '/info/username');
      onValue(usernameref, (snapshot) => {
        console.log('Username pulling from cloud');
        const data = snapshot.val();
        setUsername(data);
        console.log('Username pulled from cloud');
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

      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("setGoal")}>
        <Text style={styles.buttonText}>Set Goal</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Account")}>
        <Text style={styles.buttonText}>Your Photos</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Picture")}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Social")}>
        <Text style={styles.buttonText}>Social</Text>
      </TouchableOpacity> */}
      <ScrollView style={styles.scrollContainer}>
        {displayUsers(users)}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 80,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#003f5c',
    borderRadius: 20,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  button2: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  moment: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  image2: {
    width: 45,
    height: 45,
    marginLeft: 7,
    marginTop: 7,
  },
  buttonCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    marginRight: 150,
    marginBottom: 10,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});