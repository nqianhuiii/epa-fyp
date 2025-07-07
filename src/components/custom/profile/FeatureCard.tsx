import React from 'react';
import { View } from 'react-native';
import { VStack } from "../../../components/ui/vstack";
import { HStack } from "../../../components/ui/hstack";
import { Text } from '../../../components/ui/text';
import { Heading } from '../../../components/ui/heading';

export const FeatureCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  bgColor = "bg-purple-500"
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  icon: string;
  bgColor?: string;
}) => (
  <View className={`${bgColor} rounded-xl p-4 mb-3`}>
    <HStack className="justify-between items-center">
      <VStack>
        <Text className="text-white text-sm opacity-90">{title}</Text>
        <Heading size="xl" className="text-white">{value}</Heading>
        {subtitle && <Text className="text-white text-xs opacity-75">{subtitle}</Text>}
      </VStack>
      <View className="bg-white bg-opacity-20 rounded-full p-3">
        <Text className="text-white text-lg">{icon}</Text>
      </View>
    </HStack>
  </View>
);