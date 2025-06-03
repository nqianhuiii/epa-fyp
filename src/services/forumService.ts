import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { ForumComment, Post } from '../store/forumStore';
import { getUsernameById } from "./userService";

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
      //extract the imageUrls from postData
      const { imageUrls, ...restPostData } = postData;

      const postRef = doc(collection(db, "posts"));

      await setDoc(postRef, {
        ...restPostData,
        userId,
        updatedAt: new Date(),
        ...(Array.isArray(imageUrls) ? { imageUrls} : {}), // only add to db if exists
      });

      return postRef.id;
    }catch(error){
      console.log('Error creating post document:', error);
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

    const posts = await Promise.all(
      querySnapshot.docs.map( async doc => {
        const data = doc.data();
        const username = await getUsernameById(data.userId);
  
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          imageUrls: data.imageUrls ?? [],
          userId: data.userId,
          username: username ?? 'Unknown',
          likedBy: data.likedBy ?? [],
          createdAt: data.createdAt,
        };
      })
    );

    return posts;
  } catch (error) {
    console.error("Error getting posts by user ID:", error);
    throw new Error("Failed to get the user posts");
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

    const posts = await Promise.all(
      querySnapshot.docs.map( async doc => {
        const data = doc.data();
        const username = await getUsernameById(data.userId);
        console.log('username', username);
  
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          imageUrls: data.imageUrls ?? [],
          userId: data.userId,
          username: username ?? 'Unknown',
          likedBy: data.likedBy ?? [],
          createdAt: data.createdAt,
        };
      })
    );

    return posts;
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
    const commentsRef = collection(db, "posts", postId, "comments");
    const docRef = await addDoc(commentsRef, {
      ...comment,
      createdAt: serverTimestamp(),
    });

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    return {
      id: docRef.id,
      text: data?.text || "",
      userId: data?.userId || "",
      createdAt: data?.createdAt?.toDate?.() || new Date(),
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// get post by the post id (the user clicked)
export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }

    const data = postSnap.data() as Omit<Post, 'id'|'username'>;
    const username = await getUsernameById(data.userId);

    return {
      id: postSnap.id,
      username: username || "Unknown User",
      ...data,
    };
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Failed to fetch post by ID");
  }
};

export const getCommentsByPostId = async (postId: string): Promise<ForumComment[]> => {
  try {
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    
    const comments: ForumComment[] = await Promise.all(
      querySnapshot.docs.map( async (docSnap) => {
        const data = docSnap.data();
        const username = await getUsernameById(data.userId);
  
        return {
          id: docSnap.id,
          text: data.text,
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          username: username || "Unknown User",
        };
      })
    )
    
    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
    throw new Error("Failed to get comments");
  }
};

export const addComment = async (postId: string, commentData: {
  text: string;
  userId: string;
  // username: string;
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

export const deletePost = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
  }catch (error){
    console.error("Error delete post:", error);
    throw new Error("Failed to delete post");
  }
}

export const updatePostService = async (
  postId: string,
  postData: {
      title: string;
      description: string;
      imageUrls?: string[];
      updatedAt?: Date;
    }
) => {
  const postRef = doc(db, 'posts', postId);

  await updateDoc(postRef, {
    ...postData, 
    updatedAt: new Date()
  })

}

