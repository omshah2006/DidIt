import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button } from 'react-native';

export default function Home({navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

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
          value={email}
          onChangeText={text => setName(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput  
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..." 
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity activeOpacity={0.9}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} activeOpacity={0.9}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.9}>
        <Text style={styles.loginText}>Signup</Text>
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
    backgroundColor: '#FFD700',
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
