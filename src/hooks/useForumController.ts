import { useState } from "react";
import { createPostDocument, deletePost, fetchAllPosts, fetchPostsByUserId, getCommentsByPostId, getPostById, updatePostService, uploadToCloudinary } from "../services/forumService";
import { ForumComment, useForumStore } from "../store/forumStore";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrls?: string[];
  userId: string;
  username?: string;
  likedBy?: string[];
  createdAt: {
    toDate: () => Date;
  } | Date;
}

export const useForumController = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get the store actions directly from the hook
  const { addPost, removePost, updatePost } = useForumStore();
  
  const createPost = async (
    postData: {
      title: string;
      description: string;
      images: string[];
    },
    userId: string,
    onError: (msg: string) => void
  ) => {
    try {          
      // upload image to cloudinary 
      let imageUrls: string[] = [];

      if(postData.images && postData.images.length > 0){
        imageUrls = await Promise.all(
          postData.images.map(async (imageUri) => {
            return await uploadToCloudinary(imageUri);
          })
        );
      }

      // Create post in firestore
      const postId = await createPostDocument(userId, {
        title: postData.title,
        description: postData.description,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        createdAt: new Date(),
      });

      // Create new post object
      const newPost = {
        id: postId, 
        title: postData.title,
        description: postData.description, 
        userId,
        createdAt: new Date(),
        imageUrls,
      };

      // Add post to Zustand store
      addPost(newPost);
      
      // Update local state for immediate feedback
    const refreshedPosts = await fetchAllPosts();
    setPosts(refreshedPosts); // ✅ Ensure latest post list      
      return postId;
    } catch (e: any) {
      onError(e.message || 'Failed to create post');
      throw e;
    }
  };

  // get all post 
  const getAllPosts = async() => {
    try{
      setIsLoading(true);
      const allPost = await fetchAllPosts();
      setPosts(allPost);
      return allPost;
    }catch(error:any){
      console.error('Error fetching posts:', error);
      throw error;
    }finally{
      setIsLoading(false);
    } 
  };

  // get all post by user id 
  const getPostsByUserId = async(userId?: string) => {
    try{
      setIsLoading(true);
      const userPosts = await fetchPostsByUserId(userId);
      setPosts(userPosts);
      return userPosts;
    }catch(error:any){
      console.error(`Error fetching posts for user: ${userId}`, error);
      throw error;
    }finally{
      setIsLoading(false);
    }
  };

  // Add a comment and update Zustand store
  const handleAddComment = async (
    postId: string,
    comment: Omit<ForumComment, 'id' | 'createdAt'>
  ) => {
    // Use the addComment function directly from the store
    const { addComment } = useForumStore.getState();
    await addComment(postId, comment);
  };

  // Toggle like and update Zustand store
  const handleToggleLike = async (postId: string, userId: string) => {
    const { toggleLike } = useForumStore.getState();
    await toggleLike(postId, userId);
  
    // Optionally update local `posts` state for instant feedback
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              likedBy: post.likedBy?.includes(userId)
                ? post.likedBy.filter(id => id !== userId)
                : [...(post.likedBy || []), userId],
            }
          : post
      )
    );
  };

  const fetchCommentsByPostId = async (postId: string): Promise<ForumComment[]> => {
    try {
      const comments = await getCommentsByPostId(postId);
      return comments;
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error);
      throw error;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      // Remove post from Zustand store
      removePost(postId);
      // Update local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      getAllPosts();
      
    } catch (error: any) {
      console.error('Failed to delete post: ', error);
      throw error;
    }
  };

  const handleUpdatePost = async (
    postId: string, 
    postData: {
      title: string;
      description: string;
      images?: string[];
    },
    userId: string,
    onError: (msg : string) => void
  )=> {
    try{
      let imageUrls: string[] = [];

      if (postData.images && postData.images.length > 0) {
        imageUrls = await Promise.all(
          postData.images.map(async (imageUri) => {

          if (!imageUri.startsWith('https://res.cloudinary.com')) {
            return await uploadToCloudinary(imageUri);
          }  
          
          return imageUri;
          })
        );
      } 

      // Prepare update object
      const updatedData: any = {
        title: postData.title,
        description: postData.description,
      };

      // Only include imageUrls if images were passed
      if (postData.images) {
        updatedData.imageUrls = imageUrls;
      }
      

      // Update in Firestore
      await updatePostService(postId, updatedData);


      // Update Zustand store
      updatePost({
        id: postId,
        title: postData.title,
        description: postData.description,
        imageUrls: imageUrls,
        userId,
        createdAt: new Date(), // if you want to preserve original createdAt, retrieve it first
      });
    }catch(error:any){
      console.error("Update failed", error);
      onError(error.message || 'Failed to update post');
      throw error;
    }
  }
     
  return {
    posts,
    isLoading,
    createPost, 
    getAllPosts, 
    getPostsByUserId, 
    handleAddComment, 
    handleToggleLike, 
    fetchCommentsByPostId, 
    getPostById, 
    handleDeletePost,
    handleUpdatePost
  };
}