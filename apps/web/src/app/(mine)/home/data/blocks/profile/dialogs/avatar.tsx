'use client';

import React, {
  useState,
  useMemo,
  useContext,
} from 'react';
import {
  ImageUp as IconImageUp,
} from 'lucide-react';
import {
  useRequest,
} from 'ahooks';

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

import AccountContext from '@/components/provider/account-context';
import {
  file,
} from '@packages/lib/sdk/web';

interface AvatarDialogProps {
  open?: boolean;
  onClose?: () => void;
}

function AvatarDialog({
  open,
  onClose,
}: AvatarDialogProps) {
  const {
    setInfo,
  } = useContext(AccountContext);

  const [
    avatar,
    setAvatar,
  ] = useState(null);

  const imageSrc = useMemo(() => {
    if (avatar) {
      return URL.createObjectURL(avatar);
    }

    return null;
  }, [
    avatar,
  ]);

  const [
    done,
    setDone,
  ] = useState(false);

  const {
    loading: uploading,
  } = useRequest(() => file.uploadAvatar(avatar), {
    ready: !!avatar,
    refreshDeps: [
      avatar,
    ],
    onSuccess: (res) => {
      setInfo(res);
      setDone(true);
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    setAvatar(null);
    setDone(false);

    if (!isOpen) {
      onClose?.();
    }
  };

  const fileOnChange = (event: any) => {
    if (event.target.files.length) {
      setAvatar(event.target.files[0]);
    }
  };

  let message = '选择并上传';
  if (uploading) {
    message = '上传中';
  }
  if (done) {
    message = '上传完毕';
  }

  return (
    <Dialog
        open={ open }
        onOpenChange={ (isOpen: boolean) => onOpenChange(isOpen) }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>上传头像</DialogTitle>
          <DialogDescription
              className="hidden"
              aria-hidden>上传头像</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <label className="
              border-2 border-dashed border-slate-200 rounded-2xl
              flex flex-col items-center w-[140px] h-[140px] justify-center
              cursor-pointer hover:border-slate-300">
            {
              !imageSrc && (
                <IconImageUp
                    className="text-gray-400"
                    size={ 48 }
                    strokeWidth={ 1.25 } />
              )
            }
            {
              imageSrc && (
                <img
                    className="w-[64px] h-[64px] rounded-[50%]"
                    src={ imageSrc }
                    alt="preview" />
              )
            }
            <div className="mt-4 text-sm text-gray-600">{ message }</div>
            <input
                className="invisible w-0 h-0"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={ (event: any) => fileOnChange(event) } />
          </label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
                variant="outline"
                onClick={ () => onClose?.() }>完成</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AvatarDialog;
