import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  FlatList,
  TextInput,
} from 'react-native';
import { firebase } from '../firebaseConfig.js';
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  push,
} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Social({ navigation }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const displayUsers = (users) => {
    const filteredUsers = users.filter(
      (user) =>
        user.info &&
        user.info.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View>
        {filteredUsers.map((value, index) => (
          <View key={index} style={styles.imageContainer}>
            <View style={styles.rowContainer}>
              {value.info && value.info.username ? (
                <>
                  <Text style={styles.username}>{value.info.username}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddFriend(value.info.username)}
                  >
                    <Text style={styles.button2}>Add Friend</Text>
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
        const uuidForUsernameRef = ref(db, 'users/');
        get(uuidForUsernameRef).then((snapshot) => {
          const users = snapshot.val();
          for (userUUID in users) {
            if (
              users[userUUID]['info']['username'] === username &&
              userUUID !== uuid
            ) {
              push(ref(db, 'users/' + uuid + '/friends/'), {
                friend_uuid: userUUID,
                name: username,
              });
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    const pullUsers = () => {
      const db = getDatabase(firebase);
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

              updateUsers(allUsers);
            });
          }
        }
      });
    };

    const updateUsers = (allUsers) => {
      setUsers(allUsers);
    };

    pullUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('setGoal')}
        >
          <Text style={styles.buttonText}>Set Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Account')}
        >
          <Text style={styles.buttonText}>Your Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Picture')}
        >
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Social')}
        >
          <Text style={styles.buttonText}>Social</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <ScrollView style={styles.scrollContainer}>
          {displayUsers(users)}
        </ScrollView>
      </View>
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
    backgroundColor: 'black',
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
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginHorizontal: 5,
    marginBottom: 10,
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
  searchInput: {
    backgroundColor: 'grey',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 10,
    color: 'black',
  },
});
