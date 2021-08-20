import React, { useState } from 'react';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';

interface LikesProps {
  app: Types.AppProps;
  likeMe: boolean;
  likes: number;
}

/**
 * Элемент лайков
 * @param props
 * @returns
 */
export default function Likes(props: LikesProps): React.ReactElement {
  const { app, likeMe, likes } = props;
  const [like, setLike] = useState<boolean>(false);
  const [newLikes, setNewLikes] = useState<number>(likes);
  return (
    <div
      className={clsx('item-stats__likes', (like || likeMe) && 'active')}
      role="button"
      onClick={() => {
        setLike(!like);
        setNewLikes(like ? newLikes - 1 : newLikes + 1);
      }}>
      <i className="flaticon-heart" /> <span>{newLikes}</span>
    </div>
  );
}
