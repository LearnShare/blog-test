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
  validateEmail,
  validatePassword,
} from '@/components/form';
import InputPassword from '@/components/form/controls/input-password';

function SignUpForm() {
  const [
    formData,
    setFormData,
  ] = useState<Record<string, any>>({});
  const [
    errors,
    setErrors,
  ] = useState<Record<string, string>>({});

  const formOnChange = (data: Record<string, any>) => {
    setFormData(data);
    console.log(data);
  };

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
    }))
  };

  const validateForm = useCallback((data: Record<string, any>) => {
    for (const name in data) {
      validate(name, data[name]);
    }
  }, []);

  useEffect(() => {
    validateForm(formData);
  }, [
    validateForm,
    formData,
  ]);


  return (
    <Form
        layout="vertical"
        initialValue={ {
          email: '',
          password: '',
        } }
        errors={ errors }
        onChange={ (data: Record<string, any>) => formOnChange(data) }>
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
          size="lg">注册</Button>
    </Form>
  );
}

export default SignUpForm;
