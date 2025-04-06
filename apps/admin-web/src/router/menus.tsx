import React from 'react';
import {
  LayoutDashboard as IconLayoutDashboard,
  Users as IconUsers,
  BookOpen as IconBookOpen,
  UserCheck as IconUserCheck,
  BookOpenCheck as IconBookOpenCheck,
  Handshake as IconHandshake,
} from 'lucide-react';

export interface MenuItem {
  name: string;
  icon?: React.ReactElement;
  label: string;
  path: string;
}

export interface MenuGroup {
  name: string;
  icon?: React.ReactElement;
  label?: string;
  menus: MenuItem[];
}

const menus: MenuGroup[] = [
  {
    name: 'default',
    label: '浏览',
    menus: [
      {
        name: 'home',
        icon: <IconLayoutDashboard />,
        label: '首页',
        path: '/',
      },
      {
        name: 'account',
        icon: <IconUsers />,
        label: '用户管理',
        path: '/account',
      },
      {
        name: 'post',
        icon: <IconBookOpen />,
        label: '文章浏览',
        path: '/post',
      },
    ],
  },
  {
    name: 'ticket',
    label: '工单',
    menus: [
      // {
      //   name: 'ticket-profile',
      //   icon: <IconUserCheck />,
      //   label: '用户审核',
      //   path: '/ticket/profile',
      // },
      {
        name: 'ticket-post',
        icon: <IconBookOpenCheck />,
        label: '文章审核',
        path: '/ticket/post',
      },
      // {
      //   name: 'ticket-author',
      //   icon: <IconHandshake />,
      //   label: '作者申请',
      //   path: '/ticket/author',
      // },
    ],
  },
];

export default menus;
