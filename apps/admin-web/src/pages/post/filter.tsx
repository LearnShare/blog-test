import React, {
  useState,
} from 'react';

import {
  Input,
} from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Button,
} from '@/components/ui/button';

import {
  publishedOptions,
} from './data';

export interface FilterData {
  search?: string;
  author?: string;
  published?: string;
};

interface FilterProps {
  filters: FilterData,
  // onChange?: (data: FilterData) => void,
  onRun?: (data: FilterData) => void,
}

export default function Filter({
  filters,
  // onChange,
  onRun,
}: FilterProps) {
  const [
    values,
    setValues,
  ] = useState<FilterData>(filters);

  const itemOnChange = (name: string, value: string) => {
    setValues((oldValues) => {
      const newValues = {
        ...oldValues,
        [name]: value,
      };

      // onChange?.(newValues);

      return newValues;
    });
  };

  const onReset = () => {
    setValues(filters);

    onRun?.(filters);
  };

  return (
    <div className="flex gap-5 justify-between items-center">
      <div className="flex gap-2">
        <Input
            className="w-[240px]"
            placeholder="标题、简介、内容"
            value={ values.search }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => itemOnChange('search', event.currentTarget.value) } />
        <Input
            className="w-[240px]"
            placeholder="用户 ID"
            value={ values.author }
            onChange={ (event: React.ChangeEvent<HTMLInputElement>) => itemOnChange('author', event.currentTarget.value) } />
        <Select
            value={ values.published }
            onValueChange={ (value: string) => itemOnChange('published', value) }>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            {
              publishedOptions.map((option) => (
                <SelectItem
                    key={ option.value }
                    value={ option.value }>{ option.label }</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button
            variant="outline"
            onClick={ () => onReset() }>重置</Button>
        <Button
            onClick={ () => onRun?.(values) }>筛选</Button>
      </div>
    </div>
  );
}
