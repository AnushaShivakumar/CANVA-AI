import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native'; // Combine all imports from 'react-native' here
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Features from '../components/features';
import {dummyMessages} from '../constants';
import Tts from 'react-native-tts';
import {NativeEventEmitter, NativeModules} from 'react-native';
import Voice from 'react-native-voice';
import {apiCall} from '../api/OpenAI';

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const ScrollViewRef = useRef();

  const SpeechStartHandler = e => {
    console.log('speech start handler');
  };

  const SpeechEndHandler = e => {
    console.log('Speech end handler triggered');
    setRecording(false); // Make sure this line is working correctly
  };

  const SpeechResultsHandler = e => {
    console.log('Voice event: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const SpeechErrorHandler = e => {
    console.log('speech error handler', e);
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      setRecording(true);
      Tts.stop();
      await Voice.start('en-GB');
    } catch (error) {
      console.log('Error starting recording: ', error);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      console.log('Recording stopped successfully.');
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('Error stopping recording: ', error);
    }
  };

  const fetchResponse = () => {
    if (result.trim().lenght > 0) {
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trip()});
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);
      apiCall(result.trim(), newMessagesMessages).then(res => {
        // console.log('got api data:', res);
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          setResult('');
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const startTextToSpeech = message => {
    if (!message.content.ncludes('https')) {
      setSpeaking(true);
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
        rate: 0.5,
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      ScrollViewRef?.current?.scollToEnd({animated: True});
    });
  };
  const clear = () => {
    setMessages([]);
    Tts.stop();
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };
  useEffect(() => {
    Voice.onSpeechStart = SpeechStartHandler;
    Voice.onSpeechEnd = SpeechEndHandler;
    Voice.onSpeechResults = SpeechResultsHandler;
    Voice.onSpeechError = SpeechErrorHandler;

    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-progress', event =>
      console.log('progress', event),
    );
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      Voice.removeAllListeners(); // Ensure it's called as a function
    };
  }, []);

  // console.log('result: ', result);
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
          className="flex-row justify-center">
          <Image
            source={require('../../assets/images/Bot.webp')}
            style={{height: hp(15), width: hp(15)}}
          />
        </View>

        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text
              style={{fontSize: wp(5)}}
              className="text-gray-700 font-semibold ml-1">
              Assistant
            </Text>
            <View
              style={{height: hp(58)}}
              className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                ref={ScrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role == 'assistant') {
                    if (message.content.includes('https')) {
                      //image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                            <Image
                              source={{uri: message.content}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      //text response
                      return (
                        <View
                          style={{width: wp(70)}}
                          className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                          <Text>{message.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    //user input
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white rounded-xl p-2 rounded-tr-none">
                          <Text>{message.content}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {loading ? (
            <Image source={require('../../assets/images/loading.gif')} />
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <Image
                source={require('../../assets/images/Recording1.gif')}
                style={{
                  width: hp(10),
                  height: hp(10),
                  borderRadius: hp(5), // This will make the image round, assuming it's a square
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <Image
                source={require('../../assets/images/RecordingIcon1.webp')}
                style={{
                  width: hp(10),
                  height: hp(10),
                  borderRadius: hp(5), // This will make the image round, assuming it's a square
                }}
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              style={{
                backgroundColor: '#A3A3A3',
                borderRadius: 24,
                padding: 8,
                position: 'absolute',
                right: 10,
              }}>
              <Text style={{color: 'white', fontWeight: '600'}}>Clear</Text>
            </TouchableOpacity>
          )}
          {speaking && (
            <TouchableOpacity
              onPress={stopSpeaking}
              style={{
                backgroundColor: '#F87171',
                borderRadius: 24,
                padding: 8,
                position: 'absolute',
                left: 10,
              }}>
              <Text style={{color: 'white', fontWeight: '600'}}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
