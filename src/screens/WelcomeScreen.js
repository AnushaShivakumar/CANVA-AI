import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(10)}}
          className="text-center font-bold text-gray-700">
          Canva AI
        </Text>
        <Text
          style={{fontSize: wp(4)}}
          className="text-center tracking-wider text-gray-600 font-semibold">
          Design Smart, Create Art – Empowering Your Creativity with AI
        </Text>
      </View>
      <View className="flex-flow justify-center">
        <Image
          source={require('../../assets/images/Welcome.webp')}
          style={{width: wp(5), height: hp(50), width: '100%'}}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="bg-emerald-600 mx-0 p-4 rounded-2xl">
        <Text
          style={{fontSize: wp(6)}}
          className="text-center font-bold text-white text-2xl">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
