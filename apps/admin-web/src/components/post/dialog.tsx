import {
  Send as IconSend,
  BookOpenText as IconBookOpenText,
  BookCheck as IconBookCheck,
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
  MarkdownRender,
} from '@/components/render';
import Divider from '@/components/divider';
import Actions from './actions';

import type {
  Post,
  Ticket,
} from '@packages/database';
import {
  cn,
} from '@/lib/utils';
import {
  ticket as ticketAPI,
} from '@packages/sdk/admin';

interface PostDialogProps {
  open?: boolean;
  data: Post;
  ticket?: Ticket;
  onClose?: (updated: boolean) => void;
}

function PostDialog({
  open,
  data,
  ticket,
  onClose,
}: PostDialogProps) {
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose?.(false);
    }
  };

  const {
    run: review,
    loading,
  } = useRequest((action: string, message?: string) =>
      ticketAPI.reviewPost(ticket?.id as number, {
        postId: data?.id,
        action,
        message,
        type: 'post-review',
      }),
    {
      manual: true,
      onSuccess: () => {
        onClose?.(true);
      },
    },
  );

  return (
    <Dialog
        open={ open }
        onOpenChange={ (isOpen: boolean) => onOpenChange(isOpen) }>
      <DialogContent
          className="flex flex-col w-[calc(100%-2rem)] sm:max-w-[1000px] max-h-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>文章详情</DialogTitle>
          <DialogDescription
              className="hidden"
              aria-hidden>文章详情</DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          <div className="text-sm text-slate-500 group-hover:underline">{ data.uid }</div>
          <div
              data-cover={ !!data.coverUrl }
              className="
                  group relative bg-no-repeat bg-top bg-cover
                  data-[cover=true]:min-h-[300px]"
              style={ {
                backgroundImage: data.coverUrl
                  ? `url(${data.coverUrl})`
                  : '',
              } }>
            <h3 className="
                text-2xl tracking-wider left-0 bottom-0 w-full
                group-data-[cover=true]:p-4
                group-data-[cover=true]:bg-black/25
                group-data-[cover=true]:backdrop-blur-sm
                group-data-[cover=true]:text-white
                group-data-[cover=true]:absolute">{ data.title }</h3>
          </div>
          {
            data.intro && (
              <div className="border border-gray-200 p-4 bg-gray-50">{ data.intro }</div>
            )
          }
          <Divider>
            <IconBookOpenText />
          </Divider>
          <div>
            {
              data.format === 'MARKDOWN' && (
                <MarkdownRender
                    content={ data.content } />
              )
            }
            <Divider className="my-10">
              <IconBookCheck />
            </Divider>
          </div>
        </div>
        <DialogFooter className={ cn(
          'flex! flex-row! gap-2 justify-end!',
          {
            'justify-between!': !!ticket,
          },
        ) }>
          {
            ticket && (
              <div className="flex gap-2">
                <Button
                    disabled={ loading }
                    onClick={ () => review('approve') }>
                  <IconSend />
                  <span>发布</span>
                </Button>
                <Actions
                    disabled={ loading }
                    onAction={ (message: string) => review('reject', message) } />
              </div>
            )
          }
          <DialogClose asChild>
            <Button
                disabled={ loading }
                variant="outline">关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;
