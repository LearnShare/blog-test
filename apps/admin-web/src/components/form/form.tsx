import React from 'react';

import {
  cn,
} from '@/lib/utils';

interface FormProps {
  className?: string;
  layout?: 'horizontal' | 'vertical',
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

function Form({
  className = '',
  layout = 'horizontal',
  onSubmit,
  children,
}: FormProps) {
  return (
    <form
        className={ cn('group flex flex-col gap-3', className) }
        data-layout={ layout }
        onSubmit={ onSubmit }>
      { children }
    </form>
  );
}

export default Form;
