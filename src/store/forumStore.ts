import { create } from 'zustand';
import { addCommentToPost, toggleLikeOnPost } from '../services/forumService';

export type Post = {
  id: string;
  title: string;
  description: string;
  userId: string;
  imageUrls?: string[];
  createdAt: Date;
  likedBy?: string[];
  username?: string;
};

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
  posts: Post[];

  addComment: (
    postId: string,
    comment: Omit<ForumComment, 'id' | 'createdAt'>
  ) => Promise<void>;

  toggleLike: (postId: string, userId: string) => Promise<void>;
  
  // New function to update local state after successful like toggle
  updatePostLikes: (postId: string, likedBy: string[]) => void;

  getCommentsCount: (postId: string) => number;

  updatePostComments: (postId: string, comment: ForumComment[]) => void;

  addPost: (newPost: Post) => void;

  removePost: (postId: string) => void;

  updatePost : (updatedPost : Post) => void;
  
  // Getter for the store state
  getState: {
    posts: Post[];
  };
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [] as Post[],
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

        // Update both likesByPost and the likedBy property in posts array
        const updatedPosts = state.posts.map(post => 
          post.id === postId 
            ? { ...post, likedBy: updatedLikes } 
            : post
        );

        return {
          likesByPost: {
            ...state.likesByPost,
            [postId]: updatedLikes,
          },
          posts: updatedPosts
        };
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  },
  
  // Function to update local state with server data
  updatePostLikes: (postId, likedBy) => {
    set((state) => {
      // Update both likesByPost and the posts array
      const updatedPosts = state.posts.map(post =>
        post.id === postId
          ? { ...post, likedBy }
          : post
      );
      
      return {
        likesByPost: {
          ...state.likesByPost,
          [postId]: likedBy || [],
        },
        posts: updatedPosts
      };
    });
  },

  updatePostComments: (postId, comments) => {
    set((state) => ({
      commentsByPost: {
        ...state.commentsByPost,
        [postId]: comments || [],
      },
    }));
  },

  // get the count of comment from the store
  getCommentsCount: (postId) => {
     const state = get();
     return state.commentsByPost[postId]?.length || 0;
  },

  addPost: (post: Post) => {
    set((state) => ({
      posts: [post, ...state.posts]
    }));
  },

  removePost: (postId) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },
  
  // Expose the state getter
  getState: {
    get posts() {
      return get().posts;
    }
  },

  updatePost: (updatedPost:Post) => {
    set((state) => ({
      posts: state.posts.map((post) => 
        post.id === updatedPost.id ? {...post, ...updatedPost} : post)
    }))
  }
}));

// Export a singleton instance for direct access when needed
export const forumStore = useForumStore;

