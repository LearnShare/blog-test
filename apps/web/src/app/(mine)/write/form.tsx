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
import {
  useRequest,
} from '@/hooks'

const KnownErrors = {
  'UID exists': 'ID 已存在',
};

function required(value: string, name: string) {
  if (!value) {
    return `请填写${name}`;
  }

  return null;
}

function checkUid(value: string) {
  if (value
      && !Validator.validateUid(value).success) {
    return '请输入有效的文章 ID';
  }

  return null;
}

let published = false;

function PostForm() {
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

  const formOnChange = (data: Record<string, any>, dirty: Record<string, any>) => {
    setFormData(data);
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
    data: Record<string, any>,
    dirty: Record<string, boolean>
  ) => {
    for (const name in data) {
      if (dirty?.[name]) {
        validate(name, data[name]);
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

    return post.create({
      ...formData,
      format: 'MARKDOWN',
      published,
    });
  };

  const {
    run,
    loading,
    error,
  } = useRequest(validateAndSubmit, {
    auto: false,
    onSuccess: (res) => {
      console.log(res);
      const {
        uid,
      } = res;

      router.push(`/post/${uid}`);
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
          title: '',
          uid: '',
          intro: '',
          content: '',
        } }
        errors={ errors }
        disabled={ loading }
        onChange={ (
          data: Record<string, any>,
          dirty: Record<string, boolean>
        ) => formOnChange(data, dirty) }>
      <div className="flex gap-4 items-center">
        <h2 className="text-xl flex-1">编写文章</h2>
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
        <Textarea className="flex-1" />
      </FormItem>
    </Form>
  );
}

export default PostForm;
