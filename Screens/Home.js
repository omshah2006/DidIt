import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue } from "firebase/database"

export default function Home({ navigation }) {
  const [images, setImages] = useState([]);

  const displayImages = (images) => {
    return (
      <View>
        {images.map((value, index) => (
          // <Text></Text>
          <Image key={index} source={{ uri: value.img_url }} style={styles.image} />
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
      <TouchableOpacity onPress={() => navigation.navigate("Picture")}>
        <Image 
          style={styles.logo}
          source={require('../assets/DidItLogo.png')} 
        />
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
  },
  logo: {
    height: 150, 
    width: 200,
    marginTop: 60,
    marginBottom: 0
  },
});
