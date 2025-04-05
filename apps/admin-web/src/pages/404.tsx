import {
  NavLink,
} from 'react-router';

import Error from '@/components/error';
import {
  buttonVariants,
} from '@/components/ui/button';

export default function Page404() {
  return (
    <div className="py-10 flex flex-col gap-6 items-center">
      <Error message="访问的页面不存在" />
      <NavLink
          className={ buttonVariants({
            variant: 'outline',
          }) }
          to="/">返回首页</NavLink>
    </div>
  );
}
