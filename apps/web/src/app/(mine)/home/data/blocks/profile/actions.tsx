'use client';

import React, {
  useState,
  useContext,
} from 'react';
import {
  useRequest,
} from 'ahooks';
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
import Alert from '@/components/dialog/alert';
import ProfileDialog from './dialogs/profile';
import PasswordDialog from './dialogs/password';

import AccountContext from '@/components/provider/account-context';
import {
  file,
} from '@packages/sdk/web';

interface ProfileActionProps {
  // onActionDone?: (action: string) => void;
  className?: string;
}

function ProfileActions({
  // onActionDone,
  className,
}: ProfileActionProps) {
  const {
    info,
    setInfo,
  } = useContext(AccountContext);

  const [
    avatarDialogOpen,
    setAvatarDialogOpen,
  ] = useState(false);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const {
    run: deleteAvatar,
    loading: deleting,
  } = useRequest(() => file.deleteAvatar(), {
    manual: true,
    onSuccess: (res) => {
      setInfo(res);
    },
  });
  const deleteOnClick = () => {
    setDeleteDialogOpen(false);
    deleteAvatar();
  };

  const [
    profileDialogOpen,
    setProfileDialogOpen,
  ] = useState(false);

  const [
    passwordDialogOpen,
    setPasswordDialogOpen,
  ] = useState(false);

  const menuOnSelect = (action: string) => {
    switch (action) {
      case 'upload-avatar':
        setAvatarDialogOpen(true);
        return;
      case 'delete-avatar':
        setDeleteDialogOpen(true);
        return;
      case 'profile':
        setProfileDialogOpen(true);
        return;
      case 'password':
        setPasswordDialogOpen(true);
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
            disabled={ deleting }
            onSelect={ () => menuOnSelect('upload-avatar') }>
          <IconUpload />
          <span>上传头像</span>
        </DropdownMenuItem>
        {
          info?.avatar && (
            <DropdownMenuItem
                disabled={ deleting }
                onSelect={ () => menuOnSelect('delete-avatar') }>
              <IconTrash2 />
              <span>删除头像</span>
            </DropdownMenuItem>
          )
        }
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

      <Alert
          open={ deleteDialogOpen }
          onClose={ () => setDeleteDialogOpen(false) }
          title="提示"
          content="删除您的头像？"
          cancel="取消"
          ok="删除"
          onOk={ () => deleteOnClick() } />

      <ProfileDialog
          open={ profileDialogOpen }
          onClose={ () => setProfileDialogOpen(false) } />

      <PasswordDialog
          open={ passwordDialogOpen }
          onClose={ () => setPasswordDialogOpen(false) } />
    </DropdownMenu>
  );
}

export default ProfileActions;
