import {
  useNavigate,
  useSearchParams,
} from 'react-router';
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
} from '@packages/sdk/admin';
import Store from '@/lib/store';

const KnownErrors: Record<string, string> = {
  'Account or Password error': '账号或密码错误',
  'Not allowed': '该账号禁止登录本平台',
};

interface FormData {
  email: string;
  password: string;
}

function SignInForm() {
  const navigate = useNavigate();
  const [
    searchParams,
  ] = useSearchParams();

  const {
    run: signIn,
    loading,
    error,
  } = useRequest((data: FormData) =>
      auth.signIn(data.email, data.password),
    {
      manual: true,
      onSuccess: (res) => {
        const {
          token,
          data,
        } = res;

        const {
          verified,
        } = data;

        Store.setToken(token);

        if (!verified) {
          navigate('/welcome');
        } else {
          const redirect = searchParams.get('redirect');

          navigate(redirect
              ? window.decodeURIComponent(redirect)
              : '/home');
        }
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
        onSubmit={ handleSubmit(signIn) }>
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
          disabled={ loading }>登录</Button>
      {
        !loading && error && (
          <FormError>{ KnownErrors[error.message] || error.message }</FormError>
        )
      }
    </Form>
  );
}

export default SignInForm;
