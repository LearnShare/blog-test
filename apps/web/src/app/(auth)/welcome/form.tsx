'use client';

import React, {
  useState,
  useEffect,
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
} from '@/components/form';

import {
  auth,
} from '@packages/lib/sdk/web';
import {
  useRequest,
  useCountdown,
} from '@/hooks'

const KnownErrors = {
  'Invalid verification code': '无效的激活代码',
};

interface WelcomeFormProps {
  onSuccess?: () => void;
}

function WelcomeForm({
  onSuccess,
}: WelcomeFormProps) {
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

  const validateCode = (value: string) => {
    if (!value) {
      return '请输入激活代码';
    }

    return null;
  };

  const validate = useCallback((name: string, value: any) => {
    let result = '';

    switch (name) {
      case 'code':
        result = validateCode(value);
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
    if (loading) {
      return;
    }

    for (const name in formData) {
      validate(name, formData[name]);
    }

    for (const name in errors) {
      if (errors[name]) {
        return;
      }
    }

    // BUG: empty code, but no error (setErrors not finished)
    console.log(formData, errors);

    const {
      code,
    } = formData;

    return auth.verifyAccount(code);
  };

  const {
    run: verify,
    loading,
    error,
  } = useRequest(validateAndSubmit, {
    auto: false,
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const {
    value: countdownValue,
    ticking,
    run: startCountdown,
  } = useCountdown({
    from: 60,
    to: 0,
  });

  const {
    run: send,
    loading: sending,
    error: sendError,
  } = useRequest(() => {
    if (sending) {
      return;
    }

    return auth.requestVerify();
  }, {
    auto: false,
    onSuccess: () => {
      startCountdown();
    },
  });

  return (
    <>
      <Form
          layout="vertical"
          initialValue={ {
            code: '',
          } }
          errors={ errors }
          disabled={ loading }
          onChange={ (
            data: Record<string, any>,
            dirty: Record<string, boolean>
          ) => formOnChange(data, dirty) }>
        <FormItem
            name="code">
          <Input />
        </FormItem>
        <Button
            size="lg"
            disabled={ loading }
            onClick={ () => verify() }>继续</Button>
        {
          error && (
            <FormError>{ KnownErrors[error.message] || error.message }</FormError>
          )
        }
      </Form>
      <div className="mt-6 flex flex-col gap-2">
        <p className="text-sm text-slate-500">未收到邮件？</p>
        <Button
            variant="outline"
            size="lg"
            disabled={ sending || ticking }
            onClick={ () => send() }>{ ticking ? `${countdownValue}s 后重试` : '重新发送' }</Button>
        {
          sendError && (
            <FormError>{ KnownErrors[sendError.message] || sendError.message }</FormError>
          )
        }
      </div>
    </>
  );
}

export default WelcomeForm;
