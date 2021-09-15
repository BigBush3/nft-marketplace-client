import React, { useState } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import cookie from 'js-cookie'
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
export default function Favorite(props): React.ReactElement {
  const { app, favoriteMe, product } = props;
  const [favorite, setFavorite] = useState<boolean>(false);

  return (
    <div
      className={clsx('item-stats__favorites', (favorite || favoriteMe) && 'active')}
      role="button"
      onClick={async () => {
        if (cookie.get('id')){
                  await axios.post('https://desolate-inlet-76011.herokuapp.com/user/favorite', {status: !favorite, id: cookie.get('id'), product: product})
        setFavorite(!favorite);
        } else {
          // @ts-ignoreß
          document.querySelector('.open_connect').click();
        }

      }}>
      <i className="flaticon-star" />
    </div>
  );
}