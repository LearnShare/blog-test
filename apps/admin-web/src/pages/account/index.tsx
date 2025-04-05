import React, {
  useState,
} from 'react';
import {
  useRequest,
} from 'ahooks';

import {
  DataTableLayout,
} from '@/components/data-table';
import Filter, {
  type FilterData,
} from './filter';
import AccountsTable from './table';
import Pagination from '@/components/pagination';

import {
  account,
} from '@packages/lib/sdk/admin';

const defaultFilters = {
  search: '',
  role: '*',
};

function parseFilters(filterData: FilterData) {
  const parsedData = {
    ...filterData,
    role: filterData.role === '*'
      ? ''
      : filterData.role,
  };

  return parsedData;
}

const size = 20;

export default function PageAccount() {
  const [
    page,
    setPage,
  ] = useState(1);
  const [
    filters,
    setFilters,
  ] = useState<FilterData>(parseFilters(defaultFilters));

  const {
    data,
    loading,
    refresh,
  } = useRequest(() => account.getAccounts({
    page,
    size,
    ...filters,
  }), {
    refreshDeps: [
      page,
      filters,
    ],
  });

  return (
    <DataTableLayout
        header={ (
          <Filter
              filters={ defaultFilters }
              onRun={ (filterData: FilterData) =>
                  setFilters(parseFilters(filterData)) } />
        ) }
        body={
          <AccountsTable
              loading={ loading }
              data={ data }
              refresh={ refresh } />
        }
        footer={ (
          <Pagination
              page={ page }
              size={ size }
              total={ data?.count }
              onPageChange={ (p: number) => setPage(p) } />
        ) } />
  );
}
