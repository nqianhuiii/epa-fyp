import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { HeaderRightButton } from "../../../components/custom/headerRightButton";
import { HeaderLeftButton } from "../../../components/custom/headerLeftButton";
import PostCard from "../../../components/custom/postCard";
import { Button, ButtonText } from "../../../components/ui/button";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { useForumController } from "../../../hooks/useForumController";
import { usePostActionSelection } from "../../../hooks/usePostActionSelection";
import { getCommentsByPostId } from "../../../services/forumService";
import { useAuthStore } from "../../../store/authStore";
import { useForumStore } from "../../../store/forumStore";

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllPosts, getPostsByUserId } = useForumController();
  const { user } = useAuthStore();
  const { toggleLike, updatePostLikes, updatePostComments } = useForumStore();
  const { selectedPost, handleLongPress, cancelSelection, handleEditPost, handleDeletePost } = usePostActionSelection(activeTab, setPosts);
  const navigation = useNavigation();
  
  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  useLayoutEffect(() => {
    if(selectedPost){
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            onEdit={() => handleEditPost(selectedPost)}
            onCancel={() => cancelSelection()}
          />           
        ), 
        headerLeft: () => (
          <HeaderLeftButton
             onDelete={() => handleDeletePost(selectedPost)}
          />
        )
      });
    }else{
      navigation.setOptions({headerRight: () => null, headerLeft: () => null});
    }
  }, [selectedPost]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      let data = [];
      if (activeTab === "all") {
        data = await getAllPosts();
      } else {
        data = await getPostsByUserId(user?.uid);
      }

      data.forEach((post) => {
        if (post.likedBy) {
          updatePostLikes(post.id, post.likedBy);
        }
      });

      setPosts(data);
      await loadCommentsForPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCommentsForPosts = async (posts: any[]) => {
    try {
      await Promise.all(
        posts.map(async (post) => {
          try {
            const comments = await getCommentsByPostId(post.id);
            updatePostComments(post.id, comments);
          } catch (error) {
            console.error(`Failed to load comments for post ${post.id}:`, error);
            updatePostComments(post.id, []);
          }
        })
      );
    } catch (error) {
      console.error("Failed to load comments for posts:", error);
    }
  };

  const navigateToDetail = (postId: string) => {
    router.push(`/(tabs)/forum/${postId}`);
  };

  const handleLike = async (postId: string) => {
    if (user?.uid) {
      try {
        await toggleLike(postId, user.uid);

        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.id === postId) {
              const isLiked = post.likedBy?.includes(user.uid) || false;
              const updatedLikedBy = isLiked
                ? post.likedBy.filter((uid: string) => uid !== user.uid)
                : [...(post.likedBy || []), user.uid];

              return {
                ...post,
                likedBy: updatedLikedBy,
              };
            }
            return post;
          })
        );
      } catch (error) {
        console.error("Error handling like:", error);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: selectedPost ? "Post Actions" : "Forum",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "white",
          },
        }}
      />

      <View className="px-4 py-4 bg-white">
        <HStack className="justify-between" space="md">
          <Button
            className={`${
              activeTab === "all"
                ? "bg-emerald-400"
                : "bg-white border border-emerald-400"
            } rounded-lg flex-1`}
            onPress={() => {
              setActiveTab("all");
              cancelSelection();
            }}
          >
            <ButtonText
              className={
                activeTab === "all" ? "text-white" : "text-emerald-400"
              }
            >
              All Post
            </ButtonText>
          </Button>
          <Button
            className={`${
              activeTab === "my"
                ? "bg-emerald-400"
                : "bg-white border border-emerald-400"
            } rounded-lg flex-1`}
            onPress={() => {
              setActiveTab("my");
              cancelSelection();
            }}
          >
            <ButtonText
              className={
                activeTab === "my" ? "text-white" : "text-emerald-400"
              }
            >
              My Post
            </ButtonText>
          </Button>
        </HStack>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="small" color="#10B981" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
        >
          {posts.length === 0 ? (
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-500 text-center text-lg">
                {activeTab === "all"
                  ? "No post available"
                  : "You have not created any post yet"}
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostPress={navigateToDetail}
                onLongPress={() => handleLongPress(post.id)}
                isSelected={post.id === selectedPost}
                onLikePress={() => {
                  if (user?.uid) {
                    handleLike(post.id);
                  }
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        className="absolute bottom-20 right-6 w-14 h-14 bg-emerald-400 rounded-full items-center justify-center"
        onPress={() => router.push("/(tabs)/forum/createForum")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
