import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import { Pressable } from 'react-native-gesture-handler';
import { Exercise } from '../../../types/ResourceType';
import { ExerciseController } from '../../../hooks/useMaterialController';
import BackButton from '../../../components/custom/customBackButton';
import LoadingScreenWithHeader from '../../../components/custom/loadingScreenWithHeader';
import { Box } from '../../../components/ui/box';
import { Text } from '../../../components/ui/text';
import { downloadAndHandleFile } from '../../../utils/pdfFileUtils';


const NotesViewerScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const controller = new ExerciseController();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchExerciseById(id as string);
    }
  }, [id]);

  const fetchExerciseById = async (id: string) => {
    try {
      setInitialLoading(true);
      const result = await controller.getExerciseById(id);
      if (result) {
        setExercise(result);
      } else {
        setError('Soalan teks tak jumpa');
      }
    } catch (err) {
      console.log('Error fetching exercise:', err);
      setError('Gagal memuatkan soalan');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!exercise?.pdfUrl) return;

    setDownloading(true);
    setDownloadProgress(0);

    const fileName = `${exercise.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    await downloadAndHandleFile(exercise.pdfUrl, fileName, setDownloadProgress);

    setDownloading(false);
    setDownloadProgress(0);
  };

  if (initialLoading) {
    return (
      <LoadingScreenWithHeader
        title="Soalan"
        message="Sedang memuatkan soalan"
        showBackButton={true}
      />
    );
  }

  if (error || !exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: "Soalan",
            headerShadowVisible: false,
            headerBackTitle: '',
            headerLeft: () => BackButton()
          }}
        />
        <Box className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={48} color="#10B981" />
          <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            Tidak dapat memuatkan soalan
          </Text>
          <Text className="text-sm text-gray-500 text-center leading-5 mb-6">
            {error || 'Gagal memuatkan soalan'}
          </Text>
          <Pressable
            className="bg-blue-500 px-6 py-3 rounded-lg active:opacity-70"
            onPress={() => fetchExerciseById(id as string)}
          >
            <Text className="text-white text-base font-medium">Cuba Lagi</Text>
          </Pressable>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: exercise.title,
          headerShadowVisible: false,
          headerBackTitle: '',
          headerLeft: () => BackButton(),
          headerRight: () => (
            <Pressable
              className="p-2 min-w-10 items-center active:opacity-70"
              onPress={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator size="small" color="#10B981" />
              ) : (
                <Ionicons name="download" size={24} color="#d1d5db" />
              )}
            </Pressable>
          )
        }}
      />

      {downloading && (
        <Box className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <Text className="text-sm text-gray-600 text-center mb-2">
            Sedang memuat turun ... {downloadProgress}%
          </Text>
          <Box className="h-1 bg-gray-200 rounded-sm">
            <Box
              className="h-full bg-blue-500 rounded-sm"
              style={{ width: `${downloadProgress}%` }}
            />
          </Box>
        </Box>
      )}

      <WebView
        source={{ uri: exercise.pdfUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <Box className="flex-1 justify-center items-center">
            <ActivityIndicator size="small" color="#10B981" />
            <Text className="mt-3 text-base text-gray-600">Memuatkan pdf...</Text>
          </Box>
        )}
        onError={(e) => {
          console.error('WebView Error', e.nativeEvent);
          setError('Failed to load the PDF.');
        }}
      />
    </SafeAreaView>
  );
};

export default NotesViewerScreen;
