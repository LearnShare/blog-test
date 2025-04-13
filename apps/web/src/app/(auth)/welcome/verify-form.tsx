'use client';

import React from 'react';
import {
  useRequest,
} from 'ahooks';
import {
  useForm,
} from 'react-hook-form';
// import {
//   REGEXP_ONLY_DIGITS,
// } from 'input-otp';

import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from '@/components/ui/input-opt';
// 🤷 not work with react-hook-form
import {
  Form,
  FormItem,
  FormError,
} from '@/components/form';

import {
  auth,
} from '@packages/sdk/web';
import {
  useCountdown,
} from '@/hooks'

const KnownErrors: Record<string, string> = {
  'Invalid verification code': '无效的激活代码',
};

const validateCode = (value: string) => {
  if (value.length !== 6) {
    return '激活代码格式错误';
  }

  return true;
};

interface FormData {
  code: string;
}

interface VerifyFormProps {
  onSuccess?: () => void;
}

function VerifyForm({
  onSuccess,
}: VerifyFormProps) {
  const {
    run: verify,
    loading,
    error,
  } = useRequest((data: FormData) =>
      auth.verifyAccount(data.code),
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
      code: '',
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
  } = useRequest(() => auth.requestVerify(), {
    manual: true,
    onSuccess: () => {
      startCountdown();
    },
  });

  return (
    <>
      <Form
          layout="vertical"
          onSubmit={ handleSubmit(verify) }>
        <FormItem
            label="激活代码"
            error={ errors?.code?.message }>
          <Input
              type="number"
              {
                ...register('code', {
                  required: '请填写激活代码',
                  validate: validateCode,
                })
              }
              name="code"
              disabled={ loading } />
          {/* <InputOTP
              pattern={ REGEXP_ONLY_DIGITS }
              maxLength={ 6 }
              {
                ...register('code', {
                  required: '请填写激活代码',
                  validate: validateCode,
                })
              }
              disabled={ loading }>
            <InputOTPGroup>
              <InputOTPSlot index={ 0 } />
              <InputOTPSlot index={ 1 } />
              <InputOTPSlot index={ 2 } />
              <InputOTPSlot index={ 3 } />
              <InputOTPSlot index={ 4 } />
              <InputOTPSlot index={ 5 } />
            </InputOTPGroup>
          </InputOTP> */}
        </FormItem>
        <Button
            size="lg"
            disabled={ loading }>继续</Button>
        {
          !loading && error && (
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
          !sending && sendError && (
            <FormError>{ KnownErrors[sendError.message] || sendError.message }</FormError>
          )
        }
      </div>
    </>
  );
}

export default VerifyForm;
