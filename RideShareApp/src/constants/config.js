import { Platform } from 'react-native';

// Use an emulator-friendly host by default.
// For Android emulator use 10.0.2.2.
// For iOS simulator use localhost.
// For a physical Android device, set PHYSICAL_DEVICE_HOST to your computer LAN IP.
const PHYSICAL_DEVICE_HOST = '192.168.0.84';
const HOST = PHYSICAL_DEVICE_HOST || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
export const API_BASE_URL = `http://${HOST}:8000/api`;