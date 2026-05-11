import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import TokenScreen from '../screens/TokenScreen';
import NearbyTokensScreen from '../screens/NearbyTokensScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ConnectionsScreen from '../screens/ConnectionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Token') iconName = 'ticket';
          else if (route.name === 'Nearby') iconName = 'location';
          else if (route.name === 'Requests') iconName = 'chatbubbles';
          else if (route.name === 'Connections') iconName = 'people';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Token" component={TokenScreen} options={{ title: 'Token' }} />
      <Tab.Screen name="Nearby" component={NearbyTokensScreen} options={{ title: 'Nearby' }} />
      <Tab.Screen name="Requests" component={RequestsScreen} options={{ title: 'Requests' }} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} options={{ title: 'Connections' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}