import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
// import { db, storage } from "../config/firebaseConfig";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export interface PostData{
  userId: string,
  title: string;
  description: string;
  imageUrls?: string[];
  createdAt: Date;
}

// upload image to cloudinary
export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  try{
    // create form data for the uplaod 
    const formData = new FormData();

    // get file name from URI
    const fileName = imageUri.split('/').pop();

    // get file type
    const match = /\.(\w+)$/.exec(fileName || '');
    const fileType = match ? `image/${match[1]}`:'image';

    // append image to form data
    formData.append('file', {
      uri: imageUri, 
      name: fileName, 
      type: fileType
    } as any);

    // add upload preset 
    formData.append('upload_preset', 'epa_media');

    // make upload request to cloudinary
    const response = await fetch('https://api.cloudinary.com/v1_1/do9emnqcm/image/upload', {
      method: 'POST', 
      body: formData, 
      headers: {
        'Accept': 'application/json', 
        'Content-Type': 'multipart/form-data',
      }
    });

    const data = await response.json();

    // return the url of uploaded image
    return data.secure_url;
  }catch(error){
    // ! need proper error return display
    console.log('Error uploading to Cloudinary', error);
    throw new Error('Failed to upload image');
  }
}

// create a new post in firebase 
export const createPostDocument = async (
    userId: string,
    postData: {
      title: string;
      description: string;
      imageUrls?: string[];
      createdAt: Date;
    }
  ) => {
    try{
      const postRef = doc(collection(db, "posts"));

      await setDoc(postRef, {
        ...postData,
        userId,
        updatedAt: new Date(),
      });

      return postRef.id;
    }catch(error){
      console.error('Error creating post document:', error);
      throw new Error('Failed to create post');
    }
  };
  
  // export const uploadImage = async (uri: string, path: string) => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
    
  //   const storageRef = ref(storage, path);
  //   await uploadBytes(storageRef, blob);
    
  //   return await getDownloadURL(storageRef);
  // };