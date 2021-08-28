import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios'
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
export default function Likes(props): React.ReactElement {
  const { app, likeMe, likes, product } = props;
  const [like, setLike] = useState<boolean>(false);
  const [newLikes, setNewLikes] = useState<number>(likes);
  return (
    <div
      className={clsx('item-stats__likes', (like || likeMe) && 'active')}
      role="button"
      onClick={async () => {
        await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/likes', {status: !like, product: product})
        setLike(!like);
        setNewLikes(like ? newLikes - 1 : newLikes + 1);
      }}>
      <i className="flaticon-heart" /> <span>{newLikes}</span>
    </div>
  );
}
