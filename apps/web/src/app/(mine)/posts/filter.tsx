import React from 'react';
import Link from 'next/link';
import {
  PencilLine as IconPencilLine,
} from 'lucide-react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  buttonVariants,
} from '@/components/ui/button';

import {
  PostStatusOptions,
} from '@packages/types';

interface FilterProps {
  stats?: Record<string, number>;
  values: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

function Filter({
  stats,
  values,
  onChange,
}: FilterProps) {
  const itemOnChange = (key: string, value: any) => {
    onChange?.({
      ...values,
      [key]: value,
    })
  };

  return (
    <div className="flex gap-4 items-center justify-between">
      <Tabs
          defaultValue={ values.status }
          onValueChange={ (value: string) => itemOnChange('status', value) }>
        <TabsList>
          {
            PostStatusOptions.map((option) => (
              <TabsTrigger
                  key={ option.value }
                  value={ option.value }>{ option.label } { stats?.[option.value] }</TabsTrigger>
            ))
          }
        </TabsList>
      </Tabs>
      <Link
          href="/write"
          className={ buttonVariants({
            variant: 'outline',
          }) }>
        <IconPencilLine />
        <span>编写</span>
      </Link>
    </div>
  );
}

export default Filter;
