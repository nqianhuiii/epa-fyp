import React from 'react';
import { Text, View, Pressable, Animated } from 'react-native';
import { ChatMessage } from '../../../types/chatbotType';

interface ChatMessageProps {
  message: ChatMessage;
  onRetry?: () => void;
}

// export const ChatMessageList: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('ms-MY', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const getBubbleStyle = () => ({
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     maxWidth: '85%',
//     borderRadius: message.isUser ? 20 : 20,
//     alignSelf: message.isUser ? 'flex-end' : 'flex-start',
//     backgroundColor: message.isUser 
//       ? '#007AFF'  // iOS blue for user messages
//       : '#FFFFFF', // White for bot messages
//     marginVertical: 6,
//     marginHorizontal: 8,
//     // Enhanced shadow for depth
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3, // Android shadow
//     // Different border radius for message tails
//     borderBottomRightRadius: message.isUser ? 4 : 20,
//     borderBottomLeftRadius: message.isUser ? 20 : 4,
//   });

//   const getTextStyle = () => ({
//     fontSize: 16,
//     lineHeight: 22,
//     color: message.isUser ? '#FFFFFF' : '#000000',
//     fontWeight: '400' as const,
//   });

//   const getTimestampStyle = () => ({
//     fontSize: 11,
//     textAlign: message.isUser ? 'right' : 'left' as const,
//     marginTop: 4,
//     color: message.isUser 
//       ? 'rgba(255, 255, 255, 0.7)' 
//       : 'rgba(0, 0, 0, 0.5)',
//     fontWeight: '300' as const,
//   });

//   const getContainerStyle = () => ({
//     flexDirection: 'row' as const,
//     justifyContent: message.isUser ? 'flex-end' : 'flex-start' as const,
//     marginBottom: 4,
//   });

//   if (message.isError && onRetry) {
//     return (
//       <View style={getContainerStyle()}>
//         <Pressable
//           onPress={onRetry}
//           style={[
//             getBubbleStyle(),
//             {
//               borderWidth: 1,
//               borderColor: '#FF3B30',
//               backgroundColor: '#FFF2F2',
//             }
//           ]}
//         >
//           <Text style={[getTextStyle(), { color: '#FF3B30' }]}>
//             {message.text}
//           </Text>
//           <Text style={[getTimestampStyle(), { color: '#FF3B30', opacity: 0.7 }]}>
//             Tap to retry
//           </Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={getContainerStyle()}>
//       <View style={getBubbleStyle()}>
//         <Text style={getTextStyle()}>
//           {message.text}
//         </Text>
        
//         {message.timestamp && (
//           <Text style={getTimestampStyle()}>
//             {formatTime(message.timestamp)}
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// };

// // Enhanced version with more modern styling and animations
// export const ChatMessageEnhanced: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
//   const scaleAnim = React.useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       useNativeDriver: true,
//       tension: 100,
//       friction: 8,
//     }).start();
//   }, []);

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('ms-MY', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   const getGradientColors = () => {
//     if (message.isUser) {
//       return ['#007AFF', '#0056CC']; // Blue gradient
//     }
//     return ['#FFFFFF', '#F8F9FA']; // Subtle white gradient
//   };

//   const getBubbleStyle = () => ({
//     paddingHorizontal: 18,
//     paddingVertical: 14,
//     maxWidth: '80%',
//     borderRadius: 24,
//     alignSelf: message.isUser ? 'flex-end' : 'flex-start',
//     backgroundColor: message.isUser ? '#007AFF' : '#FFFFFF',
//     marginVertical: 3,
//     marginHorizontal: 12,
//     // Enhanced modern shadow
//     shadowColor: message.isUser ? '#007AFF' : '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: message.isUser ? 0.3 : 0.08,
//     shadowRadius: 8,
//     elevation: 5,
//     // Asymmetric border radius for chat tail effect
//     borderBottomRightRadius: message.isUser ? 6 : 24,
//     borderBottomLeftRadius: message.isUser ? 24 : 6,
//     // Subtle border for bot messages
//     borderWidth: message.isUser ? 0 : 1,
//     borderColor: message.isUser ? 'transparent' : '#E5E7EB',
//   });

//   const getTextStyle = () => ({
//     fontSize: 16,
//     lineHeight: 24,
//     color: message.isUser ? '#FFFFFF' : '#1F2937',
//     fontWeight: '400' as const,
//     letterSpacing: 0.2,
//   });

//   const getTimestampStyle = () => ({
//     fontSize: 11,
//     textAlign: message.isUser ? 'right' : 'left' as const,
//     marginTop: 6,
//     color: message.isUser 
//       ? 'rgba(255, 255, 255, 0.8)' 
//       : 'rgba(107, 114, 128, 0.8)',
//     fontWeight: '300' as const,
//   });

//   const getContainerStyle = () => ({
//     flexDirection: 'row' as const,
//     justifyContent: message.isUser ? 'flex-end' : 'flex-start' as const,
//     marginBottom: 2,
//     paddingHorizontal: 4,
//   });

//   // Status indicator for message states
//   const getStatusIndicator = () => {
//     if (message.isUser) {
//       return (
//         <View style={{
//           width: 12,
//           height: 12,
//           borderRadius: 6,
//           backgroundColor: 'rgba(255, 255, 255, 0.3)',
//           marginTop: 2,
//           alignSelf: 'flex-end',
//         }} />
//       );
//     }
//     return null;
//   };

//   if (message.isError && onRetry) {
//     return (
//       <Animated.View 
//         style={[
//           getContainerStyle(),
//           { transform: [{ scale: scaleAnim }] }
//         ]}
//       >
//         <Pressable
//           onPress={onRetry}
//           style={[
//             getBubbleStyle(),
//             {
//               borderWidth: 2,
//               borderColor: '#FF6B6B',
//               backgroundColor: '#FFF5F5',
//               shadowColor: '#FF6B6B',
//             }
//           ]}
//         >
//           <Text style={[getTextStyle(), { color: '#E53E3E' }]}>
//             {message.text}
//           </Text>
//           <Text style={[getTimestampStyle(), { color: '#E53E3E', fontWeight: '500' }]}>
//             ⚠️ Tap to retry
//           </Text>
//         </Pressable>
//       </Animated.View>
//     );
//   }

//   return (
//     <Animated.View 
//       style={[
//         getContainerStyle(),
//         { transform: [{ scale: scaleAnim }] }
//       ]}
//     >
//       <View style={getBubbleStyle()}>
//         <Text style={getTextStyle()}>
//           {message.text}
//         </Text>
        
//         <View style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginTop: message.timestamp ? 4 : 0,
//         }}>
//           {message.timestamp && (
//             <Text style={getTimestampStyle()}>
//               {formatTime(message.timestamp)}
//             </Text>
//           )}
//           {getStatusIndicator()}
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// Alternative with more rounded, modern bubble style
export const ChatMessageModern: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ms-MY', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
      marginVertical: 4,
      paddingHorizontal: 16,
    }}>
      <View style={{
        maxWidth: '75%',
        backgroundColor: message.isUser ? '#34D399' : '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderBottomRightRadius: message.isUser ? 4 : 20,
        borderBottomLeftRadius: message.isUser ? 20 : 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <Text style={{
          color: message.isUser ? '#FFFFFF' : '#374151',
          fontSize: 16,
          lineHeight: 22,
        }}>
          {message.text}
        </Text>
        
        {message.timestamp && (
          <Text style={{
            color: message.isUser ? 'rgba(255,255,255,0.7)' : 'rgba(55,65,81,0.6)',
            fontSize: 11,
            marginTop: 4,
            textAlign: message.isUser ? 'right' : 'left',
          }}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
};