import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Dimensions, ScrollView, StatusBar, Text, TextInput } from 'react-native';
import { firebase } from '../firebaseConfig.js';
import { getDatabase, ref, onValue, push, set } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid4 from 'uuid4';

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

export default function Communities({ navigation }) {
  const [communities, setCommunities] = useState([]);
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');

  useEffect(() => {
    const db = getDatabase(firebase);
    const communitiesRef = ref(db, 'communities/');

    onValue(communitiesRef, (snapshot) => {
      const communitiesData = snapshot.val();
      const allCommunities = [];

      for (const communityId in communitiesData) {
        if (Object.hasOwnProperty.call(communitiesData, communityId)) {
          const community = {
            id: communityId,
            ...communitiesData[communityId]
          };

          allCommunities.push(community);
        }
      }

      setCommunities(allCommunities);
    });
  }, []);

  const handleCreateCommunity = () => {
    getUUID().then((uuid) => {
      const uuid4Value = uuid4();
      const db = getDatabase(firebase);
      const communityRef = ref(db, 'communities/' + uuid4Value);
      
      set(communityRef, {
        name: communityName,
        description: communityDescription,
        owner: uuid
      });

      // Reset the input fields
      setCommunityName('');
      setCommunityDescription('');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonCircle2} onPress={() => navigation.navigate("Home")}>
          <Image style={styles.image2} source={require('../assets/back.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Community</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultContainer}>
        {communities.map((community) => (
          <View key={community.id} style={styles.communityContainer}>
            <Text style={styles.communityName}>{community.name}</Text>
            <Text style={styles.communityDescription}>{community.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.createContainer}>
        <TextInput
          style={styles.input}
          placeholder="Community Name"
          value={communityName}
          onChangeText={setCommunityName}
        />
        <TextInput
          style={styles.input}
          placeholder="Community Description"
          value={communityDescription}
          onChangeText={setCommunityDescription}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCommunity}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
        
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  buttonCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    marginRight: 150,
    marginBottom: 10,
    marginTop: 20,
  },
  image2: {
    width: 45,
    height: 45,
    marginLeft: 7,
    marginTop: 7,
  },
  button: {
    backgroundColor: '#FF5B42',
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
    color: 'white',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  resultContainer: {
    maxHeight: 500,
    borderRadius: 15,
  },
  communityContainer: {
    marginBottom: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  communityDescription: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  createContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    width: 300,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  createButton: {
    backgroundColor: '#FF5B42',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 10,
    marginBottom: 10,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});
