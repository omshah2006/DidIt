import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set } from "firebase/database";
import { firebase } from '../firebaseConfig.js';

export default function Home({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Enable/disable the button based on the presence of data in both fields
    setIsButtonDisabled(!(name && username));
  }, [name, username]);

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

  const saveUserInfo = (name, username) => {
    getUUID().then(uuid => {
      console.log(uuid);
      const db = getDatabase(firebase);
      set(ref(db, 'users/' + uuid + '/info'), {
        name: name,
        username: username
      });
    });
  };

  const handleOnboarding = () => {
    console.log("HEY");
    saveUserInfo(name, username);
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>Additional Info</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Name..."
            placeholderTextColor="#ffffff"
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Username..."
            placeholderTextColor="#ffffff"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>
        <TouchableOpacity
          style={[styles.loginBtn, isButtonDisabled && styles.disabledButton]}
          activeOpacity={0.9}
          onPress={handleOnboarding}
          disabled={isButtonDisabled}
        >
          <Text style={styles.loginText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#000",
    marginBottom: 40
  },
  inputView: {
    width: "100%",
    backgroundColor: "#000000",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  inputText: {
    height: 50,
    color: "#ffffff"
  },
  loginText: {
    color: "#ffffff"
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#000000",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  disabledButton: {
    opacity: 0.5,
  },
});
