import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, Alert, ActivityIndicator } from 'react-native';
import { useAudioRecording } from '../../../hooks/useAudioRecording';
import { WhisperApiService } from '../../../services/whisperApi';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

// Initialize Whisper service with your OpenAI API key
const whisperService = new WhisperApiService('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');

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  placeholder = "Tanya soalan tentang Asas Sains Komputer..." 
}) => {
  const [message, setMessage] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { 
    isRecording, 
    isProcessing, 
    startRecording, 
    stopRecording, 
    duration 
  } = useAudioRecording();

  const handleSend = () => {
    if (message.trim() && !isLoading && !isTranscribing) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleMicrophonePress = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      try {
        const audioUri = await stopRecording();
        if (audioUri) {
          setIsTranscribing(true);
          
          // Transcribe audio using Whisper
          const transcription = await whisperService.transcribeAudio(audioUri);
          
          if (transcription) {
            setMessage(transcription);
          } else {
            Alert.alert('Error', 'Could not transcribe audio. Please try again.');
          }
        }
      } catch (error) {
        console.error('Transcription error:', error);
        Alert.alert('Error', 'Failed to transcribe audio. Please check your internet connection and try again.');
      } finally {
        setIsTranscribing(false);
      }
    } else {
      // Start recording
      try {
        await startRecording();
      } catch (error) {
        console.error('Recording error:', error);
        Alert.alert('Permission Required', 'Please allow microphone access to use voice input.');
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isInputDisabled = isLoading || isRecording || isTranscribing || isProcessing;

  return (
    <View className="flex-row items-center p-4 bg-white border-t border-gray-200">
      {/* Recording indicator */}
      {isRecording && (
        <View className="absolute top-0 left-0 right-0 bg-red-500 px-4 py-2">
          <Text className="text-white text-center font-medium">
            Recording: {formatDuration(duration)}
          </Text>
        </View>
      )}

      {/* Transcription indicator */}
      {isTranscribing && (
        <View className="absolute top-0 left-0 right-0 bg-blue-500 px-4 py-2">
          <Text className="text-white text-center font-medium">
            Transcribing audio...
          </Text>
        </View>
      )}

      {/* Microphone button */}
      <Pressable
        onPress={handleMicrophonePress}
        disabled={isLoading || isTranscribing}
        className={`
          w-12 h-12 rounded-full items-center justify-center mr-3
          ${isRecording 
            ? 'bg-red-500' 
            : isTranscribing 
              ? 'bg-blue-500'
              : 'bg-gray-300'
          }
        `}
      >
        {isTranscribing ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white text-lg">
            {isRecording ? '⏹️' : '🎤'}
          </Text>
        )}
      </Pressable>

      {/* Text input */}
      <TextInput
        className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base text-gray-800 mr-3"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={500}
        editable={!isInputDisabled}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      
      {/* Send button */}
      <Pressable
        onPress={handleSend}
        disabled={!message.trim() || isInputDisabled}
        className={`
          w-12 h-12 rounded-full items-center justify-center
          ${message.trim() && !isInputDisabled 
            ? 'bg-emerald-400' 
            : 'bg-gray-300'
          }
        `}
      >
        <Text className="text-white text-lg font-bold">
          {isLoading ? '⏳' : '➤'}
        </Text>
      </Pressable>
    </View>
  );
};

// import React, { useState } from 'react';
// import { View, TextInput, Pressable, Text } from 'react-native';
// import { Audio } from 'expo-av';
// import * as FileSystem from 'expo-file-system';

// interface ChatInputProps {
//   onSendMessage: (message: string) => void;
//   isLoading: boolean;
//   placeholder?: string;
// }

// const OPENAI_API_KEY = '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'; 

// export const ChatInput: React.FC<ChatInputProps> = ({ 
//   onSendMessage, 
//   isLoading, 
//   placeholder = "Tanya soalan tentang Asas Sains Komputer..." 
// }) => {
//   const [message, setMessage] = useState('');
//   const [recording, setRecording] = useState<Audio.Recording | null>(null);
//   const [isRecording, setIsRecording] = useState(false);

//   const handleSend = () => {
//     if (message.trim() && !isLoading) {
//       onSendMessage(message.trim());
//       setMessage('');
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== 'granted') {
//         alert('Kebenaran mikrofon diperlukan');
//         return;
//       }

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       setRecording(recording);
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Start recording error:', error);
//     }
//   };

//   const stopRecordingAndTranscribe = async () => {
//     try {
//       if (!recording) return;

//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecording(null);
//       setIsRecording(false);

//       if (uri) {
//         const fileInfo = await FileSystem.getInfoAsync(uri);
//         if (!fileInfo.exists) throw new Error('Audio file not found');

//         const formData = new FormData();
//         formData.append('file', {
//           uri,
//           type: 'audio/m4a',
//           name: 'voice.m4a',
//         } as any);
//         formData.append('model', 'whisper-1');
//         formData.append('language', 'ms');

//         const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//             'Content-Type': 'multipart/form-data',
//           },
//           body: formData,
//         });

//         const data = await response.json();
//         if (data?.text) {
//           onSendMessage(data.text); // Send transcribed Malay text
//         } else {
//           alert('Gagal untuk transkripsi suara.');
//         }
//       }
//     } catch (error) {
//       console.error('Transcription error:', error);
//       alert('Ralat semasa transkripsi suara');
//     }
//   };

//   const toggleRecording = async () => {
//     if (isRecording) {
//       await stopRecordingAndTranscribe();
//     } else {
//       await startRecording();
//     }
//   };

//   return (
//     <View className="flex-row items-center p-4 bg-white border-t border-gray-200">
//       <TextInput
//         className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base text-gray-800 mr-3"
//         placeholder={placeholder}
//         placeholderTextColor="#9CA3AF"
//         value={message}
//         onChangeText={setMessage}
//         multiline
//         maxLength={500}
//         editable={!isLoading}
//         onSubmitEditing={handleSend}
//         returnKeyType="send"
//       />

//       {/* Mic Button */}
//       <Pressable
//         onPress={toggleRecording}
//         disabled={isLoading}
//         className={`
//           w-12 h-12 rounded-full items-center justify-center mr-2
//           ${isRecording ? 'bg-red-500' : 'bg-indigo-400'}
//         `}
//       >
//         <Text className="text-white text-lg font-bold">
//           🎤
//         </Text>
//       </Pressable>

//       {/* Send Button */}
//       <Pressable
//         onPress={handleSend}
//         disabled={!message.trim() || isLoading}
//         className={`
//           w-12 h-12 rounded-full items-center justify-center
//           ${message.trim() && !isLoading 
//             ? 'bg-emerald-400' 
//             : 'bg-gray-300'
//           }
//         `}
//       >
//         <Text className="text-white text-lg font-bold">
//           {isLoading ? '⏳' : '➤'}
//         </Text>
//       </Pressable>
//     </View>
//   );
// };
