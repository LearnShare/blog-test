'use client';

import React, {
  useState,
  useContext,
  useEffect,
} from 'react';
import {
  Bookmark as IconBookmark,
  BookmarkCheck as IconBookmarkCheck,
} from 'lucide-react';
import {
  useRequest,
} from 'ahooks';

import {
  Button,
} from '@/components/ui/button';

import AccountContext from '@/components/provider/account-context';
import {
  bookmark,
} from '@packages/lib/sdk/web';

interface BookmarkProps {
  id?: number;
  bookmarks: number;
  bookmarked?: boolean;
}

function Bookmark({
  id,
  bookmarks,
  bookmarked,
}: BookmarkProps) {
  const {
    info,
  } = useContext(AccountContext);

  const [
    value,
    setValue,
  ] = useState(bookmarks);
  useEffect(() => {
    setValue(bookmarks);
  }, [
    bookmarks,
  ]);

  const [
    active,
    setActive,
  ] = useState(!!bookmarked);
  useEffect(() => {
    setActive(bookmarked);
  }, [
    bookmarked,
  ]);

  const {
    run,
    loading,
  } = useRequest(() => active
      ? bookmark.remove(id)
      : bookmark.save(id),
    {
      manual: true,
      onSuccess() {
        setValue((oldValue) => active
          ? oldValue >= 1
              ? oldValue - 1
              : 0
          : oldValue + 1
        );
        setActive((oldValue) => !oldValue);
      },
    },
  );

  const content = (
    <>
      {
        !active && (
          <IconBookmark size={ 20 } />
        )
      }
      {
        active && (
          <IconBookmarkCheck size={ 20 } />
        )
      }
      <span className="text-sm">{ value || 0 }</span>
    </>
  );

  if (!id
      || !info) {
    return (
      <div className="min-w-[44px] h-[44px] flex flex-col items-center justify-center text-gray-400">
        { content }
      </div>
    );
  }

  return (
    <Button
        className="
          p-0! min-w-[44px] h-[44px] text-gray-400
          hover:text-red-400
          flex flex-col gap-0 items-center justify-center
          [&>svg]:w-5! [&>svg]:h-5!"
        variant="ghost"
        disabled={ loading }
        onClick={ () => run() }>
      { content }
    </Button>
  );
}

export default Bookmark;
