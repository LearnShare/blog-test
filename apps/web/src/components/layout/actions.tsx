'use client';

import React, {
  useContext,
} from 'react';
import Link from 'next/link';
import {
  useRouter,
} from 'next/navigation';
import {
  Handshake as IconHandshake,
  UserPen as IconUserPen,
  PencilLine as IconPencilLine,
  LogOut as IconLogOut,
  House as IconHouse,
  BookMarked as IconBookMarked,
} from 'lucide-react';

import {
  buttonVariants,
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AccountContext from '@/components/provider/account-context';
import Avatar from '@/components/avatar';
import Store from '@/lib/store';
import {
  AuthorRoles,
} from '@/lib/config';

function HeaderActions() {
  const router = useRouter();

  const {
    endNotLogin,
    info,
    setInfo,
  } = useContext(AccountContext);

  const logout = () => {
    Store.setToken('');
    setInfo(null);

    router.push('/');
  };

  const author = info
      && AuthorRoles.includes(info.role);

  const itemOnSelect = (action: string) => {
    switch (action) {
      case 'apply':
        router.push('/about');
        break;
      case 'write':
        router.push('/write');
        break;
      case 'home':
        router.push('/home');
        break;
      case 'posts':
        router.push('/posts');
        break;
      case 'bookmark':
        router.push('/bookmark');
        break;
      case 'logout':
        logout();
        break;
      default:
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {
        endNotLogin && (
          <>
            <Link
                href="/sign-up"
                className={ buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                }) }>注册</Link>
            <Link
                href="/sign-in"
                className={ buttonVariants({
                  variant: 'default',
                  size: 'sm',
                }) }>登录</Link>
          </>
        )
      }
      {
        !endNotLogin && info && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                  url={ info.avatarUrl }
                  name={ info.name }
                  round />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="px-1 py-1.5">
              <div className="px-3 py-2">
                <div>{ info.name }</div>
                <div className="text-sm text-slate-500">@{ info.uid }</div>
              </div>
              {
                (author) && (
                  <DropdownMenuItem
                      onSelect={ () => itemOnSelect('write') }>
                    <IconPencilLine />
                    <span>编写文章</span>
                  </DropdownMenuItem>
                )
              }
              {
                (!author) && (
                  <DropdownMenuItem
                      onSelect={ () => itemOnSelect('apply') }>
                    <IconHandshake />
                    <span>成为作者</span>
                  </DropdownMenuItem>
                )
              }
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                  onSelect={ () => itemOnSelect('home') }>
                <IconHouse />
                <span>个人主页</span>
              </DropdownMenuItem>
              {
                (author) && (
                  <DropdownMenuItem
                      onSelect={ () => itemOnSelect('posts') }>
                    <IconUserPen />
                    <span>我的文章</span>
                  </DropdownMenuItem>
                )
              }
              <DropdownMenuItem
                  onSelect={ () => itemOnSelect('bookmark') }>
                <IconBookMarked />
                <span>我的收藏</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                  onSelect={ () => itemOnSelect('logout') }>
                <IconLogOut />
                <span>退出登录</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    </div>
  );
}

export default HeaderActions;
