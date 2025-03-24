'use client';

import React, {
  useState,
} from 'react';
import {
  EllipsisVertical as IconEllipsisVertical,
  PencilLine as IconPencilLine,
  Upload as IconUpload,
  RectangleEllipsis as IconRectangleEllipsis,
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
} from '@/components/ui/dropdown-menu';
import AvatarDialog from './dialogs/avatar';

interface ProfileActionProps {
  onActionDone?: (action: string) => void;
  className?: string;
}

function ProfileActions({
  // onActionDone,
  className,
}: ProfileActionProps) {
  const [
    avatarDialogOpen,
    setAvatarDialogOpen,
  ] = useState(false);

  const menuOnSelect = (action: string) => {
    switch (action) {
      case 'upload-avatar':
        setAvatarDialogOpen(true);
        return;
      case 'publish':
        return;
      case 'withdraw':
        return;
      case 'delete':
        return;
      default:
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
            className={ className }
            variant="ghost"
            size="icon">
          <IconEllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
            onSelect={ () => menuOnSelect('upload-avatar') }>
          <IconUpload />
          <span>上传头像</span>
        </DropdownMenuItem>
        <DropdownMenuItem
            onSelect={ () => menuOnSelect('delete-avatar') }>
          <IconTrash2 />
          <span>删除头像</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
            onSelect={ () => menuOnSelect('profile') }>
          <IconPencilLine />
          <span>修改资料</span>
        </DropdownMenuItem>
        <DropdownMenuItem
            onSelect={ () => menuOnSelect('password') }>
          <IconRectangleEllipsis />
          <span>修改密码</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AvatarDialog
          open={ avatarDialogOpen }
          onClose={ () => setAvatarDialogOpen(false) } />
    </DropdownMenu>
  );
}

export default ProfileActions;
