'use client';

import React from 'react';
import {
  EllipsisVertical as IconEllipsisVertical,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FormActionProps {
  cover?: {
    id: number;
    url: string;
  } | null;
  upload?: () => void;
  remove?: () => void;
  className?: string;
}

function FormActions({
  cover,
  upload,
  remove,
  className,
}: FormActionProps) {

  const menuOnSelect = (action: string) => {
    switch (action) {
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
