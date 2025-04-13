'use client';

import React, {
  useCallback,
} from 'react';
import {
  useSearchParams,
} from 'next/navigation';
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
  Form,
  FormItem,
  FormError,
  validatePassword,
} from '@/components/form';
import InputPassword from '@/components/form/controls/input-password';

import {
  auth,
} from '@packages/sdk/web';

const KnownErrors: Record<string, string> = {
  'Invalid reset token': '无效的 token',
};

interface FormData {
  password: string;
  repeat: string;
}

interface ResetFormProps {
  onSuccess?: () => void;
}

function ResetForm({
  onSuccess,
}: ResetFormProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token')
      || '';

  const {
    run: updatePassword,
    loading,
    error,
  } = useRequest((data: FormData) =>
      auth.resetPassword(token, data.password),
    {
      manual: true,
      onSuccess: () => {
        onSuccess?.();
      },
    },
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<FormData>({
    mode: 'all',
    defaultValues: {
      password: '',
      repeat: '',
    },
  });

  const password = watch('password');

  const validateRepeat = useCallback((value: string) => {
    const result = validatePassword(value);
    if (typeof result === 'string') {
      return result;
    }

    if (value !== password) {
      return '两次输入的密码不一致';
    }

    return true;
  }, [
    password,
  ]);

  return (
    <Form
        layout="vertical"
        onSubmit={ handleSubmit(updatePassword) }>
      <FormItem
          label="新密码"
          error={ errors?.password?.message }
          hint="8-20 位，可包含字母、数字和部分符号">
        <InputPassword
            {
              ...register('password', {
                required: '请填写新密码',
                validate: validatePassword,
              })
            }
            disabled={ loading } />
      </FormItem>
      <FormItem
          label="确认新密码"
          error={ errors?.repeat?.message }>
        <InputPassword
            {
              ...register('repeat', {
                required: '请再次输入新密码',
                validate: validateRepeat,
              })
            }
            disabled={ loading } />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }>更新密码</Button>
      {
        !loading && error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
    </Form>
  );
}

export default ResetForm;
