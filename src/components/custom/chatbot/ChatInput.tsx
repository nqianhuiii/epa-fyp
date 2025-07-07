import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
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
  placeholder = "Tanya soalan tentang ASK..." 
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

  const handleCancelRecording = async () => {
    if (isRecording) {
      try {
        await stopRecording();
      } catch (error) {
        console.error('Cancel recording error:', error);
      }
    }
    setIsTranscribing(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isInputDisabled = isLoading || isRecording || isTranscribing || isProcessing;

  return (
    <View className="bg-white border-t border-gray-200">
      {/* Recording indicator - positioned above the input */}
      {isRecording && (
        <View className="bg-red-500 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-white rounded-full mr-2 opacity-80" />
            <Text className="text-white font-medium">
              Recording: {formatDuration(duration)}
            </Text>
          </View>
          <Pressable
            onPress={handleCancelRecording}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full items-center justify-center"
          >
            <Text className="text-red font-bold text-lg">×</Text>
          </Pressable>
        </View>
      )}

      {/* Transcription indicator - positioned above the input */}
      {isTranscribing && (
        <View className="bg-blue-500 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-medium ml-2">
              Transcribing audio...
            </Text>
          </View>
          <Pressable
            onPress={handleCancelRecording}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full items-center justify-center"
          >
            <Text className="text-red font-bold text-lg">×</Text>
          </Pressable>
        </View>
      )}

      {/* Input area */}
      <View className="flex-row items-center p-4">
        {/* Microphone button */}
        <Pressable
          onPress={handleMicrophonePress}
          disabled={isLoading || isTranscribing}
          className={`
            w-12 h-12 rounded-full items-center justify-center mr-3
            ${isRecording 
              ? 'bg-red-500' 
              : isTranscribing 
                ? 'bg-blue-400'
                : 'bg-gray-400'
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
    </View>
  );
};