'use client';

import React from 'react';
import {
  EllipsisVertical as IconEllipsisVertical,
  Save as IconSave,
  ImageUp as IconImageUp,
  Trash2 as IconTrash2,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FormActionProps {
  cover?: {
    id: number;
    url: string;
  } | null;
  save?: () => void;
  upload?: () => void;
  remove?: () => void;
  className?: string;
}

function FormActions({
  cover,
  save,
  upload,
  remove,
  className,
}: FormActionProps) {

  const menuOnSelect = (action: string) => {
    switch (action) {
      case 'save':
        save?.();
        return;
      case 'upload':
        upload?.();
        return;
      case 'remove':
        remove?.();
        return;
      default:
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              className={ className }
              variant="outline"
              size="icon">
            <IconEllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
              onSelect={ () => menuOnSelect('save') }>
            <IconSave />
            <span>保存为草稿</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
              onSelect={ () => menuOnSelect('upload') }>
            <IconImageUp />
            <span>上传封面</span>
          </DropdownMenuItem>
          {
            cover && (
              <DropdownMenuItem
                  onSelect={ () => menuOnSelect('remove') }>
                <IconTrash2 />
                <span>删除封面</span>
              </DropdownMenuItem>
            )
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default FormActions;
