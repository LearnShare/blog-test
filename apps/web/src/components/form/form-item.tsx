'use client';

import React from 'react';

import {
  cn,
} from '@/lib/utils';
import FormError from './error';

interface FormItemProps {
  className?: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactElement;
}

function FormItem({
  className,
  label,
  hint,
  error,
  children,
}: FormItemProps) {
  return (
    <div>
      <label
          className={ cn(
            'flex gap-2 items-center',
            'group-data-[layout=vertical]:flex-col',
            {
              '[&_input]:border-red-500': !!error,
              '[&_textarea]:border-red-500': !!error,
            },
            className
          ) }>
        <div
            className="
              text-sm w-[20%] text-right
              group-data-[layout=vertical]:w-full
              group-data-[layout=vertical]:text-left
            ">{ label }</div>
        { children }
      </label>
      {
        hint && (
          <div className="text-sm text-gray-400 mt-1">{ hint }</div>
        )
      }
      {
        error && (
          <FormError>{ error }</FormError>
        )
      }
    </div>
  );
}

export default FormItem;
