import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import BackButton from '../../../components/custom/customBackButton';
import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
import { Box } from '../../../components/ui/box';
import { Card } from '../../../components/ui/card';
import { HStack } from '../../../components/ui/hstack';
import { Text } from '../../../components/ui/text';
import { VStack } from '../../../components/ui/vstack';
import { NotesController } from '../../../hooks/useMaterialController';
import { Notes } from '../../../types/ResourceType';
import { groupByChapter, sortChapters } from '../../../utils/chapterUtils';

const NotesListScreen: React.FC = () => {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const notesController = new NotesController();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setInitialLoading(true);
      const data = await notesController.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load notes. Please try again.');
    } finally {
      setInitialLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await notesController.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error refreshing notes:', error);
      Alert.alert('Error', 'Failed to refresh notes. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotesPress = (notes: Notes) => {
    router.push(`/screens/notes/${notes.id}`);
  };

  // Use the utility functions
  const groupedNotes = groupByChapter(notes);
  const sortedChapters = sortChapters(Object.keys(groupedNotes));

  const renderNotesItem = (item: Notes) => (
    <Card 
      key={item.id}
      className="mb-3 mx-4"
    >
      <Pressable 
        onPress={() => handleNotesPress(item)}
        className="active:opacity-70"
      >
        <Box className="p-2">
          <HStack className="items-center">
            <Box className="w-16 h-20 bg-emerald-50 rounded-lg items-center justify-center">
              <Ionicons name="reader"size={24} color="#10B981" />
            </Box>
            
            <VStack className="flex-1 space-y-2 ml-4">
              <Text 
                className="text-base font-semibold text-gray-800 leading-tight"
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </VStack>
            
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </HStack>
        </Box>
      </Pressable>
    </Card>
  );

  const renderChapterSection = (chapter: string, chapterNotes: Notes[]) => (
    <VStack key={chapter} className="mb-6">
      <Box className="mx-4 mb-3">
        <Text className="text-lg font-bold text-gray-800 mb-1">
          {chapter}
        </Text>
        <Box className="h-0.5 bg-emerald-400 rounded-full" />
      </Box>
      
      <VStack className="space-y-0">
        {chapterNotes.map(renderNotesItem)}
      </VStack>
    </VStack>
  );

  if (initialLoading) {
    return (
      <LoadingScreenWithHeader
        title="Nota"
        message="Sedang memuatkan nota"
        showBackButton={true}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerTitle: "Nota", 
          headerShadowVisible: false,
          headerBackTitle: '',
          headerLeft: () => BackButton()
        }}
      /> 
      
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      >
        {notes.length === 0 ? (
          <Box className="flex-1 items-center justify-center px-4">
            <Ionicons name="reader" size={48} color="#D1D5DB" />
            <Text className="text-lg font-medium text-gray-600 mb-2 mt-4">
              Tiada Nota
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Nota akan dipaparkan di sini apabila tersedia.
            </Text>
          </Box>
        ) : (
          <VStack className="space-y-0">
            {sortedChapters.map(chapter => 
              renderChapterSection(chapter, groupedNotes[chapter])
            )}
          </VStack>
        )}
      </ScrollView>     
    </SafeAreaView>
  );
};

export default NotesListScreen;


// using badge, instead of group with chapters
// import { Ionicons } from '@expo/vector-icons';
// import { router, Stack } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { Alert, RefreshControl, SafeAreaView, ScrollView } from 'react-native';
// import { Pressable } from 'react-native-gesture-handler';
// import BackButton from '../../../components/custom/customBackButton';
// import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
// import { Badge, BadgeText } from '../../../components/ui/badge';
// import { Box } from '../../../components/ui/box';
// import { Card } from '../../../components/ui/card';
// import { HStack } from '../../../components/ui/hstack';
// import { Text } from '../../../components/ui/text';
// import { VStack } from '../../../components/ui/vstack';
// import { NotesController } from '../../../hooks/useMaterialController';
// import { Notes } from '../../../types/ResourceType';

// const NotesListScreen: React.FC = () => {
//   const [notes, setNotes] = useState<Notes[]>([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const notesController = new NotesController();
//   const [initialLoading, setInitialLoading] = useState(true);

//   useEffect(() => {
//     loadNotes();
//   }, []);

//   const loadNotes = async () => {
//     try {
//       setInitialLoading(true);
//       const data = await notesController.getAllNotes();
//       setNotes(data);
//     } catch (error) {
//       console.error('Error loading notes:', error);
//       Alert.alert('Error', 'Failed to load notes. Please try again.');
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       const data = await notesController.getAllNotes();
//       setNotes(data);
//     } catch (error) {
//       console.error('Error refreshing notes:', error);
//       Alert.alert('Error', 'Failed to refresh notes. Please try again.');
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleNotesPress = (notes: Notes) => {
//     router.push(`/screens/notes/${notes.id}`);
//   };

//   const renderNotesItem = (item: Notes) => (
//     <Card 
//       key={item.id}
//       className="mb-3 mx-4"
//     >
//       <Pressable 
//         onPress={() => handleNotesPress(item)}
//         className="active:opacity-70"
//       >
//         <Box className="p-2">
//           <HStack className="items-center">
//             <Box className="w-16 h-20 bg-blue-50 rounded-lg items-center justify-center">
//               <Ionicons name="document-text" size={24} color="#4A90E2" />
//             </Box>
            
//             <VStack className="flex-1 ml-4">
//               <Text 
//                 className="text-base font-semibold text-gray-800 leading-tight mb-2"
//                 numberOfLines={2}
//               >
//                 {item.title}
//               </Text>
              
//               <Badge 
//                 variant="solid" 
//                 action="success"
//                 className="self-start rounded-full px-3 py-1"
//               >
//                 <BadgeText className="text-xs font-medium">
//                   {item.chapter}
//                 </BadgeText>
//               </Badge>
//             </VStack>
            
//             {/* Chevron Icon */}
//             <Ionicons name="chevron-forward" size={20} color="#666" />
//           </HStack>
//         </Box>
//       </Pressable>
//     </Card>
//   );

//   if (initialLoading) {
//     return (
//       <LoadingScreenWithHeader
//         title="Nota"
//         message="Sedang memuatkan nota"
//         showBackButton={true}
//       />
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <Stack.Screen 
//         options={{ 
//           headerShown: true, 
//           headerTitle: "Nota", 
//           headerShadowVisible: false,
//           headerBackTitle: '',
//           headerLeft: () => BackButton()
//         }}
//       /> 
      
//       <ScrollView 
//         className="flex-1"
//         contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={onRefresh}
//             colors={['#4A90E2']}
//             tintColor="#4A90E2"
//           />
//         }
//       >
//         {notes.length === 0 ? (
//           <Box className="flex-1 items-center justify-center px-4">
//             <Ionicons name="document-text" size={48} color="#D1D5DB" />
//             <Text className="text-lg font-medium text-gray-600 mb-2 mt-4">
//               Tiada Nota
//             </Text>
//             <Text className="text-sm text-gray-500 text-center">
//               Nota akan dipaparkan di sini apabila tersedia.
//             </Text>
//           </Box>
//         ) : (
//           <VStack className="space-y-0">
//             {notes.map(renderNotesItem)}
//           </VStack>
//         )}
//       </ScrollView>     
//     </SafeAreaView>
//   );
// };

// export default NotesListScreen;