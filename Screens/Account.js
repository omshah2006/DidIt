import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';



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

const displayUserNames = () => {
    const [username, setUsername] = useState(''); // Introduce state variable 'username'
    const db = getDatabase(firebase);
  
    useEffect(() => {
      getUUID().then((uuid) => {
        const usernameref = ref(db, 'users/' + uuid + '/info/username');
        onValue(usernameref, (snapshot) => {
          console.log('Username pulling from cloud');
          const data = snapshot.val();
          setUsername(data); // Update 'username' state with the retrieved value
          console.log('Username pulled from cloud');
        });
      });
    }, []);
  
    return (
        <View>
          <TouchableOpacity style={styles.button}>
            <View>
              <Text style={styles.buttonText}>{username}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
  };
  

const displayImages = (images) => {
  const imageKeys = Object.keys(images);
  console.log('Displaying images...');

  const rows = [];
  let currentRow = [];
  for (let i = 0; i < imageKeys.length; i++) {
    const key = imageKeys[i];
    const value = images[key];
    const imageComponent = (
      <Image key={key} source={{ uri: value.img_url }} style={styles.image} />
    );
    currentRow.push(imageComponent);

    if (currentRow.length === 2 || i === imageKeys.length - 1) {
      rows.push(
        <View key={`row_${i}`} style={styles.row}>
          {currentRow}
        </View>
      );
      currentRow = [];
    }
  }

  return <View style={styles.images}>{rows}</View>;
};

export default function Account({ navigation }) {
  const [images, updateImages] = useState({
    sample: {
      img_url:
        'https://firebasestorage.googleapis.com/v0/b/did-it-237f2.appspot.com/o/50c14800-29d5-47fd-9716-4a6dbf6e10d7%3Foffset%3D0%26size%3D0.jpg?alt=media&token=e3becb90-a5ce-4644-a0db-c26e10e898fc',
    },
  });

  useEffect(() => {
    const pullImages = () => {
      const db = getDatabase(firebase);
      getUUID().then((uuid) => {
        const imagesRef = ref(db, 'users/' + uuid + '/images/');

        onValue(imagesRef, (snapshot) => {
          console.log('Pulling images from cloud');
          const data = snapshot.val();
          updateImages(data);
          console.log('Images pulled from cloud');
        });
      });
    };

    pullImages();
  }, []);

  return (
    <View style={styles.container}>
      {displayUserNames()}
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
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  scrollContainer: {
    marginTop: 100,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    height: 300,
    width

: 180,
    marginHorizontal: 5,
  },
  images: {},
  button: {
    backgroundColor: '#fb5b5a',
    padding: 15,
    borderRadius: 15,
    elevation: 10,
    marginRight: 12,
    marginLeft: 3,
    marginBottom: 10,
    marginTop: 45,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
