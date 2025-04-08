'use client';

import React, {
  useContext,
} from 'react';
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
  validateUid,
} from '@/components/form';
import AccountContext from '@/components/provider/account-context';

import {
  auth,
} from '@packages/lib/sdk/web';

interface FormData {
  name: string;
  uid: string;
  intro: string;
}

interface ProfileFormProps {
  action?: string;
  onSuccess?: (data: any) => void;
}

function ProfileForm({
  action,
  onSuccess,
}: ProfileFormProps) {
  const {
    info,
    setInfo,
  } = useContext(AccountContext);

  const {
    run: updateInfo,
    loading,
    error,
  } = useRequest((data: FormData) =>
      auth.updateInfo(data),
    {
      manual: true,
      onSuccess: (res) => {
        setInfo(res);

        onSuccess?.(res);
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
      name: info?.name
          || '',
      uid: info?.uid
          || '',
      intro: info?.intro
          || '',
    },
  });

  if (!info) {
    return null;
  }

  return (
    <Form
        layout="vertical"
        onSubmit={ handleSubmit(updateInfo) }>
      <FormItem
          label="用户名称"
          error={ errors?.name?.message }>
        <Input
            {
              ...register('name', {
                required: '请填写用户名称',
                maxLength: {
                  value: 20,
                  message: '最长允许 20 个字符',
                },
              })
            }
            disabled={ loading } />
      </FormItem>
      <FormItem
          label="用户 ID"
          error={ errors?.uid?.message }
          hint="4-16 个字符，可以包含字母、数字 - _">
        <Input
            {
              ...register('uid', {
                required: '请填写用户 ID',
                validate: validateUid,
              })
            }
            disabled={ loading } />
      </FormItem>
      <FormItem
          label="个人介绍"
          error={ errors?.intro?.message }>
        <Textarea
            {
              ...register('intro', {
                maxLength: {
                  value: 120,
                  message: '最长允许 120 个字符',
                },
              })
            }
            disabled={ loading } />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }>{ action || '保存' }</Button>
      {
        !loading && error && (
          <FormError>{ error.message }</FormError>
        )
      }
    </Form>
  );
}

export default ProfileForm;
