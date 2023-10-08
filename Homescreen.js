import React from 'react';
import { View, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Open AR View"
        onPress={() => navigation.navigate('AR')}
      />
    </View>
  );
};

export default HomeScreen;
