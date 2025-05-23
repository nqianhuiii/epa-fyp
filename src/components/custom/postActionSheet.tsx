import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { View } from "react-native";
import { router, Stack } from "expo-router";
import { useAlert } from "../../components/custom/alertProvider";
import { useForumController } from "../../hooks/useForumController";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from "../ui/actionsheet";
import DeleteConfirmationDialog from './deleteConfirmationDialog';
import { usePostActionSelection } from "../../hooks/usePostActionSelection";

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

        const forumActionSheet = () => (
          <>
              <Actionsheet isOpen={isOpen} onClose={onClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent>
                  <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                  </ActionsheetDragIndicatorWrapper>

                  <ActionsheetItem onPress={onClose}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name="create-outline" size={24}/>
                      <ActionsheetItemText size="lg">
                        Edit Post
                       </ActionsheetItemText>
                    </View>                  
                </ActionsheetItem>
                
                  <ActionsheetItem onPress={openDeleteDialog}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name="trash-outline" size={24} color="#EF4444"  />
                        <ActionsheetItemText size="lg" >
                          Delete Post
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