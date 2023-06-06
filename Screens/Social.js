import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text, FlatList } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue, set, get } from "firebase/database"
import ExpoFastImage from 'expo-fast-image'

export default function Social({ navigation }) {
  const [users, setUsers] = useState([]);

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
        const currentUserFriendRef = dbRef(db, 'users/' + uuid + '/friends');
  
        // Check if the 'friends' object exists for the current user
        get(currentUserFriendRef)
          .then((snapshot) => {
            const friendsData = snapshot.val();
  
            if (friendsData === null) {
              // Create 'friends' object if it doesn't exist
              const friends = { [username]: true };
              set(currentUserFriendRef, friends)
                .then(() => {
                  console.log(`Created friends folder and added ${username} as a friend.`);
                })
                .catch((error) => {
                  console.error('Failed to create friends folder:', error);
                });
            } else {
              // Append the 'username' to the 'friends' folder for the current user
              if (!friendsData[username]) {
                const updatedFriends = { ...friendsData, username};
                set(currentUserFriendRef, updatedFriends)
                  .then(() => {
                    console.log(`Added ${username} as a friend.`);
                  })
                  .catch((error) => {
                    console.error('Failed to add friend:', error);
                  });
              } else {
                console.log(`${username} is already a friend.`);
              }
            }
          })
          .catch((error) => {
            console.error('Failed to fetch friends data:', error);
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
            });
          }
        }
        updateUsers(allUsers);
      });
    };

    const updateUsers = (allUsers) => {
      setUsers(allUsers);
    };

    pullUsers();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("setGoal")}>
        <Text style={styles.buttonText}>Set Goal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Account")}>
        <Text style={styles.buttonText}>Your Photos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Picture")}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Social")}>
        <Text style={styles.buttonText}>Social</Text>
      </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    height: 400,
    width: Dimensions.get('window').width - 40,
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 2,
  },
  logo: {
    height: 150,
    width: 200,
    marginTop: 60,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'rgba(251, 91, 90, 0.8)', // Transparent red color with 80% opacity
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
    color: '#FFFFFF',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  moment: {
    fontSize: 14,
    color: 'white',
    marginBottom: 10,
  },
});
