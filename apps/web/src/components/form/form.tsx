'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import FormContext from './context';

import {
  cn,
} from '@/lib/utils';

interface FormProps {
  className?: string;
  layout?: 'horizontal' | 'vertical',
  initialValue: Record<string, any>;
  errors?: Record<string, string>;
  onChange?: (data: Record<string, any>, dirty: Record<string, boolean>) => void;
  children: React.ReactNode;
}

function Form({
  className = '',
  layout = 'horizontal',
  initialValue,
  errors = {},
  onChange,
  children,
}: FormProps) {
  const [
    value,
    setValue,
  ] = useState<Record<string, any>>(initialValue);
  // control ever changed
  const [
    dirty,
    setDirty,
  ] = useState<Record<string, boolean>>({});

  const itemOnChange = useCallback((name: string, data: any) => {
    setValue((oldValue) => ({
      ...oldValue,
      [name]: data,
    }));
  }, []);
  const itemOnInput = useCallback((name: string) => {
    setDirty((oldValue) => ({
      ...oldValue,
      [name]: true,
    }));
  }, []);

  useEffect(() => {
    onChange?.(value, dirty);
  }, [
    value,
    dirty,
    onChange,
  ]);

  const contextValue = useMemo(() => ({
    value,
    errors,
    itemOnChange,
    itemOnInput,
  }), [
    value,
    errors,
    itemOnChange,
    itemOnInput,
  ]);

  return (
    <FormContext.Provider value={ contextValue }>
      <form
          className={ cn('group flex flex-col gap-3', className) }
          data-layout={ layout }
          onSubmit={ (event) => {
            event.preventDefault();
          } }>
        { children }
      </form>
    </FormContext.Provider>
  );
}

export default Form;
