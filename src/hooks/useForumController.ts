// import { uploadImage, createPostDocument } from "../services/forumService";
import { createPostDocument, uploadToCloudinary } from "../services/forumService";


export const useForumController = () => {

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
          // Upload images first if needed
          // const imageUrls = await Promise.all(
          //   postData.images.map(async (imageUri) => {
          //     return await uploadImage(imageUri, `posts/${userId}/${Date.now()}`);
          //   })
          // );
          
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
     
      return {createPost};
}