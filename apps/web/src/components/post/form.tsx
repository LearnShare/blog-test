'use client';

import React, {
  useState,
} from 'react';
import {
  useRouter,
} from 'next/navigation';
import {
  useRequest,
} from 'ahooks'
import {
  useForm,
} from 'react-hook-form';

import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';
import {
  Textarea,
} from '@/components/ui/textarea';
import {
  Form,
  FormItem,
  FormError,
} from '@/components/form';
import FormActions from '@/components/post/actions/form';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Validator from '@packages/lib/validator';
import {
  post,
} from '@packages/lib/sdk/web';
import type {
  Post,
} from '@/types/post';
import CoverDialog from '@/components/post/dialogs/cover';

const KnownErrors: Record<string, string> = {
  'UID exists': 'ID 已存在',
};

interface FormData {
  title: string;
  uid: string;
  intro: string;
  content: string;
}

function validateUid(value: string) {
  if (value
      && !Validator.validatePostUid(value).success) {
    return '请输入有效的文章 ID';
  }

  return true;
}

function PostForm({
  data,
}: {
  data?: Post;
}) {
  const router = useRouter();

  const submit = (formData: FormData) => {
    const postData = {
      ...formData,
      format: 'MARKDOWN',
      cover: cover?.id,
      coverUrl: cover?.url || '',
    };

    if (data
        && data.id) {
      return post.update(data.id, postData);
    } else {
      return post.create(postData);
    }
  };

  const [
    cover,
    setCover,
  ] = useState((data?.cover && data?.coverUrl)
      ? {
        id: data?.cover,
        url: data?.coverUrl,
      }
      : null
    );
  const [
    coverDialogOpen,
    setCoverDialogOpen,
  ] = useState(false);
  const coverDialogOnClose = (coverData: any) => {
    if (coverData) {
      setCover(coverData);
    }

    setCoverDialogOpen(false);
  };

  const {
    run: save,
    loading,
    error,
  } = useRequest((formData: FormData) =>
      submit(formData),
    {
      manual: true,
      onSuccess: (res) => {
        const {
          uid,
        } = res;

        router.push(`/draft/${uid}`);
      },
    },
  );

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FormData>({
    mode: 'all',
    defaultValues: {
      title: data?.title
          || '',
      uid: data?.uid
          || '',
      intro: data?.intro
          || '',
      content: data?.content
          || '',
    },
  });

  return (
    <>
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex gap-4 items-center">
          <h2 className="text-xl flex-1">{ data?.id ? '修改' : '编写' }文章</h2>
          <FormActions
              cover={ cover }
              upload={ () => setCoverDialogOpen(true) }
              remove={ () => setCover(null) } />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                    disabled={ loading }
                    onClick={ handleSubmit((formData: FormData) => save(formData)) }>保存</Button>
              </TooltipTrigger>
              <TooltipContent align="end">保存为草稿，并提交审核</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {
          !loading && error && (
            <FormError>{ KnownErrors[error.message] || error.message }</FormError>
          )
        }
        {
          cover && cover.url && (
            <div className="flex justify-center">
              <img
                  className="max-w-[100%] max-h-[400px]"
                  src={ cover.url }
                  alt="cover" />
            </div>
          )
        }
      </div>
      <Form
          className="flex-1
            [&>*]:last:flex-1 [&>*]:last:flex [&>*]:last:flex-col"
          layout="vertical"
          onSubmit={ (event) => event.preventDefault() }>
        <FormItem
            label="文章标题"
            error={ errors?.title?.message }>
          <Input
              {
                ...register('title', {
                  required: '请填写文章标题',
                })
              }
              disabled={ loading } />
        </FormItem>
        <FormItem
            label="文章 ID"
            error={ errors?.uid?.message }>
          <Input
              {
                ...register('uid', {
                  validate: validateUid,
                })
              }
              disabled={ loading } />
        </FormItem>
        <FormItem
            label="文章简介"
            error={ errors?.intro?.message }>
          <Input
              {
                ...register('intro')
              }
              disabled={ loading } />
        </FormItem>
        <FormItem
            className="flex-1"
            label="文章内容（Markdown 格式）"
            error={ errors?.content?.message }>
          <Textarea
              className="flex-1 min-h-[400px] text-base!"
              {
                ...register('content', {
                  required: '请填写文章内容',
                })
              }
              disabled={ loading } />
        </FormItem>

        <CoverDialog
            open={ coverDialogOpen }
            onClose={ (coverData?: any) => coverDialogOnClose(coverData) } />
      </Form>
    </>
  );
}

export default PostForm;
