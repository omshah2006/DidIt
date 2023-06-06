import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GoalScreen({ navigation }) {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleCheckboxToggle = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleGoalSubmit = () => {
    navigation.navigate('Picture');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.logo}>Have You Completed Your Goal?</Text>
        <TouchableOpacity
          style={[styles.checkboxContainer, isCheckboxChecked && styles.checkboxContainerChecked]}
          activeOpacity={0.8}
          onPress={handleCheckboxToggle}
        >
          {!isCheckboxChecked && <View style={styles.checkboxMark} />}
          {isCheckboxChecked && <Ionicons name="checkbox" size={40} color="#000000" />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.goalBtn, !isCheckboxChecked && styles.disabledGoalBtn]}
          activeOpacity={0.9}
          onPress={handleGoalSubmit}
          disabled={!isCheckboxChecked}
        >
          <Text style={styles.goalText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  checkboxPlaceholder: {
    position: 'absolute',
    top: 8,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000000',
  },

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
    height: 60,
    width: 60,
  },

  checkboxContainerChecked: {
    backgroundColor: '#ffffff',
  },

  checkboxMark: {
    position: 'absolute',
    top: 12.4,
    left: 11.2,
    width: 32.5,
    height: 32.5,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
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
