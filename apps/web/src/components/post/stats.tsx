import React from 'react';
import {
  Eye as IconEye,
  // Star as IconStar,
  // Heart as IconHeart,
} from 'lucide-react';

interface PostStatsProps {
  views: number;
  stars: number;
  likes: number;
}

function PostStats({
  views,
  // stars,
  // likes,
}: PostStatsProps) {
  return (
    <div className="flex gap-2">
      <div className="w-[40px] flex flex-col items-center text-gray-400">
        <IconEye size={ 20 } />
        <span className="text-sm">{ views || 0 }</span>
      </div>
      {/* <div className="w-[40px] flex flex-col items-center text-gray-400">
        <IconStar size={ 20 } />
        <span className="text-sm">{ stars || 0 }</span>
      </div>
      <div className="w-[40px] flex flex-col items-center text-gray-400">
        <IconHeart size={ 20 } />
        <span className="text-sm">{ likes || 0 }</span>
      </div> */}
    </div>
  );
}

export default PostStats;
