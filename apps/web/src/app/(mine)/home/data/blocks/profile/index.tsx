'use client';

import React, {
  useContext,
} from 'react';
import Link from 'next/link';

import Avatar from '@/components/avatar';
import InfoList from '@/components/info-list';
import ProfileActions from './actions';

import AccountContext from '@/components/provider/account-context';

import {
  AccountRoleNames,
} from '@packages/types';

function DataStats() {
  const {
    info,
  } = useContext(AccountContext);

  if (!info) {
    return null;
  }

  const list = [
    {
      label: '邮箱',
      value: info.email,
    },
    {
      label: '状态',
      value: info.verified
          ? '已认证'
          : '未认证',
    },
    {
      label: '身份',
      value: AccountRoleNames[info.role]
          || info.role,
    },
    {
      label: '介绍',
      value: info.intro,
    },
  ];

  return (
    <div className="flex flex-col gap-3 flex-1 border rounded-lg border-gray-200 p-4">
      <h3 className="text-sm text-slate-600 flex justify-between items-center">
        <span>个人资料</span>
        <ProfileActions />
      </h3>
      <div className="flex gap-10 justify-center items-center
          max-xs:flex-col max-xs:gap-4">
        <div className="flex flex-col gap-1 items-center">
          <Avatar
              url={ info?.avatarUrl }
              name={ info?.name }
              width={ 80 }
              height={ 80 }
              round />
          <div className="mt-4 text-center">{ info?.name }</div>
          <Link
              className="text-sm text-slate-500 text-center hover:underline"
              href={ `/author/@${ info?.uid }` }>@{ info?.uid }</Link>
        </div>
        <InfoList
            list={ list } />
      </div>
    </div>
  );
}

export default DataStats;
