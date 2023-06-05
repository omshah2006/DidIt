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

  const rows = imageKeys.map((key, index) => {
    const value = images[key];
    return (
      <View key={`row_${index}`} style={styles.row}>
        <Text style={styles.username}>{value.username}</Text>
        <Text style={styles.moment}>{value.moment}</Text>
        <Image source={{ uri: value.img_url }} style={styles.image} />
      </View>
    );
  });

  return <View style={styles.images}>{rows}</View>;
};

export default function Account({ navigation }) {
  const [images, updateImages] = useState({
    sample: {
      img_url:
        'https://firebasestorage.googleapis.com/v0/b/did-it-237f2.appspot.com/o/50c14800-29d5-47fd-9716-4a6dbf6e10d7%3Foffset%3D0%26size%3D0.jpg?alt=media&token=e3becb90-a5ce-4644-a0db-c26e10e898fc',
      username: 'Sample User',
      moment: 'Sample Moment',
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
    paddingTop: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'column',
    marginBottom: 30,
    alignItems: 'center',
  },
  image: {
    height: 400,
    width: Dimensions.get('window').width - 40,
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 2,
  },
  images: {},
  button: {
    backgroundColor: 'rgba(251, 91, 90, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  moment: {
    fontSize: 14,
    color: 'white',
    marginBottom: 10,
  },
});
