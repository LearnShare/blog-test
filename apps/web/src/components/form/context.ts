'use client';

import {
  createContext,
} from 'react';

export interface FormContextType {
  value: Record<string, any>;
  errors: Record<string, string>;
  onChange: (name: string, data: any) => void;
  onInput: (name: string) => void;
}

const FormContext = createContext<FormContextType>({
  value: {},
  errors: {},
  onChange: () => {},
  onInput: () => {},
});

export default FormContext;
