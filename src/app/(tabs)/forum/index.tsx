import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallbackText, AvatarImage } from "../../../components/ui/avatar";
import { Button, ButtonText } from "../../../components/ui/button";
import { HStack } from "../../../components/ui/hstack";
import { Text } from "../../../components/ui/text";


export default function Home(){
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: true, headerTitle: "Forum"}}/>
          <View className="px-5">
            <HStack className="specify-between" space="md">
              <Button className="bg-emerald-400 rounded-lg flex-1">
                <ButtonText className="text-white">All Post</ButtonText>
              </Button>
              <Button className="bg-emerald-400 rounded-lg flex-1">
                <ButtonText className="text-white">My Post</ButtonText>
              </Button>
            </HStack>
          </View>

          <View className="bg-white rounded-xl px-7 pt-10 mb-4 shadow-slate-50 shadow m-6 ">
            <HStack space="md">
            <Avatar size="md">
                  <AvatarFallbackText>Img</AvatarFallbackText>
                  <AvatarImage
                    source={{ 
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                    }}
                  />
            </Avatar> 
                <Text className="font-bold">Ahiho</Text>
            </HStack>
            
            <Text className="text-lg font-bold mt-3">How to do this</Text>
            <Text className="mt-1 mb-3">Can someone help to solv ethis question below, im having different layout than expected</Text>
            
            {/* {item.imageURL && (
                <Image 
                    source={{ uri: item.imageURL }} 
                    className="w-full h-40 rounded-lg mt-2" 
                    resizeMode="cover"
                />
            )} */}
            
            <HStack className="mt-4 mb-4 items-center">
                <TouchableOpacity 
                    className="flex-row items-center mr-6" 
                    // onPress={() => handleLike(item.id)}
                >
                    <Ionicons name="thumbs-up-outline" size={20} color="#4B5563" />
                    <Text className="ml-2">9 Suka</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    className="flex-row items-center" 
                    // onPress={() => router.push(`/forum/post/${item.id}`)}
                >
                    <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
                    <Text className="ml-2">9 Komen</Text>
                </TouchableOpacity>
            </HStack>
        </View>

        <View className="bg-white rounded-xl px-7 pt-10 mb-4 shadow-slate-100 shadow-sm m-4">
            <HStack space="md">
            <Avatar size="md">
                  <AvatarFallbackText>Img</AvatarFallbackText>
                  <AvatarImage
                    source={{ 
                      uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                    }}
                  />
            </Avatar> 
                <Text className="font-bold">Ahiho</Text>
            </HStack>
            
            <Text className="text-lg font-bold mt-3">How to do this</Text>
            <Text className="mt-1 mb-3">Can someone help to solv ethis question below, im having different layout than expected</Text>
            
            {/* {item.imageURL && (
                <Image 
                    source={{ uri: item.imageURL }} 
                    className="w-full h-40 rounded-lg mt-2" 
                    resizeMode="cover"
                />
            )} */}
            
            <HStack className="mt-4 mb-4 items-center">
                <TouchableOpacity 
                    className="flex-row items-center mr-6" 
                    // onPress={() => handleLike(item.id)}
                >
                    <Ionicons name="thumbs-up-outline" size={20} color="#4B5563" />
                    <Text className="ml-2">9 Suka</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    className="flex-row items-center" 
                    // onPress={() => router.push(`/forum/post/${item.id}`)}
                >
                    <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
                    <Text className="ml-2">9 Komen</Text>
                </TouchableOpacity>
            </HStack>
        </View>
        <TouchableOpacity 
                className="absolute bottom-20 right-6 w-14 h-14 bg-emerald-400 rounded-full items-center justify-center"
                onPress={() => router.push('/(tabs)/forum/createForum')}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
      </SafeAreaView>
    )
}
