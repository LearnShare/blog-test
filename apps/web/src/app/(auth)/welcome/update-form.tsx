'use client';

import React from 'react';
import {
  useRouter,
} from 'next/navigation';

import {
  Button,
} from '@/components/ui/button';
import ProfileForm from '@/components/forms/profile';

function UpdateForm() {
  const router = useRouter();

  const onSuccess = (data: any) => {
    const {
      uid,
    } = data;

    router.push(`/author/@${uid}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <ProfileForm
          action="修改并继续"
          onSuccess={ (data: any) => onSuccess(data) } />
      <Button
          className="mt-6"
          variant="outline"
          size="lg">跳过</Button>
      <div className="text-right text-xs text-slate-500">稍后可以在个人中修改</div>
    </div>
  );
}

export default UpdateForm;
