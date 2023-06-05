import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

const randomGoals = [
  'E.g. run a mile',
  'E.g. lift some weights',
  'E.g. practice spanish',
  'E.g. do some yoga',
  'E.g. write my english essay',
  'E.g. paint a picture',
  'E.g. cook dinner',
  'E.g. drink 2 bottles of water',
];

export default function GoalScreen({ navigation }) {
  const [goal, setGoal] = useState('');
  const [isGoalSettable, setIsGoalSettable] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);

  useEffect(() => {
    const interval = setInterval(generateRandomGoal, 2000); // Generate a new random goal every 2 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const generateRandomGoal = () => {
    const randomIndex = Math.floor(Math.random() * randomGoals.length);
    setGoal(randomGoals[randomIndex]);
  };

  const handleGoalChange = (text) => {
    setGoal(text);
    setIsGoalSettable(text !== '');
  };

  const handleGoalSubmit = () => {
    if (holdTimer) {
      clearTimeout(holdTimer); // Clear the hold timer if the button is released before the hold time
      setHoldTimer(null);
    } else {
      // Perform any necessary actions with the goal (e.g., save it to a database)
      // ...
      // After performing the actions, navigate to a different screen
      navigation.navigate('Home');
    }
  };

  const handleGoalPressIn = () => {
    setHoldTimer(
      setTimeout(() => {
        // Perform any necessary actions with the goal (e.g., save it to a database)
        // ...
        // After performing the actions, navigate to a different screen
        navigation.navigate('Home');
      }, 1000) // Hold time required to trigger the submit action (in milliseconds)
    );
  };

  const handleGoalPressOut = () => {
    if (holdTimer) {
      clearTimeout(holdTimer); // Clear the hold timer if the button is released before the hold time
      setHoldTimer(null);
    }
  };

  const clearPlaceholder = () => {
    if (goal === '') {
      setGoal('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>Set Your Goal</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder={goal === '' ? 'Set your goal' : goal}
            placeholderTextColor="#000000"
            onChangeText={handleGoalChange}
            onFocus={clearPlaceholder}
          />
        </View>
        <TouchableOpacity
          style={[styles.goalBtn, !isGoalSettable && styles.disabledGoalBtn]}
          activeOpacity={0.9}
          onPressIn={handleGoalPressIn}
          onPressOut={handleGoalPressOut}
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
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#000000',
    marginBottom: 40,
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
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});