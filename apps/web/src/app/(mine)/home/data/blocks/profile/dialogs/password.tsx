'use client';

import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PasswordForm from '@/components/forms/password';


interface PasswordDialogProps {
  open?: boolean;
  onClose?: () => void;
}

function PasswordDialog({
  open,
  onClose,
}: PasswordDialogProps) {

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
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription
              className="hidden"
              aria-hidden>修改密码</DialogDescription>
        </DialogHeader>
        <PasswordForm
            onSuccess={ () => onClose?.() } />
      </DialogContent>
    </Dialog>
  );
}

export default PasswordDialog;
