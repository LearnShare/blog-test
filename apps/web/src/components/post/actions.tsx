'use client';

import React from 'react';
import {
  EllipsisVertical as IconEllipsisVertical,
  PencilLine as IconPencilLine,
  Send as IconSend,
  Undo2 as IconUndo2,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  post,
} from '@packages/lib/sdk/web';

interface PostActionProps {
  id: number;
  uid: string;
  published: boolean;
  onActionDone?: (action: string) => void;
}

function PostActions({
  id,
  uid,
  published,
  onActionDone,
}: PostActionProps) {
  const router = useRouter();

  const {
    run: publishPost,
  } = useRequest(() => post.update(id, {
    published: true,
  }), {
    manual: true,
    onSuccess: () => {
      onActionDone('publish');
    },
  });

  const {
    run: withdrawPost,
  } = useRequest(() => post.update(id, {
    published: false,
  }), {
    manual: true,
    onSuccess: () => {
      onActionDone('withdraw');
    },
  });

  const {
    run: deletePost,
  } = useRequest(() => post.del(id), {
    manual: true,
    onSuccess: () => {
      onActionDone('delete');
    },
  });

  const menuOnSelect = (action: string) => {
    switch (action) {
      case 'edit':
        router.push(`/edit/${uid}`);
        return;
      case 'publish':
        publishPost();
        return;
      case 'withdraw':
        withdrawPost();
        return;
      case 'delete':
        deletePost();
        return;
      default:
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
            className="absolute right-1 top-1"
            variant="ghost"
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
        {
          !published && (
            <DropdownMenuItem
                onSelect={ () => menuOnSelect('publish') }>
              <IconSend />
              <span>发布</span>
            </DropdownMenuItem>
          )
        }
        {
          published && (
            <DropdownMenuItem
                onSelect={ () => menuOnSelect('withdraw') }>
              <IconUndo2 />
              <span>取消发布</span>
            </DropdownMenuItem>
          )
        }
        <DropdownMenuSeparator />
        <DropdownMenuItem
            onSelect={ () => menuOnSelect('delete') }>
          <IconTrash2 />
          <span>删除</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  );
}

export default PostActions;
