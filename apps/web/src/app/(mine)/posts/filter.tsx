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

interface FilterProps {
  values: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const publishedOptions = [
  {
    label: '已发布',
    value: 1,
  },
  {
    label: '未发布',
    value: 0,
  },
];

function Filter({
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
          defaultValue={ values.published }
          onValueChange={ (value: boolean) => itemOnChange('published', value) }>
        <TabsList>
          {
            publishedOptions.map((option) => (
              <TabsTrigger
                  key={ option.value }
                  value={ option.value }>{ option.label }</TabsTrigger>
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
        <span>编写文章</span>
      </Link>
    </div>
  );
}

export default Filter;
