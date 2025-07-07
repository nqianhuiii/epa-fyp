import React from 'react';
import { View } from 'react-native';
import { VStack } from "../../../components/ui/vstack";
import { HStack } from "../../../components/ui/hstack";
import { Text } from '../../../components/ui/text';
import { Heading } from '../../../components/ui/heading';

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  bgColor = "bg-emerald-50", 
  textColor = "text-emerald-600", 
  valueColor = "text-emerald-700"
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string; 
  bgColor?: string;
  textColor?: string;
  valueColor?: string;
}) => (
  <View className={`${bgColor} rounded-xl p-4 flex-1 mx-1`}>
    <VStack space="xs" className="items-center">
      <Text className={`${textColor} text-xs font-medium`}>{title}</Text>
      <Heading size="lg" className={valueColor}>{value}</Heading>
      {subtitle && <Text className={`${textColor} text-xs opacity-75`}>{subtitle}</Text>}
    </VStack>
  </View>
);