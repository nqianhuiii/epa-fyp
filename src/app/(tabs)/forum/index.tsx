import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { PostCard } from "../../../components/custom/postCard";
import { Button, ButtonText } from "../../../components/ui/button";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";
import { useForumController } from "../../../hooks/useForumController";
import { useAuthStore } from "../../../store/authStore";
import { useForumStore } from "../../../store/forumStore";

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getAllPosts, getPostsByUserId } = useForumController();
  const { user } = useAuthStore();
  const { toggleLike, updatePostLikes } = useForumStore();

  useEffect(() => {
    loadPosts();
  }, [activeTab]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      let data = [];
      if (activeTab === "all") {
        data = await getAllPosts();
      } else {
        data = await getPostsByUserId(user?.uid);
      }
      
      // Sync the likes data with the store
      data.forEach(post => {
        if (post.likedBy) {
          updatePostLikes(post.id, post.likedBy);
        }
      });
      
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDetail = (postId: string) => {
    console.log("Navigating to post detail:", postId);
    router.push(`/(tabs)/forum/${postId}`);
  };

  const handleLike = async (postId: string) => {
    if (user?.uid) {
      try {
        await toggleLike(postId, user.uid);
        
        // Update UI after like toggle
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              const isLiked = post.likedBy?.includes(user.uid) || false;
              const updatedLikedBy = isLiked
                ? post.likedBy.filter((uid: string) => uid !== user.uid)
                : [...(post.likedBy || []), user.uid];
              
              return {
                ...post,
                likedBy: updatedLikedBy
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
          headerTitle: "Forum",
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
            onPress={() => setActiveTab("all")}
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
            onPress={() => setActiveTab("my")}
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