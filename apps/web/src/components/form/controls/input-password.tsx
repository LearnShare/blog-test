'use client';

import React, {
  useState,
  useCallback,
} from 'react';
import {
  Eye as IconEye,
  EyeClosed as IconEyeClosed,
} from 'lucide-react';

import {
  Input,
} from '@/components/ui/input';

interface InputPasswordProps
    extends React.ComponentProps<'input'> {
  showToggle: boolean;
}

function InputPassword({
  showToggle = true,
  ...props
}: InputPasswordProps) {
  const [
    visible,
    setVisible,
  ] = useState(false);

  const toggleVisible = useCallback(() => {
    setVisible((oldValue) => !oldValue);
  }, []);

  return (
    <div className="w-full relative">
      <Input
          { ...props }
          type={ visible ? 'text' : 'password' } />
      {
        showToggle && (
          <div
              className="p-0.5 absolute top-1.5 right-2 opacity-50 cursor-pointer select-none"
              onClick={ toggleVisible }>
            {
              !visible && (
                <IconEyeClosed
                    size={ 20 }
                    strokeWidth={ 1.5 } />
              )
            }
            {
              visible && (
                <IconEye
                    size={ 20 }
                    strokeWidth={ 1.5 } />
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default InputPassword;
