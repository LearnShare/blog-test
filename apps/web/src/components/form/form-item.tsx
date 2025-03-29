'use client';

import React, {
  useContext,
} from 'react';

import {
  cn,
} from '@/lib/utils';
import FormContext from './context';
import FormError from './error';

interface FormItemProps {
  className?: string;
  label: string;
  name: string;
  hint?: React.ReactNode;
  children: React.ReactElement;
}

function FormItem({
  className,
  label,
  name,
  hint,
  children,
}: FormItemProps) {
  const {
    value,
    errors,
    itemOnChange,
    itemOnInput,
  } = useContext(FormContext);

  const childrenClone = React.cloneElement(children, {
    // @ts-expect-error: should work
    name,
    id: name,
    value: value[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => itemOnChange(name, event.currentTarget.value),
    onInput: () => itemOnInput(name),
  });

  return (
    <div>
      <div
          className={ cn(
            'flex gap-2 items-center',
            'group-data-[layout=vertical]:flex-col',
            {
              '[&_input]:border-red-500': errors?.[name],
              '[&_textarea]:border-red-500': errors?.[name],
            },
            className
          ) }>
        <label
            htmlFor={ name }
            className="
              text-sm w-[20%] text-right
              group-data-[layout=vertical]:w-full
              group-data-[layout=vertical]:text-left
            ">{ label }</label>
        { childrenClone }
      </div>
      {
        errors?.[name] && (
          <FormError>{ errors?.[name] }</FormError>
        )
      }
      {
        hint
      }
    </div>
  );
}

export default FormItem;
