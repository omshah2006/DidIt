import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue } from "firebase/database"
import ExpoFastImage from 'expo-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUUID = async () => {
  try {
    const value = await AsyncStorage.getItem('@session_id')
    if (value !== null) {
      return value
    }
  } catch (e) {
    console.log(e)
  }
}

export default function Home({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const displayImages = (images) => {
    // Sort the images based on post time
    const sortedImages = images.sort((a, b) => {
      const momentA = new Date(a.moment).getTime();
      const momentB = new Date(b.moment).getTime();
      return momentA - momentB;
    });
  
    return (
      <View style={styles.imageWrapper}>
        {sortedImages.reverse().map((value, index) => (
          <View key={index} style={[styles.imageContainer, styles.roundedContainer]}>
            <Text style={styles.username}>{value.username}</Text>
            <Text style={styles.moment}>{value.moment}</Text>
            <ExpoFastImage
              source={{ uri: value.img_url }}
              style={[styles.image, styles.roundedImage]}
            />
            <Text style={styles.moment}>{value.goal}</Text>
          </View>

        ))}
      </View>
    );
  };

  useEffect(() => {
    const pullImages = () => {
      const db = getDatabase(firebase);
      const usersRef = ref(db, 'users/');

      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        const allImages = [];

        for (const uuid in users) {
          if (Object.hasOwnProperty.call(users, uuid)) {
            const imagesRef = ref(db, 'users/' + uuid + '/images/');

            onValue(imagesRef, (snapshot) => {
              const images = snapshot.val();

              if (images) {
                for (const imageKey in images) {
                  if (Object.hasOwnProperty.call(images, imageKey)) {
                    allImages.push(images[imageKey]);
                  }
                }
              }

            });
          }
        }
        updateImages(allImages);
      });
    };

  const updateImages = (allImages) => {
    setImages(allImages);
    setLoading(false);
  };

  useEffect(() => {
    pullImages();
  }, []);

  const displayImages = (images) => {
    const sortedImages = images.sort((a, b) => {
      const momentA = new Date(a.moment).getTime();
      const momentB = new Date(b.moment).getTime();
      return momentA - momentB;
    });

    return (
      <View style={styles.imageWrapper}>
        {sortedImages.reverse().map((value, index) => (
          <View key={index} style={[styles.imageContainer, styles.roundedContainer]}>
            <Text style={styles.username}>{value.username}</Text>
            <Text style={styles.moment}>{value.moment}</Text>
            <ExpoFastImage
              source={{ uri: value.img_url }}
              style={[styles.image, styles.roundedImage]}
            />
            <Text style={styles.moment}>{value.goal}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("setGoal")}>
          <Text style={styles.buttonText}>Set Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Account")}>
          <Text style={styles.buttonText}>Your Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Picture")}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Social")}>
          <Text style={styles.buttonText}>Social</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          displayImages(images)
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    paddingTop: 40,
    alignItems: 'center',
  },
  contentContainer: {
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
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
  scrollContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  roundedContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
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
});
