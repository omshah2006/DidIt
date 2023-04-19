import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const FriendsList = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
  ]);

  const [newFriend, setNewFriend] = useState('');

  const handleAddFriend = () => {
    const id = friends.length + 1;
    setFriends([...friends, { id, name: newFriend }]);
    setNewFriend('');
  };

  const renderFriendItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id.toString()}
      />

      <View style={{ marginTop: 20 }}>
        <TextInput
          style={{ height: 40, borderWidth: 1, padding: 10 }}
          value={newFriend}
          onChangeText={setNewFriend}
          placeholder="Enter a friend's name"
        />

        <TouchableOpacity
          style={{ marginTop: 10, backgroundColor: 'blue', padding: 10, borderRadius: 5 }}
          onPress={handleAddFriend}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendsList;