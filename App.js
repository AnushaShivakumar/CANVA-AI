import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useReducer} from 'react';
import AppNavigation from './src/navigation';
import {apiCall} from './src/api/OpenAI';

export default function App() {
  useEffect(() => {
    apiCall('What is moon?');
  }, []);
  return <AppNavigation />;
}
