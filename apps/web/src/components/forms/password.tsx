'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
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

interface PasswordFormProps {
  onSuccess?: (data?: any) => void;
}

const KnownErrors: Record<string, string> = {
  'Old Password error': '旧密码错误',
};

function PasswordForm({
  onSuccess,
}: PasswordFormProps) {
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
  const validate = useCallback((name: string, value: any) => {
    let result = '';

    switch (name) {
      case 'old':
        result = validatePassword(value);
        break;
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
  }, []);

  const validateForm = useCallback((
    data: Record<string, any>,
    dirty: Record<string, boolean>
  ) => {
    for (const name in data) {
      if (dirty?.[name]) {
        validate(name, data[name]);
      }
    }
  }, [
    validate,
  ]);

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
      old,
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

    return auth.updatePassword(old, password);
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
          old: '',
          password: '',
          repeat: '',
        } }
        errors={ errors }
        onChange={ (
          data: Record<string, any>,
          dirty: Record<string, boolean>
        ) => formOnChange(data, dirty) }>
      <FormItem
          label="旧密码"
          name="old">
        <InputPassword />
      </FormItem>
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

export default PasswordForm;
