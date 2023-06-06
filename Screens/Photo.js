import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { uploadBytesResumable, ref, getStorage, getDownloadURL, } from "firebase/storage"
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref as dbRef, set, push, get, onValue, once} from "firebase/database"
import uuid4 from 'uuid4';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
import * as Haptics from 'expo-haptics';

export default function Subtract({ navigation, route }) {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const NewScreen = ({ route }) => {
    const { imageUri } = route.params;
  }
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

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === 'granted');

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);

    setGalleryPermission(imagePermission.status === 'granted');

    if (
      imagePermission.status !== 'granted' &&
      cameraPermission.status !== 'granted'
    ) {
      alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const addImageReference = async (image_url, goalText) => {
    try {
      const uuid = await getUUID();
      const db = getDatabase(firebase);
      console.log(uuid);
      console.log('No Error Yet1');
      console.log('users/' + uuid + '/info/username');
      const usernameref = dbRef(db, 'users/' + uuid + '/info/username');
      console.log("hi");
  
      get(usernameref)
        .then((snapshot) => {
          const data = snapshot.val();
          console.log('Username retrieved:', data);
          const { goalSet } = route.params;
          console.log(goalSet)
          const imageRef = dbRef(db, 'users/' + uuid + '/images');
          const newImageRef = push(imageRef);
          console.log('Yo')
          time = moment().format('MMMM Do YYYY, h:mm:ss a');
          set(newImageRef, {
            img_url: image_url,
            username: data, // Use the retrieved username here
            moment: time,
            goal: goalSet,
          });
          
          console.log('Image reference added to the database.');
        })
        .catch((error) => {
          console.error('Error retrieving username:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  // const takePicture = async () => {
  //   if (camera) {
  //     const data = await camera.takePictureAsync({quality: 0.1});
  //     setImageUri(data.uri);
  //     const storage = getStorage(); //the storage itself
  //     var uuid = uuid4();
  //     const storageRef = ref(storage, uuid + '.jpg');

  //     const img = await fetch(data.uri);
  //     const bytes = await img.blob();
      
  //     await uploadBytesResumable(storageRef, bytes).then((snapshot) => {

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    send();
    navigation.navigate("Home")
  };
  

  const send = async () => {
      try {
        const img = await fetch(route.params.imageData);
        const bytes = await img.blob();
        const storage = getStorage(); // the storage itself
        const uuid = uuid4();
        const storageRef = ref(storage, uuid + '.jpg');
        const uploadTask = uploadBytesResumable(storageRef, bytes);
        const snapshot = await uploadTask;
        console.log('Uploaded an image!');
  
        const url = await getDownloadURL(snapshot.ref);
        console.log(url);
        addImageReference(url);
      } 
      catch (error) {
        console.error('Error uploading image:', error);
      }
  };
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // console.log(result.uri)
      const storage = getStorage(); //the storage itself
      var uuid = uuid4();
      const storageRef = ref(storage, uuid + '.jpg');

      //convert image to array of bytes
      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();

      uploadBytesResumable(storageRef, bytes).then((snapshot) => {
        console.log('Uploaded an image!');
      });

      const url = await getDownloadURL(storageRef);
      console.log(url)

      addImageReference(url)
    }
  };
  


  const saveImage = async () => {
    if (Platform.OS === 'ios') {
      await MediaLibrary.saveToLibraryAsync(imageUri);
    } else {
      const albumName = 'MyPhotos';
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        let album = await MediaLibrary.getAlbumAsync(albumName);
        if (album === null) {
          album = await MediaLibrary.createAlbumAsync(albumName);
        }
        await MediaLibrary.addAssetsToAlbumAsync([imageUri], album.id);
      } else {
        alert('Permission to access camera roll is required!');
      }
    }
  };

    return (
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
        <Image source={{ uri: route.params.imageData }} style={{flex:1}} />
        </View>
        <View style={styles.container2}>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.buttonCircle2}  onPress={() => navigation.navigate("Picture")}>
          <Image 
          style={styles.image}
          source={require('../assets/back.png')} 
        />
        </TouchableOpacity>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.buttonCircle2}  onPress={handlePress}>
          <Image 
          style={styles.image}
          source={require('../assets/sned.png')} 
        />
        </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    buttons: {
      flex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flexDirection: 'column',
    },
    container2: {
      flex: 1, 
      flexDirection: 'row',
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraContainer: {
      flex: 4,
    },
    fixedRatio: {
      aspectRatio: 0.5,
    },
    container: {
      flex: 1,
    },
    button: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',

  },
  image: {
    width: 45,
    height: 45,
    marginLeft: 7,
    marginTop: 7,
  },
  buttonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  buttonCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  });