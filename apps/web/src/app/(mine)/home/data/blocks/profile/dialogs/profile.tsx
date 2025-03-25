'use client';

import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProfileForm from '@/components/forms/profile';


interface ProfileDialogProps {
  open?: boolean;
  onClose?: () => void;
}

function ProfileDialog({
  open,
  onClose,
}: ProfileDialogProps) {

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog
        open={ open }
        onOpenChange={ (isOpen: boolean) => onOpenChange(isOpen) }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改个人资料</DialogTitle>
          <DialogDescription
              className="hidden"
              aria-hidden>修改个人资料</DialogDescription>
        </DialogHeader>
        <ProfileForm
            onSuccess={ () => onClose?.() } />
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;
