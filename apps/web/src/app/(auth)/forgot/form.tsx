'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import Link from 'next/link';
import {
  useRequest,
} from 'ahooks'

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
} from '@packages/lib/sdk/web';

const KnownErrors = {
  'Account not found': '账号不存在',
};

interface ForgotFormProps {
  onSuccess?: () => void;
}

function ForgotForm({
  onSuccess,
}: ForgotFormProps) {
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
      case 'email':
        result = validateEmail(value);
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

    const {
      email,
    } = formData;

    return auth.forgotPassword(email);
  };

  const {
    run: send,
    loading,
    error,
  } = useRequest(validateAndSubmit, {
    manual: true,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  return (
    <Form
        layout="vertical"
        initialValue={ {
          email: '',
        } }
        errors={ errors }
        disabled={ loading }
        onChange={ (
          data: Record<string, any>,
          dirty: Record<string, boolean>
        ) => formOnChange(data, dirty) }>
      <FormItem
          label="邮箱"
          name="email">
        <Input />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }
          onClick={ () => send() }>继续</Button>
      {
        error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
      <div className="mt-4 text-right text-sm text-slate-500">
        <span>忘记账号，</span>
        <Link
            href="/hi"
            className="underline text-slate-600">联系管理员</Link>
      </div>
    </Form>
  );
}

export default ForgotForm;
