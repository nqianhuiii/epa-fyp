import React, { useState } from 'react';
import { Alert, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Avatar, AvatarFallbackText, AvatarImage } from '../../components/ui/avatar';
import { useAuthStore } from '../../store/authStore';
import { useImagePicker } from '../../hooks/useImagePicker';
import { Ionicons } from '@expo/vector-icons';

interface ProfilePhotoEditorProps {
  userId: string;
  onPhotoUpdated?: (photoUrl: string) => void;
}

const ProfilePhotoEditor: React.FC<ProfilePhotoEditorProps> = ({ 
  userId, 
  onPhotoUpdated 
}) => {
  const { user, customUserData, setUser } = useAuthStore();
  const { pickProfileImage } = useImagePicker();
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    console.log('Starting Cloudinary upload for:', imageUri);
    
    const formData = new FormData();
    
    const filename = `profile_${userId}_${Date.now()}.jpg`;
    
    // Fix: Ensure proper file object format for React Native
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename,
    } as any);
    
    formData.append('upload_preset', 'epa_media');
    formData.append('folder', 'profile_photos');
    formData.append('public_id', `profile_${userId}_${Date.now()}`); // Use timestamp to ensure unique ID

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/do9emnqcm/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (response.ok && data.secure_url) {
        return data.secure_url;
      } else {
        console.error('Upload failed:', data);
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handlePhotoSelection = async () => {    
    try {
      setIsUploading(true);
      const result = await pickProfileImage();
            
      if (!result.success) {
        if (result.error === 'permission') {
          Alert.alert(
            'Kebenaran Diperlukan', 
            result.message || 'Sila berikan kebenaran untuk mengakses perpustakaan foto anda',
            [
              { text: 'Batal', style: 'cancel' },
              { text: 'Tetapan', onPress: () => {

              }}
            ]
          );
        } else {
          Alert.alert('Ralat', result.message || 'Gagal memilih gambar');
        }
        return;
      }

      if (!result.imageUri) {
        console.log('No image URI returned');
        return;
      }

      try {

        const photoUrl = await uploadToCloudinary(result.imageUri);
        
        // Update Zustand store
        if (user && customUserData) {
          const updatedCustomData = {
            ...customUserData,
            profilePhotoUrl: photoUrl,
          };
          
          setUser(user, updatedCustomData);
        } else {
          console.warn('User or customUserData is null:', { user: !!user, customUserData: !!customUserData });
        }

        // Call the callback to update parent component/database
        if (onPhotoUpdated) {
          await onPhotoUpdated(photoUrl);
        }
        
        Alert.alert('Berjaya', 'Foto profil berjaya dikemas kini!');
        
      } catch (uploadError) {
        console.error('Error during upload/update process:', uploadError);
        Alert.alert(
          'Gagal Memuat Naik', 
          'Gagal mengemas kini foto profil. Sila semak sambungan internet anda dan cuba lagi.'
        );
      }
    } catch (error) {
      console.error('Unexpected error in handlePhotoSelection:', error);
      Alert.alert('Ralat', 'Ralat tidak dijangka berlaku. Sila cuba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  // Add fallback for profile photo URL
  const displayPhotoUrl = customUserData?.profilePhotoUrl || 
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60";


  return (
    <View style={{ position: 'relative', alignSelf: 'center', marginBottom: 20 }}>
      <Avatar size="xl">
        <AvatarImage
          source={{ 
            uri: displayPhotoUrl,
            cache: 'reload' // Force refresh of cached images
          }}
          onError={(error) => {
            console.error('Avatar image load error:', error);
          }}
          onLoad={() => {
            console.log('Avatar image loaded successfully');
          }}
        />
      </Avatar>
      
      <TouchableOpacity
        onPress={handlePhotoSelection}
        disabled={isUploading}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: isUploading ? '#999' : '#10b981',
          borderRadius: 16,
          width: 32,
          height: 32,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name="pencil" size={16} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePhotoEditor;