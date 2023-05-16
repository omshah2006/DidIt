import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, Image } from 'react-native'
import { firebase } from '../firebaseConfig.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database"


const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()
  const auth = getAuth(firebase)

  const navigateToPostAuth = (isNewUser) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        if (isNewUser) {
          navigation.replace("Onboarding")
        } else {
          navigation.replace("Home")
        }
      }
    })

    return unsubscribe
  }

  const createUser = (userId) => {
    const db = getDatabase(firebase);
    set(ref(db, 'users/' + userId), {
      num_images: 0
    });
  }

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(user.uid);
        createUser(user.uid);

        console.log('Registered with:', user.email);
        navigateToPostAuth(isNewUser = true);
      })
      .catch(error => alert(error.message))
  }

  const handleLogin = () => {
    const auth = getAuth(firebase)
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        navigateToPostAuth(isNewUser = false);
      })
      .catch(error => alert(error.message))
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} 
      accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
         <Text style={styles.logo}>Did It</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Picture")}>
        <Image 
          style={styles.image}
          source={require('/Users/henrystickel/Desktop/DidItHenry/assets/DidItLogo.png')} 
        />
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Photos")}>
            <Text style={styles.buttonText}>See Photos</Text>
        </TouchableOpacity>


        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email..." 
            placeholderTextColor="#003f5c"
            value={email}
            onChangeText={text => setEmail(text)}
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

          <TouchableOpacity style={styles.loginBtn} activeOpacity = {0.9} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupBtn} activeOpacity = {0.9} onPress={handleSignUp}>
            <Text style={styles.loginText}>SIGNUP</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 150, 
    width: 200,
    marginTop: 0,
    marginBottom: 50
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
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
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
  signupBtn:{
    width:"80%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:4,
    marginBottom:10,
    borderColor: '#fb5b5a',
    borderWidth: 2,
  },
  loginText:{
    color:"white"
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#fb5b5a',
    padding: 8,
    borderRadius: 15,
    elevation: 2,
    marginRight: 12,
    marginLeft: 3,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
})