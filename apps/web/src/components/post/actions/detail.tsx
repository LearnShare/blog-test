'use client';

import React, {
  useState,
} from 'react';
import {
  EllipsisVertical as IconEllipsisVertical,
  PencilLine as IconPencilLine,
  Trash2 as IconTrash2,
} from 'lucide-react';
import {
  useRouter,
} from 'next/navigation';
import {
  useRequest,
} from 'ahooks';

import {
  Button,
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Alert from '@/components/dialog/alert';

import {
  post,
} from '@packages/sdk/web';

interface DetailActionProps {
  id: number;
  uid: string;
  onActionDone?: (action: string) => void;
  className?: string;
}

function DetailActions({
  id,
  uid,
  onActionDone,
  className,
}: DetailActionProps) {
  const router = useRouter();

  const {
    run: deletePost,
  } = useRequest(() => post.del(id), {
    manual: true,
    onSuccess: () => {
      onActionDone?.('delete');
    },
  });

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);
  const deleteOnClick = () => {
    setDeleteDialogOpen(false);
    deletePost();
  };

  const menuOnSelect = (action: string) => {
    switch (action) {
      case 'edit':
        router.push(`/edit/${uid}`);
        return;
      case 'delete':
        setDeleteDialogOpen(true);
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
              onSelect={ () => menuOnSelect('edit') }>
            <IconPencilLine />
            <span>修改</span>
          </DropdownMenuItem>
          <DropdownMenuItem
              onSelect={ () => menuOnSelect('delete') }>
            <IconTrash2 />
            <span>删除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Alert
          open={ deleteDialogOpen }
          onClose={ () => setDeleteDialogOpen(false) }
          title="请确认"
          content="文章删除后，将无法恢复。仍然继续？"
          cancel="取消"
          ok="删除"
          onOk={ () => deleteOnClick() } />
    </>
  );
}

export default DetailActions;
