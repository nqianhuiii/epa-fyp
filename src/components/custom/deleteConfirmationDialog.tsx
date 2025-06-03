import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader
} from '../../components/ui/alert-dialog';
import { Box } from '../../components/ui/box';
import { Button, ButtonText } from '../../components/ui/button';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

const DeleteConfirmationDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Padam Post?",
  message = "Post ini akan dipadam secara kekal. Tindakan ini tidak boleh diundur."
}) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="w-full max-w-[415px] gap-4 items-center">
        <Box className="rounded-full h-[52px] w-[52px] bg-background-error items-center justify-center">
          <Ionicons name="trash-outline" size={24} color="red"/>
        </Box>
        <AlertDialogHeader className="mb-2">
          <Heading size="md">{title}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm" className="text-center">{message}</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-5 flex-row gap-2">
          <Button
            size="sm"
            action="negative"
            onPress={onConfirm}
            className="px-[30px]"
          >
            <ButtonText>Padam</ButtonText>
          </Button>
          <Button
            variant="outline"
            action="secondary"
            onPress={onClose}
            size="sm"
            className="px-[30px]"
          >
            <ButtonText>Batal</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
