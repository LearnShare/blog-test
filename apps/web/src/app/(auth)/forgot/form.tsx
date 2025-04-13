'use client';

import React from 'react';
import Link from 'next/link';
import {
  useRequest,
} from 'ahooks';
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
  Form,
  FormItem,
  FormError,
  validateEmail,
} from '@/components/form';

import {
  auth,
} from '@packages/sdk/web';

const KnownErrors: Record<string, string> = {
  'Account not found': '账号不存在',
};

interface FormData {
  email: string;
}

interface ForgotFormProps {
  onSuccess?: () => void;
}

function ForgotForm({
  onSuccess,
}: ForgotFormProps) {
  const {
    run: send,
    loading,
    error,
  } = useRequest((data: FormData) =>
        auth.forgotPassword(data.email),
    {
      manual: true,
      onSuccess: () => {
        onSuccess?.();
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
      email: '',
    },
  });

  return (
    <Form
        layout="vertical"
        onSubmit={ handleSubmit(send) }>
      <FormItem
          label="邮箱"
          error={ errors?.email?.message }>
        <Input
            {
              ...register('email', {
                required: '请填写邮箱',
                validate: validateEmail,
              })
            }
            disabled={ loading } />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }>继续</Button>
      {
        !loading && error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
      <div className="mt-4 text-right text-sm text-slate-500">
        <span>忘记账号，</span>
        <Link
            href="/about"
            className="underline text-slate-600">联系管理员</Link>
      </div>
    </Form>
  );
}

export default ForgotForm;
