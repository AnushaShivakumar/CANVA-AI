import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {
  return (
    <View style={{height: hp(60)}} className="space-y-4">
      <Text style={{fontSize: wp(6.5)}} className="font-semibold text-gray-700">
        Features
      </Text>
      <View className="bg-blue-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-1">
          <Image
            source={require('../../assets/images/CanvaAIlogo.webp')}
            style={{height: hp(4), width: hp(4)}}
          />

          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            CanvaAI
          </Text>
        </View>

        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          Canva AI empowers you to effortlessly create stunning designs with
          intelligent, AI-driven tools that elevate your creativity.
        </Text>
      </View>
      <View className="bg-purple-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-1">
          <Image
            source={require('../../assets/images/chatgptLogo.webp')}
            style={{height: hp(4), width: hp(4)}}
          />
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            DALL-E
          </Text>
        </View>

        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          DALL-E transforms your imagination into reality with AI-driven image
          generation, turning text prompts into stunning visual creations
        </Text>
      </View>
      {/* <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
        <View className="flex-row items-center space-x-1">
          <Image
            source={require('../../assets/images/chatgptLogoGreen.webp')}
            style={{height: hp(4), width: hp(4)}}
          />
          <Text
            style={{fontSize: wp(4.8)}}
            className="font-semibold text-gray-700">
            ChatGPT
          </Text>
        </View>

        <Text style={{fontSize: wp(3.8)}} className="text-gray-700 font-medium">
          ChatGPT enhances communication by providing intelligent,
          conversational AI that assists, informs, and entertains through
          natural language understanding.
        </Text>
      </View> */}
    </View>
  );
}
