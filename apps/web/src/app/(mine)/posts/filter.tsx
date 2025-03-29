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
  stats?: Record<string, number>;
  values: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

const publishedOptions = [
  {
    label: '已发布',
    key: 'published',
    value: '1',
  },
  {
    label: '未发布',
    key: 'unpublished',
    value: '0',
  },
];

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
          defaultValue={ values.published }
          onValueChange={ (value: string) => itemOnChange('published', Number(value)) }>
        <TabsList>
          {
            publishedOptions.map((option) => (
              <TabsTrigger
                  key={ option.value }
                  value={ option.value }>{ option.label } { stats?.[option.key] }</TabsTrigger>
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
