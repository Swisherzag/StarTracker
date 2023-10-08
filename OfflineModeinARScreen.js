import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import ARView from '../components/ARView';
import LocationService from '../services/LocationService';
import CacheService from '../services/cacheService'; // Import the cache service

const ARScreen = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      // Check if offline mode is enabled
      const offlineModeEnabled = await CacheService.getData();

      if (offlineModeEnabled) {
        // Load cached location data if available
        const cachedLocation = await CacheService.getData();
        if (cachedLocation) {
          setUserLocation(cachedLocation);
        } else {
          console.error('Offline mode enabled, but no cached location data found.');
        }
      } else {
        // Fetch user location if offline mode is disabled
        const location = await LocationService.getUserLocation();
        setUserLocation(location);

        // Save location data to cache
        CacheService.saveData(location);
      }
    };

    fetchUserLocation();
  }, []);

  // Function to toggle offline mode
  const toggleOfflineMode = async () => {
    const offlineModeEnabled = await CacheService.getData();

    if (offlineModeEnabled) {
      // Clear cached location data
      await CacheService.saveData(null);
    } else {
      // Save current location to cache
      const location = await LocationService.getUserLocation();
      CacheService.saveData(location);
    }

    // Reload the screen to apply changes
    window.location.reload();
  };

  return (
    <View>
      <Button
        title="Toggle Offline Mode"
        onPress={toggleOfflineMode}
      />
      {userLocation ? (
        <ARView userLocation={userLocation} />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ARScreen;
