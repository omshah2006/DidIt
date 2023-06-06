import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoFastImage from 'expo-fast-image'

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

const displayUserNames = (navigation) => {
  const [username, setUsername] = useState('');
  const db = getDatabase(firebase);

  useEffect(() => {
    getUUID().then((uuid) => {
      const usernameref = ref(db, 'users/' + uuid + '/info/username');
      onValue(usernameref, (snapshot) => {
        console.log('Username pulling from cloud');
        const data = snapshot.val();
        setUsername(data);
        console.log('Username pulled from cloud');
      });
    });
  }, []);

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.buttonCircle2} onPress={() => navigation.navigate("Home")}>
        <Image style={styles.image2} source={require('../assets/back.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{username}</Text>
      </TouchableOpacity>
    </View>
  );
};

const displayImages = (images) => {
  const imageKeys = Object.keys(images);
  console.log('Displaying images...');
  const rows = imageKeys.reverse().map((key, index) => {
    const value = images[key];
    return (
      <View key={`row_${index}`} style={[styles.imageContainer, styles.roundedContainer, styles.row]}>
        <Text style={styles.username}>{value.username}</Text>
        <Text style={styles.moment}>{value.moment}</Text>
        <ExpoFastImage source={{ uri: value.img_url }} style={[styles.image, styles.roundedImage]} />
        <Text style={styles.moment}>{value.goal}</Text>
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
      {displayUserNames(navigation)}
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
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
  roundedImage: {
    borderRadius: 10,
  },
  buttonCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    marginRight: 150,
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: 'rgba(251, 91, 90, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginBottom: 10,
    marginTop: 10,
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
    color: 'black',
  },
  moment: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  images: {
    marginBottom: 20,
  },
  image2: {
    width: 45,
    height: 45,
    marginLeft: 7,
    marginTop: 7,
  },
});
