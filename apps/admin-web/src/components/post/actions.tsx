import {
  EllipsisVertical as IconEllipsisVertical,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ActionProps {
  disabled?: boolean;
  onAction?: (message: string) => void;
  className?: string;
}

function Actions({
  disabled,
  onAction,
  className,
}: ActionProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
              className={ className }
              disabled={ disabled }
              variant="outline">
            <IconEllipsisVertical />
            <span>拒绝</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
              onSelect={ () => onAction('内容太短') }>内容太短</DropdownMenuItem>
          <DropdownMenuItem
              onSelect={ () => onAction('内容不适合公开') }>不适合公开</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default Actions;
