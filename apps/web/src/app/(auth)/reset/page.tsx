import React from 'react';
import {
  Button,
} from '@/components/ui/button';
import {
  Input,
} from '@/components/ui/input';

import AuthLayout from '@/components/page/auth';

export default function PageSignIn() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-center">设置新密码</h2>
        <p className="text-sm text-gray-500 text-center">请牢记并妥善保存您的新密码</p>
        <form className="mt-8 flex flex-col gap-3">
          <div>
            <label
                htmlFor="password"
                className="block mb-1 text-sm">新密码</label>
            <Input
                name="password"
                id="password"
                type="password" />
          </div>
          <div>
            <label
                htmlFor="repeat"
                className="block mb-1 text-sm">确认新密码</label>
            <Input
                name="repeat"
                id="repeat"
                type="password" />
          </div>
          <Button
              className="mt-3"
              size="lg">更新密码</Button>
        </form>
      </div>
    </AuthLayout>
  );
}
