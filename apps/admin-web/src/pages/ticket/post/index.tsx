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
import TicketsTable from './table';
import Pagination from '@/components/pagination';

import {
  Ticket,
  Post,
} from '@/types';

import {
  ticket,
} from '@packages/lib/sdk/admin';

const defaultFilters = {
  status: 'pending',
};

const size = 20;

interface DataType {
  count: number;
  list: Ticket[];
}

interface ResType
    extends DataType {
  posts: Record<number, Post>;
}

export default function PageTicketPost() {
  const [
    page,
    setPage,
  ] = useState(1);
  const [
    filters,
    setFilters,
  ] = useState<FilterData>(defaultFilters);

  const [
    data,
    setData,
  ] = useState<DataType | undefined>(undefined);

  const {
    loading,
    refresh,
  } = useRequest(() => ticket.getTickets({
    page,
    size,
    type: 'post',
    ...filters,
  }), {
    refreshDeps: [
      page,
      filters,
    ],
    onSuccess: (res: ResType) => {
      const {
        posts,
        list,
        count,
      } = res;

      const tickets = list.map((ticket) => ({
        ...ticket,
        post: posts[Number(ticket.ref)],
      }));

      setData({
        count,
        list: tickets,
      });
    },
  });

  return (
    <DataTableLayout
        header={ (
          <Filter
              filters={ defaultFilters }
              onRun={ (filterData: FilterData) =>
                  setFilters(filterData) } />
        ) }
        body={
          <TicketsTable
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
