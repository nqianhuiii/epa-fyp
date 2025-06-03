import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export const useImagePicker = (maxImages = 5) => {
    const [images, setImages] = useState<string[]>([]);

    const pickImages = async() => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted'){
            return { success: false, error: 'permission' }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4,3], 
            quality: 0.8, 
            allowsMultipleSelection: true
        });

        console.log(result);

        if(!result.canceled){
            // if exceed limit
            if(images.length + result.assets.length > maxImages){
                return { success: false, error: 'limit', message: `You only can select up to ${maxImages} images`};
            }

            // add new images
            const newImages = [...images, ...result.assets.map(asset => asset.uri)];
            setImages(newImages);
            return { success: true, images: newImages};
        }
        return { success:false }
    }

    const removeImage = (index:number) => {
        const newImages= [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    return { images, pickImages, removeImage, setImages};
}