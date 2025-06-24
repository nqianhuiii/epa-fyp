import React, { useRef, useEffect } from 'react';
import { View, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatbot } from '../../../hooks/useChatbot';
import { ChatMessageModern } from '../../../components/custom/chatbot/ChatMessage';
import { ChatInput } from '../../../components/custom/chatbot/ChatInput';
import { ChatHeader } from '../../../components/custom/chatbot/ChatHeader';
import { TypingIndicator } from '../../../components/custom/chatbot/TypingIndicator';
import { Stack } from 'expo-router';

const OPENAI_API_KEY = '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'; 

const ChatBotScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    retryLastMessage,
  } = useChatbot(OPENAI_API_KEY);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <ChatMessageModern
      message={item} 
      onRetry={item.isError ? retryLastMessage : undefined}
    />
  );

  const renderFooter = () => {
    if (isLoading) {
      return <TypingIndicator />;
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        >
        <ChatHeader onClearChat={clearChat} />
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBotScreen;