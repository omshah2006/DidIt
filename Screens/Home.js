import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue } from "firebase/database"

export default function Home({ navigation }) {
  const [images, setImages] = useState([]);

  const displayImages = (images) => {
    // console.log(images)
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
            const usernameRef = ref(db, 'users/' + uuid + '/info/');

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
        console.log(allImages)
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
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Account")}>
            <Text style={styles.buttonText}>Your Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Picture")}>
            <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
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
  },
  scrollContainer: {
    showsVerticalScrollIndicator: false,
  },
  image: {
    height: 650,
    width: 361,
    marginTop: 50,
    marginBottom: 50,
    borderColor: '#000000',
    borderWidth: 2,
  },
  logo: {
    height: 150, 
    width: 200,
    marginTop: 60,
    marginBottom: 0
  },
  button: {
    backgroundColor: '#fb5b5a',
    padding: 10,
    borderRadius: 15,
    elevation: 10,
    marginRight: 12,
    marginLeft: 3,
    marginBottom: 10,
    marginTop:45,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
