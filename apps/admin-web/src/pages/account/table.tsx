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
import AccountActions from '@/pages/account/actions';

import {
  Account
} from '@/types';
import Time from '@packages/lib/time';
import {
  roles,
} from './data';

interface TableProps {
  loading: boolean;
  refresh?: () => void;
  data?: {
    count: number;
    list: Account[];
  };
}

export default function AccountsTable({
  loading,
  refresh,
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
                  <TableHead>账号</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>是否验证</TableHead>
                  <TableHead>文章</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead
                      className="w-[60px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  data?.list.map((account: Account) => (
                    <TableRow
                        key={ account.id }>
                      <TableCell>{ account.id }</TableCell>
                      <TableCell>
                        <AccountCard
                            data={ account } />
                      </TableCell>
                      <TableCell>{ account.disabled ? '已禁用' : '-' }</TableCell>
                      <TableCell>{ roles[account.role] }</TableCell>
                      <TableCell>{ account.email }</TableCell>
                      <TableCell>{ account.verified ? '已验证' : '-' }</TableCell>
                      <TableCell>{ account.postsCount || '-' }</TableCell>
                      <TableCell>{ Time.format(account.ctime) }</TableCell>
                      <TableCell>{ Time.format(account.utime) }</TableCell>
                      <TableCell
                          className="w-[60px] text-right">
                        <AccountActions
                            data={ account }
                            refresh={ refresh } />
                      </TableCell>
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
