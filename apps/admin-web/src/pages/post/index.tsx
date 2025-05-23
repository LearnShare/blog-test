import {
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
} from '@packages/database';

import {
  post,
} from '@packages/sdk/admin';

const defaultFilters = {
  search: '',
  author: '',
  status: '*',
};

function parseFilters(filterData: FilterData) {
  const parsedData = {
    ...filterData,
    status: filterData.status === '*'
      ? ''
      : filterData.status,
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
  ] = useState<DataType | undefined>(undefined);

  const {
    loading,
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
              data={ data } />
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
