import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { uploadBytesResumable, ref, getStorage, getDownloadURL } from "firebase/storage"
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref as dbRef, set, push } from "firebase/database"
import uuid4 from 'uuid4';

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

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
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
  

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={saveImage}>
          <Text style={styles.buttonText}>Save to Camera Roll</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={flipCamera}>
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={{ flex: 1 }} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fb5b5a',
    padding: 3,
    borderRadius: 2,
    elevation: 2,
    marginRight: 12,
    marginLeft: 3,
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});