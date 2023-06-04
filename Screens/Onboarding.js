import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, set } from "firebase/database"
import { firebase } from '../firebaseConfig.js';


export default function Home({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const getUUID = async () => {
    try {
      const value = await AsyncStorage.getItem('@session_id')
      if(value !== null) {
        return value
      }
    } catch(e) {
      console.log(e)
    }
  }

  const saveUserInfo = (name, username) => {
    getUUID()
      .then(uuid => {
        console.log(uuid)
        const db = getDatabase(firebase);
        set(ref(db, 'users/' + uuid + '/info'), {
          name: name,
          username: username
        });
      })
  }

  const handleOnboarding = () => {
    console.log("HEY");
    saveUserInfo(name, username);
    navigation.replace("Home");
  }

  return (
    <View style={styles.container}>
      {/* <Button 
        style={styles.Button}
        title="Onboarding"
        onPress={() => navigation.navigate("Picture", { language: "english" })}
      /> */}
      <Text style={styles.logo}>Onboarding</Text>
      <View style={styles.inputView}>
        <TextInput  
          style={styles.inputText}
          placeholder="Name..." 
          placeholderTextColor="#0a3e57"
          value={name}
          onChangeText={text => setName(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput  
          style={styles.inputText}
          placeholder="Username..." 
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} activeOpacity={0.9} onPress={handleOnboarding}>
        <Text style={styles.loginText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginText:{
    color:"white"
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  Button:{
    color:"black"
  },
});
