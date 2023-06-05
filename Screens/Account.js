import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, Dimensions, ScrollView, StatusBar } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue} from "firebase/database"
import AsyncStorage from '@react-native-async-storage/async-storage';


const displayImages = (images) => {
  console.log(images)
  if (!images) {
    return (
      <View>
        <Text>You have no images dumbass</Text>
      </View>
    );
  } else {
    imageKeys = Object.keys(images)
    console.log("Displaying images...")
    return (
      <View>
        {Object.entries(images).map(([key, value]) => (
          <Image key={key} source={{ uri: value.img_url }} style={styles.image} />
        ))}
      </View>
    );
  }
};

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

export default function Account({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [images, updateImages] = useState({"sample" : {"img_url": "https://firebasestorage.googleapis.com/v0/b/did-it-237f2.appspot.com/o/50c14800-29d5-47fd-9716-4a6dbf6e10d7%3Foffset%3D0%26size%3D0.jpg?alt=media&token=e3becb90-a5ce-4644-a0db-c26e10e898fc"}});
  const [images, updateImages] = useState([])

  useEffect(() => {
    const pullImages = () => {
      const db = getDatabase(firebase);
      getUUID()
      .then(uuid => {
        const imagesRef = ref(db, 'users/' + uuid + '/images/');

        onValue(imagesRef, (snapshot) => {
          console.log("Pulling images from cloud")
          const data = snapshot.val();
          updateImages(data)
          console.log("Images pulled from cloud")
        });
      })
    }

    pullImages()
  }, [])


  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {displayImages(images)}
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