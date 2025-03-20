'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import Link from 'next/link';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

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
import AccountContext from '@/components/provider/account-context';

import {
  auth,
} from '@packages/lib/sdk/web';
import {
  useRequest,
} from '@/hooks'
import Store from '@/lib/store';
import {
  setCookie,
} from './actions';

const KnownErrors = {
  'Account or Password error': '账号或密码错误',
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    setInfo,
  } = useContext(AccountContext);

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

    return auth.signIn(email, password);
  };

  const {
    run: signIn,
    loading,
    error,
  } = useRequest(validateAndSubmit, {
    auto: false,
    onSuccess: (res) => {
      const {
        token,
        data,
      } = res;

      const {
        verified,
      } = data;

      Store.setToken(token);
      setInfo(data);

      setCookie(token);

      if (!verified) {
        router.push('/welcome');
      } else {
        const redirect = searchParams.get('redirect');

        router.push(redirect
            ? window.decodeURIComponent(redirect)
            : '/home');
      }
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
          name="password"
          hint={ (
            <div className="mt-2 text-right text-sm text-slate-500">
              <span>忘记密码，</span>
              <Link
                  href="/forgot"
                  className="underline text-slate-600">找回</Link>
            </div>
          ) }>
        <InputPassword />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }
          onClick={ () => signIn() }>登录</Button>
      {
        error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
    </Form>
  );
}

export default SignInForm;
