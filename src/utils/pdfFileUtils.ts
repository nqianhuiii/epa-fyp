import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

export const downloadAndHandleFile = async (
  fileUrl: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  try {
    const fileUri = FileSystem.documentDirectory + fileName;

    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      fileUri,
      {},
      (progressData) => {
        const progress =
          progressData.totalBytesWritten / progressData.totalBytesExpectedToWrite;
        onProgress?.(Math.round(progress * 100));
      }
    );

    const downloadResult = await downloadResumable.downloadAsync();
    if (!downloadResult?.uri) throw new Error('Download failed');

    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Storage permission is required.');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      }

      Alert.alert('Muat turun selesai', 'Fail disimpan ke folder Downloads.');
    } else {
      await shareFile(downloadResult.uri);
    }
  } catch (error) {
    console.error('File download error:', error);
    Alert.alert('Ralat Muat Turun', 'Gagal memuat turun fail.');
  }
};

export const shareFile = async (fileUri: string): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Sharing not available', 'Perkongsian tidak tersedia di peranti ini.');
    }
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Share Error', 'Gagal berkongsi fail.');
  }
};
