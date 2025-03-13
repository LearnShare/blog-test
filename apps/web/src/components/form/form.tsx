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
  errors?: Record<string, string | null>;
  disabled?: boolean;
  onChange?: (data: Record<string, any>) => void;
  children: React.ReactNode;
}

function Form({
  className = '',
  layout = 'horizontal',
  initialValue,
  errors = {},
  disabled = false,
  onChange,
  children,
}: FormProps) {
  const [
    value,
    setValue,
  ] = useState<Record<string, any>>(initialValue);

  const itemOnChange = useCallback((name: string, data: any) => {
    setValue((oldValue) => ({
      ...oldValue,
      [name]: data,
    }));
  }, []);

  useEffect(() => {
    onChange?.(value);
  }, [
    value,
    onChange,
  ]);

  const contextValue = useMemo(() => ({
    value,
    errors,
    itemOnChange,
  }), [
    value,
    errors,
    itemOnChange,
  ]);

  return (
    <FormContext.Provider value={ contextValue }>
      <form
          className={ cn('group flex flex-col gap-3', className) }
          data-layout={ layout }
          disabled={ disabled }
          onSubmit={ (event) => {
            event.preventDefault();
          } }>
        { children }
      </form>
    </FormContext.Provider>
  );
}

export default Form;
