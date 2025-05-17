import { create } from 'zustand';
import { addCommentToPost, toggleLikeOnPost } from '../services/forumService';

export interface ForumComment {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
  username?: string;
}

export interface ForumState {
  commentsByPost: Record<string, ForumComment[]>;
  likesByPost: Record<string, string[]>;

  addComment: (
    postId: string,
    comment: Omit<ForumComment, 'id' | 'createdAt'>
  ) => Promise<void>;

  toggleLike: (postId: string, userId: string) => Promise<void>;
  
  // New function to update local state after successful like toggle
  updatePostLikes: (postId: string, likedBy: string[]) => void;

  getCommentsCount: (postId: string) => number;

  updatePostComments: (postId: string, comment: ForumComment[]) => void;
}

export const useForumStore = create<ForumState>((set, get) => ({
  commentsByPost: {},
  likesByPost: {},

  addComment: async (postId, comment) => {
    const newComment = await addCommentToPost(postId, comment);

    set((state) => {
      const existing = state.commentsByPost[postId] || [];
      return {
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...existing, newComment],
        },
      };
    });
  },

  toggleLike: async (postId, userId) => {
    try {
      // Call the service to update the like in the database
      await toggleLikeOnPost(postId, userId);
      
      // Update local state after successful API call
      set((state) => {
        const existing = state.likesByPost[postId] || [];
        const isLiked = existing.includes(userId);
        const updatedLikes = isLiked
          ? existing.filter((id) => id !== userId)
          : [...existing, userId];

        return {
          likesByPost: {
            ...state.likesByPost,
            [postId]: updatedLikes,
          },
        };
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  },
  
  // Function to update local state with server data
  updatePostLikes: (postId, likedBy) => {
    set((state) => ({
      likesByPost: {
        ...state.likesByPost,
        [postId]: likedBy || [],
      },
    }));
  },

  updatePostComments: (postId, comment) => {
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: comment || [],
      },
    }));
  },

  // get the count of comment from the store
  getCommentsCount: (postId) => {
     const state = get();
     return state.commentsByPost[postId]?.length || 0;
  },

}));