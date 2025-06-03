import { useState } from "react";
import { useForumController } from "./useForumController";
import { router } from "expo-router";

export const usePostActionSelection = (
  activeTab?: string,
  setPosts?: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { handleDeletePost } = useForumController();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
 
  const handleLongPress = (postId: string) => {
    if (!activeTab || activeTab === "my") {
      setSelectedPost(postId);
    }
  };

  const cancelSelection = () => {
    setSelectedPost(null);
  };

  const handleEditPost = (postId: string) => {
    router.push(`/(tabs)/forum/editForum/${postId}`);
    setSelectedPost(null);
  };

  const openDeleteDialog = (postId: string) => {
    setSelectedPost(postId);
    setShowConfirmDialog(true); 
    console.log("thsi is open");
  };

  const confirmDelete = async () => {
    if (selectedPost) {
      await handleDeletePost(selectedPost);
      setSelectedPost(null);
      setShowConfirmDialog(false);

      // Optional: filter out deleted post from UI
      if (setPosts) {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== selectedPost));
      }
    }
  };

  return {
    selectedPost,
    handleLongPress,
    cancelSelection,
    handleEditPost,
    confirmDelete,
    openDeleteDialog,
    showConfirmDialog,
    setShowConfirmDialog
  };
  
};


