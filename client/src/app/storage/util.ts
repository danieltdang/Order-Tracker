import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error('Error storing data:', e);
    }
}

export const getData = async (key: string) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.error('Error getting data:', e);
        return null;
    }
}

export const clearData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {
        console.error('Error clearing data:', e);
    }
}