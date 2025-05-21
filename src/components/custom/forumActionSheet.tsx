import { Ionicons } from '@expo/vector-icons';
import React, { useState } from "react";
import { View } from "react-native";
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from "../../components/ui/actionsheet";

	
export const useForumActionSheet = () => {
        const [isOpen, setIsOpen] = useState(false);
        const onOpen = () => setIsOpen(true);
        const onClose = () => setIsOpen(false);


        const forumActionSheet = () => (
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
                  <ActionsheetItem onPress={onClose}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name="trash-outline" size={24} color="#EF4444"  />
                        <ActionsheetItemText size="lg" >
                        Delete Post
                        </ActionsheetItemText>
                    </View>                 
                    </ActionsheetItem>
                </ActionsheetContent>
              </Actionsheet>
          );

        return { forumActionSheet, onOpen };
}