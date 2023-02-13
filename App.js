import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Image 
          style={styles.image}
          source={require('./assets/henryandom.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('./assets/henryandom.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('./assets/henryandom.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('./assets/henryandom.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('./assets/henryandom.jpg')} 
        />
        <Image 
          style={styles.image}
          source={require('./assets/henryandom.jpg')} 
        />
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
    height: 450, 
    width: Dimensions.get('window').width,
    marginTop: 50,
    marginBottom: 50
  }
});
