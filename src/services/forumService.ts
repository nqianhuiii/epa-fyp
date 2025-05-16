import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { ForumComment } from '../store/forumStore';

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
  
// get all post
export const fetchAllPosts = async () => {
  try {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(postsQuery);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrls: data.imageUrls ?? [],
        userId: data.userId,
        username: data.username ?? 'Unknown',
        likedBy: data.likedBy ?? [],
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw new Error("Failed to get all posts");
  }
};


// get all post, filter by user id
export const fetchPostsByUserId = async (userId?: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch posts");
    }

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(postsQuery);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        imageUrls: data.imageUrls ?? [],
        userId: data.userId,
        username: data.username ?? 'Unknown',
        likedBy: data.likedBy ?? [],
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.error("Error getting posts by user ID:", error);
    throw new Error("Failed to get the user posts");
  }
};

// Toggle like on a post
export const toggleLikeOnPost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    
    const postData = postSnap.data();
    const likedBy = postData.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    // Update the post document with the new like status
    await updateDoc(postRef, {
      likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
    });
    
    return;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Add a comment to a post
export const addCommentToPost = async (
  postId: string, 
  comment: Omit<ForumComment, 'id' | 'createdAt'>
): Promise<ForumComment> => {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    
    const newCommentRef = await addDoc(commentsRef, {
      ...comment,
      createdAt: serverTimestamp()
    });
    
    return {
      id: newCommentRef.id,
      ...comment,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getPostById = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }

    const data = postSnap.data();
    return {
      id: postSnap.id,
      ...data,
    };
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post by ID");
  }
};

export const getCommentsByPostId = async (postId: string) => {
  try {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(commentsQuery);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        userId: data.userId,
        username: data.username,
        createdAt: data.createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to get comments");
  }
};

export const addComment = async (postId: string, commentData: {
  text: string;
  userId: string;
  username: string;
}) => {
  try {
    const commentRef = await addDoc(collection(db, "posts", postId, "comments"), {
      ...commentData,
      createdAt: serverTimestamp(),
    });

    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
};
