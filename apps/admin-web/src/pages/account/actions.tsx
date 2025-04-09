import {
  EllipsisVertical as IconEllipsisVertical,
} from 'lucide-react';
import {
  useRequest,
} from 'ahooks';

import {
  Button,
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Account
} from '@/types';
import {
  account,
} from '@packages/lib/sdk/admin';

interface AccountActionProps {
  data: Account;
  refresh?: () => void;
  className?: string;
}

function AccountActions({
  data,
  refresh,
  className,
}: AccountActionProps) {
  const {
    run: updateAccount,
  } = useRequest((disabled: boolean) =>
      account.updateAccount(data.id, {
        disabled,
      }),
    {
      manual: true,
      onSuccess: () => {
        refresh?.();
      },
    },
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              className={ className }
              variant="ghost"
              size="icon">
            <IconEllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {
            data.disabled && (
              <DropdownMenuItem
                  onSelect={ () => updateAccount(false) }>启用</DropdownMenuItem>
            )
          }
          {
            !data.disabled && (
              <DropdownMenuItem
                  onSelect={ () => updateAccount(true) }>禁用</DropdownMenuItem>
            )
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default AccountActions;
