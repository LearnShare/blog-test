import React from 'react';
import Link from 'next/link';
import {
  MessageSquareText as IconMessageSquareText,
} from 'lucide-react';

import AuthorCard from '@/components/author';
import Divider from '@/components/divider';

interface AuthorData {
  uid: string;
  name: string;
  avatarUrl: string;
  intro: string;
};

function Author(data: AuthorData) {
  return (
    <Link
        className="group border rounded-lg border-gray-200 p-4 flex flex-col flex-wrap gap-2 w-[calc((100%-48px)/3)]"
        href={ `/about/${data.uid}` }>
      <div className="flex items-center justify-between">
        <AuthorCard
            link={ false }
            uid={ data.uid }
            name={ data.name }
            avatarUrl={ data.avatarUrl } />
      </div>
      {
        data.intro && (
          <>
            <Divider>
              <IconMessageSquareText size={ 20 } />
            </Divider>
            <p className="text-sm text-gray-600">{ data.intro }</p>
          </>
        )
      }
    </Link>
  );
}

export default Author;
