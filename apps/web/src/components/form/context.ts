import {
  createContext,
} from 'react';

export interface FormContextType {
  value: Record<string, any>;
  errors: Record<string, string>;
  itemOnChange: (name: string, data: any) => void;
  itemOnInput: (name: string) => void;
}

const FormContext = createContext<FormContextType>({
  value: {},
  errors: {},
  itemOnChange: () => {},
  itemOnInput: () => {},
});

export default FormContext;
