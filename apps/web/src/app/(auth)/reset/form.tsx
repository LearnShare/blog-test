'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  useSearchParams,
} from 'next/navigation';
import {
  useRequest,
} from 'ahooks'

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
} from '@packages/lib/sdk/web';

const KnownErrors = {
  'Invalid reset token': '无效的 token',
};

interface ResetFormProps {
  onSuccess?: () => void;
}

function ResetForm({
  onSuccess,
}: ResetFormProps) {
  const searchParams = useSearchParams();

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
      case 'password':
        result = validatePassword(value);
        break;
      case 'repeat':
        result = validatePassword(value);
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
      password,
      repeat,
    } = formData;
    if (repeat !== password) {
      setErrors((oldValue) => ({
        ...oldValue,
        repeat: '两次输入的密码不同',
      }));
      return Promise.reject();
    }

    const token = searchParams.get('token');

    return auth.resetPassword(token, password);
  };

  const {
    run: updatePassword,
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
          password: '',
          repeat: '',
        } }
        errors={ errors }
        disabled={ loading }
        onChange={ (
          data: Record<string, any>,
          dirty: Record<string, boolean>
        ) => formOnChange(data, dirty) }>
      <FormItem
          label="新密码"
          name="password">
        <InputPassword />
      </FormItem>
      <FormItem
          label="确认新密码"
          name="repeat">
        <InputPassword />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }
          onClick={ () => updatePassword() }>更新密码</Button>
      {
        error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
    </Form>
  );
}

export default ResetForm;
