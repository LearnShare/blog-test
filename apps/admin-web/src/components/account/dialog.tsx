import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Button,
} from '@/components/ui/button';
import Avatar from '@/components/avatar';

import type {
  Account,
} from '@/types';

interface AccountDialogProps {
  open?: boolean;
  data: Account;
  onClose?: () => void;
}

function AccountDialog({
  open,
  data,
  onClose,
}: AccountDialogProps) {
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
          <DialogTitle>用户详情</DialogTitle>
          <DialogDescription
              className="hidden"
              aria-hidden>用户详情</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-.5 items-center">
          <Avatar
              url={ data.avatarUrl }
              width={ 80 }
              height={ 80 }
              name={ data.name } />
          <div className="mt-1.5 text-slate-700">{ data.name }</div>
          <div className="text-sm text-slate-500 group-hover:underline">@{ data.uid }</div>
          <p className="mt-3">{ data.intro || '-' }</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
                variant="outline">关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AccountDialog;
