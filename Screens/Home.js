import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text, FlatList } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue } from "firebase/database"
import ExpoFastImage from 'expo-fast-image'

export default function Home({ navigation }) {
  const [images, setImages] = useState([]);

  const displayImages = (images) => {
    return (
      <View>
        {images.map((value, index) => (
          <View key={index} style={styles.imageContainer}>
            <Text style={styles.username}>{value.username}</Text>
            <Text style={styles.moment}>{value.moment}</Text>
            <ExpoFastImage source={{ uri: value.img_url }} style={styles.image} />
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
      // console.log(allImages);
    };

    pullImages();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate("setGoal")}>
          <Text style={styles.buttonText}>Set Goal</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Account")}>
            <Text style={styles.buttonText}>Your Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Picture")}>
            <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        </View>
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
    paddingTop: 40,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    height: 400,
    width: Dimensions.get('window').width - 40,
    marginBottom: 20,
    borderColor: '#000000',
    borderWidth: 2,
  },
  logo: {
    height: 150,
    width: 200,
    marginTop: 60,
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'rgba(251, 91, 90, 0.8)', // Transparent red color with 80% opacity
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
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
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
  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});


