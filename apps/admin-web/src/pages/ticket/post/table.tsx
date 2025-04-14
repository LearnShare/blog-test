import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import Loading from '@/components/loading';
import Empty from '@/components/empty';
import PostCard from '@/components/post';

import {
  Post,
  Ticket,
} from '@packages/database';
import {
  TicketStatusNames,
} from '@packages/types';

import Time from '@packages/lib/time';

interface TicketWithPost
    extends Ticket {
  post?: Post;
}

interface TableProps {
  loading: boolean;
  data?: {
    count: number;
    list: TicketWithPost[];
  };
  refresh?: () => void;
}

export default function TicketsTable({
  loading,
  data,
  refresh,
}: TableProps) {
  return (
    <div>
      <Loading loading={ loading } />
        {
          !loading && data && data.count > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>文章</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead
                      className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  data?.list.map((ticket: TicketWithPost) => (
                    <TableRow
                        key={ ticket.id }>
                      <TableCell>{ ticket.id }</TableCell>
                      <TableCell>
                        <PostCard
                            data={ ticket.post }
                            ticket={ ticket }
                            refresh={ refresh } />
                      </TableCell>
                      <TableCell>{ TicketStatusNames[ticket.status] }</TableCell>
                      <TableCell>{ Time.format(ticket.ctime) }</TableCell>
                      <TableCell>{ ticket.utime ? Time.format(ticket.utime) : '-' }</TableCell>
                      <TableCell
                          className="w-[60px] text-right">-</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          )
        }
      {
        !loading && (!data || !data.count) && (
          <Empty />
        )
      }
    </div>
  );
}
