'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

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
import {
  useRequest,
} from 'ahooks'

const KnownErrors = {
  'Account already exists': '账号已存在',
};

interface SignUpFormProps {
  onSuccess?: () => void;
}

function SignUpForm({
  onSuccess,
}: SignUpFormProps) {
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
      case 'password':
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
      email,
      password,
    } = formData;

    return auth.signUp(email, password);
  };

  const {
    run: signUp,
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
          password: '',
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
      <FormItem
          label="密码"
          name="password">
        <InputPassword />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }
          onClick={ () => signUp() }>注册</Button>
      {
        error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
    </Form>
  );
}

export default SignUpForm;
