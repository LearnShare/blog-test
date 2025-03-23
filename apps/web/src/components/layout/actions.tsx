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
} from 'lucide-react';
import Cookies from 'js-cookie';

import {
  buttonVariants,
} from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';

import AccountContext from '@/components/provider/account-context';
import Avatar from '@/components/avatar';
import Store from '@/lib/store';
import {
  AuthorRoles,
} from '@/lib/config';

function HeaderActions() {
  const router = useRouter();

  const {
    info,
    setInfo,
  } = useContext(AccountContext);

  const logout = () => {
    Store.setToken('');
    setInfo(null);

    Cookies.remove('BLOG_TOKEN');

    router.push('/');
  };

  const author = info
      && AuthorRoles.includes(info.role);

  return (
    <div className="flex gap-2 items-center">
      {
        !info && (
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
        info && (
          <Popover>
            <PopoverTrigger>
              <Avatar
                  name={ info.name }
                  round />
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="px-1 py-1.5 w-[160px]">
              <div className="px-3 py-2">
                <div>{ info.name }</div>
                <div className="text-sm text-slate-500">@{ info.uid }</div>
              </div>
              <Command>
                <CommandList>
                  {
                    (author) && (
                      <CommandItem
                          onSelect={ () => router.push('/write') }>
                        <IconPencilLine />
                        <span>编写文章</span>
                      </CommandItem>
                    )
                  }
                  {
                    (!author) && (
                      <CommandItem>
                        <IconHandshake />
                        <span>成为作者</span>
                      </CommandItem>
                    )
                  }
                  <CommandSeparator className="my-1.5" />
                  <CommandItem
                      onSelect={ () => router.push('/home') }>
                    <IconHouse />
                    <span>个人主页</span>
                  </CommandItem>
                  {
                    (author) && (
                      <CommandItem
                          onSelect={ () => router.push('/posts') }>
                        <IconUserPen />
                        <span>我的文章</span>
                      </CommandItem>
                    )
                  }
                  <CommandSeparator className="my-1.5" />
                  <CommandItem
                      onSelect={ () => logout() }>
                    <IconLogOut />
                    <span>退出登录</span>
                  </CommandItem>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )
      }
    </div>
  );
}

export default HeaderActions;
