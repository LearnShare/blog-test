import React from 'react';
import {
  Outlet,
} from 'react-router';

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="p-6 w-full max-w-[360px] rounded-xl border bg-card text-card-foreground shadow">
        <Outlet />
      </div>
    </div>
  );
}
