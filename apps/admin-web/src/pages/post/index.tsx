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
import PostsTable from './table';
import Pagination from '@/components/pagination';

import {
  Account,
  Post,
} from '@/types';

import {
  post,
} from '@packages/lib/sdk/admin';

const defaultFilters = {
  search: '',
  author: '',
  published: '*',
};

function parseFilters(filterData: FilterData) {
  const parsedData = {
    ...filterData,
    published: filterData.published === '*'
      ? ''
      : filterData.published,
  };

  return parsedData;
}

const size = 20;

interface DataType {
  count: number;
  list: Post[];
}

interface ResType
    extends DataType {
  accounts: Record<number, Account>;
}

export default function PagePost() {
  const [
    page,
    setPage,
  ] = useState(1);
  const [
    filters,
    setFilters,
  ] = useState<FilterData>(parseFilters(defaultFilters));

  const [
    data,
    setData,
  ] = useState<DataType>(null);

  const {
    loading,
    refresh,
  } = useRequest(() => post.getPosts({
    page,
    size,
    ...filters,
  }), {
    refreshDeps: [
      page,
      filters,
    ],
    onSuccess: (res: ResType) => {
      const {
        accounts,
        list,
        count,
      } = res;

      const posts = list.map((post) => ({
        ...post,
        author: accounts[post.authorId],
      }));

      setData({
        count,
        list: posts,
      });
    },
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
          <PostsTable
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
