'use client';

import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertProps {
  open?: boolean;
  onClose?: () => void;
  title: string;
  content: string;
  cancel?: string | boolean;
  onCancel?: () => void;
  ok?: string;
  onOk?: () => void;
}

function Alert({
  open,
  onClose,
  title,
  content,
  cancel,
  onCancel,
  ok,
  onOk,
}: AlertProps) {
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel?.();
      onClose?.();
    }
  };

  const cancelOnClick = () => {
    onCancel?.();
    onClose?.();
  };

  const okOnClick = () => {
    onOk?.();
  };

  return (
    <AlertDialog
        open={ open }
        onOpenChange={ (isOpen: boolean) => onOpenChange(isOpen) }>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ title }</AlertDialogTitle>
          <AlertDialogDescription>{ content }</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {
            cancel && (
              <AlertDialogCancel
                  onClick={ () => cancelOnClick() }>{
                typeof cancel === 'string'
                    ? cancel
                    : '取消'
              }</AlertDialogCancel>
            )
          }
          <AlertDialogAction
              onClick={ () => okOnClick() }>{ ok || '确定' }</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
