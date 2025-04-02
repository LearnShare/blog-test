import React from 'react';

interface DataItemProps {
  icon: React.ReactElement;
  label: string;
  value: string;
}

function DataItem({
  icon,
  label,
  value,
}: DataItemProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 p-4 rounded-lg bg-slate-50 relative overflow-hidden
        max-xs:p-3">
      <div className="absolute p-6 bg-white/50 rounded-full -top-3 -right-3 text-yellow-500
          max-sm:bg-transparent max-xs:hidden">{ icon }</div>
      <h4 className="text-sm text-gray-500
          max-xs:text-center">{ label }</h4>
      <div className="text-3xl text-slate-700 text-center">{ value }</div>
    </div>
  );
}

export default DataItem;
