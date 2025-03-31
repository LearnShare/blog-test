'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  useRouter,
} from 'next/navigation';
import {
  useRequest,
} from 'ahooks'
import {
  ImageUp as IconImageUp,
  Trash2 as IconTrash2,
} from 'lucide-react';

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

function required(value: string, name: string) {
  if (!value) {
    return `请填写${name}`;
  }

  return '';
}

function checkUid(value: string) {
  if (value
      && !Validator.validatePostUid(value).success) {
    return '请输入有效的文章 ID';
  }

  return '';
}

let published = false;

function PostForm({
  data,
}: {
  data?: Post;
}) {
  const router = useRouter();

  const [
    formData,
    setFormData,
  ] = useState<Record<string, any>>({});
  const [
    formDirty,
    setFormDirty,
  ] = useState<Record<string, boolean>>({});
  const [
    errors,
    setErrors,
  ] = useState<Record<string, string>>({});

  const formOnChange = (formData: Record<string, any>, dirty: Record<string, any>) => {
    setFormData(formData);
    setFormDirty(dirty);
  };

  // TODO validate in form-item props
  const validate = (name: string, value: any) => {
    let result = '';

    switch (name) {
      case 'title':
        result = required(value, '文章标题');
        break;
      case 'content':
        result = required(value, '文章内容');
        break;
      case 'uid':
        result = checkUid(value);
        break;
      default:
    }

    setErrors((oldValue) => ({
      ...oldValue,
      [name]: result,
    }));
  };

  const validateForm = useCallback((
    formData: Record<string, any>,
    dirty: Record<string, boolean>
  ) => {
    for (const name in formData) {
      if (dirty?.[name]) {
        validate(name, formData[name]);
      }
    }
  }, []);

  useEffect(() => {
    validateForm(formData, formDirty);
  }, [
    validateForm,
    formData,
    formDirty,
  ]);

  const validateAndSubmit = async () => {
    for (const name in formData) {
      validate(name, formData[name]);
    }

    for (const name in errors) {
      if (errors[name]) {
        return;
      }
    }

    const postData = {
      ...formData,
      published,
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
    run,
    loading,
    error,
  } = useRequest(validateAndSubmit, {
    manual: true,
    onSuccess: (res) => {
      const {
        uid,
        published,
      } = res;

      router.push(`/${published ? 'post' : 'draft'}/${uid}`);
    },
  });

  const save = (pub = false) => {
    published = pub;

    run();
  };

  return (
    <Form
        className="flex-1
          [&>*]:last:flex-1 [&>*]:last:flex [&>*]:last:flex-col"
        layout="vertical"
        initialValue={ {
          title: data?.title
              || '',
          uid: data?.uid
              || '',
          intro: data?.intro
              || '',
          content: data?.content
              || '',
        } }
        errors={ errors }
        onChange={ (
          formData: Record<string, any>,
          dirty: Record<string, boolean>
        ) => formOnChange(formData, dirty) }>
      <div className="flex gap-4 items-center">
        <h2 className="text-xl flex-1">{ data?.id ? '修改' : '编写' }文章</h2>
        {
          cover && cover.url && (
            <Button
                variant="outline"
                disabled={ loading }
                onClick={ () => setCover(null) }>
              <IconTrash2 />
              <span>删除封面</span>
            </Button>
          )
        }
        <Button
            variant="outline"
            disabled={ loading }
            onClick={ () => setCoverDialogOpen(true) }>
          <IconImageUp />
          <span>上传封面</span>
        </Button>
        <Button
            variant="outline"
            disabled={ loading }
            onClick={ () => save() }>保存为草稿</Button>
        <Button
            disabled={ loading }
            onClick={ () => save(true) }>保存并发布</Button>
      </div>
      {
        error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
      {
        cover && cover.url && (
          <div className="flex justify-center">
            <img
                className="max-w-[100%]"
                src={ cover.url }
                alt="cover" />
          </div>
        )
      }
      <FormItem
          label="标题"
          name="title">
        <Input />
      </FormItem>
      <FormItem
          label="ID"
          name="uid">
        <Input />
      </FormItem>
      <FormItem
          label="简介"
          name="intro">
        <Input />
      </FormItem>
      <FormItem
          className="flex-1"
          label="内容（Markdown 格式）"
          name="content">
        <Textarea className="flex-1 min-h-[600px] text-base!" />
      </FormItem>

      <CoverDialog
          open={ coverDialogOpen }
          onClose={ (coverData?: any) => coverDialogOnClose(coverData) } />
    </Form>
  );
}

export default PostForm;
