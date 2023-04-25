import { React, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button} from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

export default function Signup({navigation}) {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignup = () => {
        const auth = getAuth(firebase);
        createUserWithEmailAndPassword(email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email);
          })
          .catch(error => alert(error.message))
      }

      return (
        <View style={styles.container}>
  
          <Text style={styles.logo}>Did It</Text>

          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Username..." 
              placeholderTextColor="#003f5c"
              value={username}
              onChangeText={text => setUsername(text)}/>
          </View>
          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Email..." 
              placeholderTextColor="#003f5c"
              value={email}
              onChangeText={text => setEmail(text)}/>
          </View>
          <View style={styles.inputView} >
            <TextInput  
              secureTextEntry
              style={styles.inputText}
              placeholder="Password..." 
              placeholderTextColor="#003f5c"
              value={password}
              onChangeText={text => setPassword(text)}/>
          </View>
          <TouchableOpacity style={styles.loginBtn} activeOpacity = {0.9} onPress={handleSignup}>
            <Text style={styles.loginText}>SIGNUP</Text>
          </TouchableOpacity>
    
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#003f5c',
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    forgot:{
      color:"white",
      fontSize:11
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
    loginText:{
      color:"white"
    },
  });
  
