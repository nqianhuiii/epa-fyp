import { useState } from "react";
import { Alert } from "react-native";

export const usePostActionSelection = (
  activeTab: string,
  setPosts: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const handleLongPress = (postId: string) => {
    if (activeTab === "my") {
      setSelectedPost(postId);
    }
  };

  const cancelSelection = () => {
    setSelectedPost(null);
  };

  const handleEditPost = (postId: string) => {
    // router.push({ pathname: "/(tabs)/forum/editForum", params: { postId } });
    setSelectedPost(null);
  };

  const handleDeletePost = (postId: string) => {
    // Alert.alert(
    //   "Delete Post",
    //   "Are you sure you want to delete this post? This action cannot be undone.",
    //   [
    //     { text: "Cancel", style: "cancel" },
    //     {
    //       text: "Delete",
    //       style: "destructive",
    //       onPress: async () => {
    //         try {
    //           // await deletePost(postId); // Uncomment when deletePost service is available
    //           setPosts((prev) => prev.filter((post) => post.id !== postId));
    //           setSelectedPost(null);
    //         } catch (error) {
    //           console.error("Error deleting post:", error);
    //           Alert.alert("Error", "Failed to delete post. Please try again.");
    //         }
    //       },
    //     },
    //   ]
    // );
    // setSelectedPost(null);
  };


  return {
    selectedPost,
    handleLongPress,
    cancelSelection,
    handleEditPost,
    handleDeletePost,
  };
};



