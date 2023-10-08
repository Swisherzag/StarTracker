import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'startracker_cache';

const CacheService = {
  async saveData(data) {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to cache:', error);
    }
  },

  async getData() {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error('Error fetching data from cache:', error);
      return null;
    }
  },
};

export default CacheService;
