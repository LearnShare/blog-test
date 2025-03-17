'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  useRouter,
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
  validateUid,
} from '@/components/form';
import AccountContext from '@/components/provider/account-context';

import {
  auth,
} from '@packages/lib/sdk/web';
import {
  useRequest,
} from '@/hooks'

function UpdateForm() {
  const router = useRouter();

  const {
    info,
    setInfo,
  } = useContext(AccountContext);

  const {
    run: getInfo,
    loading: loadingInfo,
    data: loaded,
    error: loadInfoError,
  } = useRequest(auth.accountInfo, {
    auto: false,
    onSuccess: (res) => {
      setInfo(res);
    },
  });
  // TODO switch to SWR
  useEffect(() => {
    if (!info
        && !loaded
        && !loadingInfo
        && !loadInfoError) {
      getInfo();
    }
  }, [
    info,
    loaded,
    loadingInfo,
    loadInfoError,
    getInfo,
  ]);

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

  const validateName = (value: string) => {
    if (!value) {
      return '名字不能为空';
    }

    return null;
  };

  // TODO validate in form-item props
  const validate = useCallback((name: string, value: any) => {
    let result = '';

    switch (name) {
      case 'name':
        result = validateName(value);
        break;
      case 'uid':
        result = validateUid(value);
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

    return auth.updateInfo(formData);
  };

  const {
    run: updateInfo,
    loading,
    error,
  } = useRequest(validateAndSubmit, {
    auto: false,
    onSuccess: (res) => {
      const {
        uid,
      } = res;

      router.push(`/@${uid}`);
    },
  });

  if (!info) {
    return null;
  }

  // TODO: upload avatar

  return (
    <Form
        layout="vertical"
        initialValue={ {
          name: info.name,
          uid: info.uid,
        } }
        errors={ errors }
        disabled={ loading }
        onChange={ (
          data: Record<string, any>,
          dirty: Record<string, boolean>
        ) => formOnChange(data, dirty) }>
      <FormItem
          label="名字"
          name="name">
        <Input />
      </FormItem>
      <FormItem
          label="ID"
          name="uid">
        <Input />
      </FormItem>
      <Button
          className="mt-3"
          size="lg"
          disabled={ loading }
          onClick={ () => updateInfo() }>修改并继续</Button>
      {
        error && (
          <FormError>{ error.message }</FormError>
        )
      }
      <Button
          className="mt-6"
          variant="outline"
          size="lg"
          disabled={ loading }>跳过</Button>
      <div className="text-right text-xs text-slate-500">稍后可以在个人中修改</div>
    </Form>
  );
}

export default UpdateForm;
