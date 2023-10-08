import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import ARView from '../components/ARView';
import LocationService from '../services/LocationService';

const ARScreen = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await LocationService.getUserLocation();
      setUserLocation(location);
    };

    fetchUserLocation();
  }, []);

  return (
    <View>
      {userLocation ? (
        <ARView userLocation={userLocation} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ARScreen;
