import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { uploadBytesResumable, ref, getStorage, getDownloadURL } from "firebase/storage"
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref as dbRef, set, push } from "firebase/database"
import uuid4 from 'uuid4'


export default function Add({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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

  const addImageReference = (userId, image_url) => {
    const db = getDatabase(firebase);
    push(dbRef(db, 'users/' + userId + "/" + "images"), {
      img_url: image_url
    });
  }

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({quality: 0.1});
      setImageUri(data.uri);
      const storage = getStorage(); //the storage itself
      var uuid = uuid4();
      const storageRef = ref(storage, uuid + '.jpg');

      const img = await fetch(data.uri);
      const bytes = await img.blob();
      
      await uploadBytesResumable(storageRef, bytes).then((snapshot) => {
        console.log('Uploaded an image!');
      });
      const url = await getDownloadURL(storageRef);
      console.log(url)

      addImageReference("Mw4QJD3P1OSzQg1K26jhnUQsnT62", url)
    }
  }

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

      addImageReference("Mw4QJD3P1OSzQg1K26jhnUQsnT62", url)
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
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
        />
        </View>
        <View style={styles.container2}>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.buttonCircle2}  onPress={() => navigation.navigate("Signup")}>
          <Image 
          style={styles.image}
          source={require('../assets/back.png')} 
        />
        </TouchableOpacity>
        </View>
        <View style={styles.buttons}>
        <View style={styles.button}>
          <View style={styles.buttonInner}>
          <TouchableOpacity style={styles.buttonCircle}  onPress={takePicture}/>
          </View>
          </View>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.buttonCircle2}  onPress={flipCamera}>
          <Image 
          style={styles.image}
          source={require('../assets/flipCamera.png')} 
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