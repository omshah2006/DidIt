import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, ScrollView, Dimensions } from 'react-native';

export default function Photos({navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Image 
          style={styles.image}
          source={require('/Users/henrystickel/Desktop/DidItHenry/assets/DidItLogo.png')} 
        />
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      backgroundColor: '#465881',
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
    }
  });
  
