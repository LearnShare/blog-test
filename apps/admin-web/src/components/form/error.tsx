import React from 'react';

interface FormErrorProps {
  children: React.ReactNode;
}

function FormError({
  children,
}: FormErrorProps) {
  return (
    <div className="mt-1 text-sm text-red-500">{ children }</div>
  );
}

export default FormError;
