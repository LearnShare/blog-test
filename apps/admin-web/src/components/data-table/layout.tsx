import React from 'react';

interface DataTableLayoutProps {
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DataTableLayout({
  header,
  body,
  footer,
}: DataTableLayoutProps) {
  return (
    <div className="flex-1 flex flex-col gap-4">
      {
        header && (
          <div className="bg-white">{ header }</div>
        )
      }
      <div className="flex-1 bg-white">{ body }</div>
      {
        footer && (
          <div className="bg-white">{ footer }</div>
        )
      }
    </div>
  );
}
