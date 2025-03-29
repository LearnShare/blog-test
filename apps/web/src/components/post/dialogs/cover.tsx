'use client';

import React, {
  useState,
  useMemo,
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

import {
  file,
} from '@packages/lib/sdk/web';
import {
  cn,
} from '@/lib/utils';

interface CoverDialogProps {
  open?: boolean;
  onClose?: (data?: any) => void;
}

function CoverDialog({
  open,
  onClose,
}: CoverDialogProps) {
  const [
    cover,
    setCover,
  ] = useState(null);

  const imageSrc = useMemo(() => {
    if (cover) {
      return URL.createObjectURL(cover);
    }

    return null;
  }, [
    cover,
  ]);

  const [
    done,
    setDone,
  ] = useState(false);

  const {
    data,
    loading: uploading,
  } = useRequest(() => file.uploadCover(cover!), {
    ready: !!cover,
    refreshDeps: [
      cover,
    ],
    onSuccess: () => {
      setDone(true);
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    setCover(null);
    setDone(false);

    if (!isOpen) {
      onClose?.();
    }
  };

  const fileOnChange = (event: any) => {
    if (event.target.files.length) {
      setCover(event.target.files[0]);
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
          <DialogTitle>上传封面</DialogTitle>
          <DialogDescription
              className="hidden"
              aria-hidden>上传封面</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <label className={ cn(
            `border-2 border-dashed border-slate-200 rounded-2xl p-4
                flex flex-col items-center w-[140px] min-h-[140px] justify-center
                cursor-pointer hover:border-slate-300`,
            {
              'w-full': imageSrc,
            },
          ) }>
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
                    className="max-w-full"
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
                onClick={ () => onClose?.(data) }>完成</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CoverDialog;
