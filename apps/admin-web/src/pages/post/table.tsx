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
import AccountCard from '@/components/account';
import PostCard from '@/components/post';

import {
  Post,
} from '@/types';
import {
  publishedNames,
} from './data';

import Time from '@packages/lib/time';

interface TableProps {
  loading: boolean;
  data?: {
    count: number;
    list: Post[];
  };
}

export default function PostsTable({
  loading,
  data,
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
                  <TableHead>作者</TableHead>
                  <TableHead>文章</TableHead>
                  <TableHead>格式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead
                      className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  data?.list.map((post: Post) => (
                    <TableRow
                        key={ post.id }>
                      <TableCell>{ post.id }</TableCell>
                      <TableCell>
                        <AccountCard
                            data={ post.author } />
                      </TableCell>
                      <TableCell>
                        <PostCard
                            data={ post } />
                      </TableCell>
                      <TableCell>{ post.format }</TableCell>
                      <TableCell>{ publishedNames[post.published ? '1' : '0'] }</TableCell>
                      <TableCell>{ Time.format(post.ctime) }</TableCell>
                      <TableCell>{ Time.format(post.utime) }</TableCell>
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
