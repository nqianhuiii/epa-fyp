import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { useAlert } from "../../components/custom/alertProvider";
import { useForumController } from "../../hooks/useForumController";
import { usePostActionSelection } from "../../hooks/usePostActionSelection";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from "../ui/actionsheet";
import DeleteConfirmationDialog from './deleteConfirmationDialog';

export const usePostActionSheet = () => {
        const [isOpen, setIsOpen] = useState(false);
        const[showConfirmDialog, setShowConfirmDialog] = useState(false);
        const {confirmDelete}  = usePostActionSelection();
        const [currentPostId, setCurrentPostId] = useState<string | null>(null);
        const { handleDeletePost } = useForumController();
        const { showAlert } = useAlert();

        const onOpen = (postId:string) => {
          setCurrentPostId(postId);
          setIsOpen(true);
        }

        const onClose = () => setIsOpen(false);

        const openDeleteDialog = () => {
          setShowConfirmDialog(true);
          onClose();
        }

        const handleCancelDelete = () => {
          setShowConfirmDialog(false);
        }

        // if confirm delete
        const handleConfirmDelete = async() =>{
          if(currentPostId){
            await handleDeletePost(currentPostId);
            setShowConfirmDialog(false);
            setCurrentPostId(null);

            showAlert("Your post has been deleted successfully", "success");
            router.back();
          }
        }

        const handleEditPost = () => {
          if (currentPostId) {
            router.push({
              pathname: '/forum/editForum/[id]',
              params: { id: currentPostId },
            });
          }
          onClose();
        }

        const forumActionSheet = () => (
          <>
              <Actionsheet isOpen={isOpen} onClose={onClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                  <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                  </ActionsheetDragIndicatorWrapper>

                  <ActionsheetItem onPress={handleEditPost}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name="create-outline" size={24}/>
                      <ActionsheetItemText size="lg">
                        Kemas Kini Post
                       </ActionsheetItemText>
                    </View>                  
                </ActionsheetItem>
                
                  <ActionsheetItem onPress={openDeleteDialog}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name="trash-outline" size={24} color="#EF4444"  />
                        <ActionsheetItemText size="lg" >
                          Padam Post
                        </ActionsheetItemText>
                    </View>                 
                    </ActionsheetItem>
                </ActionsheetContent>
              </Actionsheet>

              <DeleteConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
              />
            </>
          );

        return { forumActionSheet, onOpen };
}