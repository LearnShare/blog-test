import React from 'react';

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
import AuthorCard from '@/components/author';

import Time from '@packages/lib/time';
import {
  roles,
} from './data';

interface Account {
  id: number;
  name: string;
  uid: string;
  email: string;
  verified: boolean;
  intro: string;
  avatarUrl: string;
  role: string;
  disabled: boolean;
  postsCount: number;
  ctime: string;
  utime: string;
}

interface TableProps {
  loading: boolean;
  data?: {
    count: number;
    list: Account[];
  };
}

export default function AccountsTable({
  loading,
  data,
}: TableProps) {
  return (
    <div>
      <Loading loading={ loading } />
        {
          !loading && data?.count > 0 && (
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
                        <AuthorCard
                            uid={ account.uid }
                            name={ account.name }
                            avatarUrl={ account.avatarUrl } />
                      </TableCell>
                      <TableCell>{ account.disabled ? '已禁用' : '-' }</TableCell>
                      <TableCell>{ roles[account.role] }</TableCell>
                      <TableCell>{ account.email }</TableCell>
                      <TableCell>{ account.verified ? '已验证' : '-' }</TableCell>
                      <TableCell>{ account.postsCount || '-' }</TableCell>
                      <TableCell>{ Time.format(account.ctime) }</TableCell>
                      <TableCell>{ Time.format(account.utime) }</TableCell>
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
        !loading && !data?.count && (
          <Empty />
        )
      }
    </div>
  );
}
