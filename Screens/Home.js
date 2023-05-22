import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, Dimensions, ScrollView, StatusBar } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue} from "firebase/database"


export default function Home({navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [images, updateImages] = useState("");

  useEffect(() => {
    const pullImages = () => {
      const db = getDatabase(firebase);
      const uuid = 'Mw4QJD3P1OSzQg1K26jhnUQsnT62'
      const imagesRef = ref(db, 'users/' + uuid + '/images/');

      onValue(imagesRef, (snapshot) => {
        const data = snapshot.val();
        updateImages(data)
        // console.log(Object.keys(data))
      });
    }

    pullImages()
  }, [])


  testImage = images
  imageKeys = Object.keys(testImage)
  sampleImageURL = testImage[imageKeys[0]]
  console.log(sampleImageURL)
  // console.log(sampleImageURL)


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Image 
          style={styles.image}
          source={sampleImageURL["img_url"]} 
          // source={sampleImageURL} 
        />
        <Image 
          style={styles.image}
          source={require('../assets/henryandom3.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('../assets/henryandom3.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('../assets/henryandom3.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('../assets/henryandom3.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('../assets/henryandom3.jpg')} 
        />
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    backgroundColor: '#FFFDD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    showsVerticalScrollIndicator: false,
  },
  image: {
    height: 400, 
    width: Dimensions.get('window').width,
    marginTop: 50,
    marginBottom: 50
  }
});



//   return (
//     <View style={styles.container}>
//       <Button 
//         style={styles.Button}
//         title="Home"
//         onPress={() => navigation.navigate("Picture", { language: "english" })}
//       />
//       {/* <View style={styles.cameraContainer}>
//       </View> */}
//       {/* <View style={styles.inputView}>
//         <TextInput  
//           style={styles.inputText}
//           placeholder="Name..." 
//           placeholderTextColor="#0a3e57"
//           value={email}
//           onChangeText={text => setEmail(text)}
//         />
//       </View>
//       <View style={styles.inputView}>
//         <TextInput  
//           secureTextEntry
//           style={styles.inputText}
//           placeholder="Password..." 
//           placeholderTextColor="#003f5c"
//           value={password}
//           onChangeText={text => setPassword(text)}
//         />
//       </View>
//       <TouchableOpacity style={styles.loginBtn} activeOpacity={0.9}>
//         <Text style={styles.loginText}>Pull Picture</Text>
//       </TouchableOpacity> */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   logo:{
//     fontWeight:"bold",
//     fontSize:50,
//     color:"#fb5b5a",
//     marginBottom:40
//   },
//   inputView:{
//     width:"80%",
//     backgroundColor:"#465881",
//     borderRadius:25,
//     height:50,
//     marginBottom:20,
//     justifyContent:"center",
//     padding:20
//   },
//   inputText:{
//     height:50,
//     color:"white"
//   },
//   cameraContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#FFD700',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   forgot:{
//     color:"white",
//     fontSize:11
//   },
//   loginText:{
//     color:"white"
//   },
//   loginBtn:{
//     width:"80%",
//     backgroundColor:"#fb5b5a",
//     borderRadius:25,
//     height:50,
//     alignItems:"center",
//     justifyContent:"center",
//     marginTop:40,
//     marginBottom:10
//   },
//   Button:{
//     color:"black"
//   },
// });
