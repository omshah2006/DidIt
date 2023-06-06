import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const randomGoals = [
  'E.g. run a mile',
  'E.g. read a book',
  'E.g. practice spanish',
  'E.g. do some yoga',
  'E.g. write a poem',
  'E.g. paint a picture',
  'E.g. cook a new recipe',
  'E.g. drink 2 bottles of water',
];

export default function GoalScreen({ navigation }) {
  const [goal, setGoal] = useState('');
  const [isGoalSettable, setIsGoalSettable] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      const interval = setInterval(generateRandomGoal, 2000); // Generate a new random goal every 2 seconds
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [isFocused]);

  const generateRandomGoal = () => {
    if (!isFocused) {
      const randomIndex = Math.floor(Math.random() * randomGoals.length);
      setGoal(randomGoals[randomIndex]);
    }
  };

  const handleGoalChange = (text) => {
    setGoal(text);
    setIsGoalSettable(text !== '');
  };

  const handleGoalSubmit = () => {
    console.log(goal)
    navigation.navigate('Picture', { goalText: goal }); // Pass the current goal state
  };

  const handleFocus = () => {
    setIsFocused(true);
    setGoal(''); // Clear the text box when the user focuses on it
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>Set Your Goal</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder=""
            placeholderTextColor="#000000"
            value={goal}
            onChangeText={handleGoalChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
        <TouchableOpacity
          style={[styles.goalBtn, !isGoalSettable && styles.disabledGoalBtn]}
          activeOpacity={0.9}
          onPress={handleGoalSubmit}
          disabled={!isGoalSettable}
        >
          <Text style={styles.goalText}>SET GOAL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
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
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputView: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputText: {
    height: 50,
    color: '#000000',
  },
  goalBtn: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  disabledGoalBtn: {
    opacity: 0.6,
  },
  goalText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});
