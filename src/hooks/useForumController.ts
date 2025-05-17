// import { uploadImage, createPostDocument } from "../services/forumService";
import { useState } from "react";
import { ForumComment, useForumStore } from "../store/forumStore";
import { createPostDocument, uploadToCloudinary, fetchAllPosts, fetchPostsByUserId, addCommentToPost, getCommentsByPostId, getPostById } from "../services/forumService";

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
  };
}


export const useForumController = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const forumStore = useForumStore();
  
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
          
          return postId;
        } catch (e: any) {
          onError(e.message || 'Faield to create post');
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
          const userPosts =  await fetchPostsByUserId(userId);
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
        const store = useForumStore.getState();
        await store.addComment(postId, comment);
      };

      // Toggle like and update Zustand store
      const handleToggleLike = async (postId: string, userId: string) => {
        const store = useForumStore.getState();
        await store.toggleLike(postId, userId);
    
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

      const getCommentsByPostId = async (postId: string): Promise<ForumComment[]> => {
        try {
          // Implementation to get comments for a specific post
          // For now, we'll return a mock response
          return []; // Replace with actual implementation
        } catch (error) {
          console.error(`Error getting comments for post ${postId}:`, error);
          throw error;
        }
      };



     
     
      return {createPost, getAllPosts, getPostsByUserId, handleAddComment, handleToggleLike, addCommentToPost, getCommentsByPostId, getPostById };
}