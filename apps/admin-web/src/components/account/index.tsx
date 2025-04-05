import React, {
  useState,
} from 'react';

import Avatar from '@/components/avatar';
import AccountDialog from './dialog';

import {
  cn,
} from '@/lib/utils';
import type {
  Account,
} from '@/types';

interface AccountCardProps {
  data: Account;
  className?: string;
}

function AccountCard({
  data,
  className,
}: AccountCardProps) {
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  return (
    <>
      <div
          className={ cn(
            'group flex gap-3 items-center cursor-pointer',
            className,
          ) }
          onClick={ (e) => {
            console.log(e);
            setDialogOpen(true);
          } }>
        <Avatar
            url={ data.avatarUrl }
            name={ data.name }
            round />
        <div className="flex-1 flex flex-col truncate">
          <div className="text-slate-700">{ data.name }</div>
          <div className="text-sm text-slate-500 group-hover:underline">@{ data.uid }</div>
        </div>
      </div>

      <AccountDialog
          open={ dialogOpen }
          data={ data }
          onClose={ () => setDialogOpen(false) } />
    </>
  );
}

export default AccountCard;
