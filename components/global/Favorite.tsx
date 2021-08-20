import React, { useState } from 'react';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';

interface FavoriteProps {
  app: Types.AppProps;
  favoriteMe: boolean;
}

/**
 * Элемент Избранное
 * @param props
 * @returns
 */
export default function Favorite(props: FavoriteProps): React.ReactElement {
  const { app, favoriteMe } = props;
  const [favorite, setFavorite] = useState<boolean>(false);
  return (
    <div
      className={clsx('item-stats__favorites', (favorite || favoriteMe) && 'active')}
      role="button"
      onClick={() => {
        setFavorite(!favorite);
      }}>
      <i className="flaticon-star" />
    </div>
  );
}