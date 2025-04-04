import {
  createContext,
} from 'react';
import {
  FieldErrors,
} from 'react-hook-form';

export interface FormContextType {
  errors: FieldErrors;
}

const FormContext = createContext<FormContextType>({
  errors: {},
});

export default FormContext;
