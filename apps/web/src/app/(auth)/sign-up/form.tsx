'use client';

import React from 'react';
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
  Form,
  FormItem,
  FormError,
  validateEmail,
  validatePassword,
} from '@/components/form';
import InputPassword from '@/components/form/controls/input-password';

import {
  auth,
} from '@packages/lib/sdk/web';

const KnownErrors: Record<string, string> = {
  'Account already exists': '账号已存在',
};

interface FormData {
  email: string;
  password: string;
}

interface SignUpFormProps {
  onSuccess?: () => void;
}

function SignUpForm({
  onSuccess,
}: SignUpFormProps) {
  const {
    run: signUp,
    loading,
    error,
  } = useRequest((data: FormData) =>
      auth.signUp(data.email, data.password),
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
      password: '',
    },
  });

  return (
    <Form
        layout="vertical"
        onSubmit={ handleSubmit(signUp) }>
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
      <FormItem
          label="密码"
          error={ errors?.password?.message }>
        <InputPassword
            {
              ...register('password', {
                required: '请填写密码',
                validate: validatePassword,
              })
            }
            disabled={ loading } />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }>注册</Button>
      {
        !loading && error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
    </Form>
  );
}

export default SignUpForm;
