/* eslint-disable @next/next/link-passhref */
import React, { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';

interface FineArtItemsProps {
  app?: Types.AppProps;
  data: Types.ItemProps;
  mark: boolean;
}

/**
 * Элемент товара в Fine Art на главной
 * @param props
 * @returns
 */
function FineArtItem(props: FineArtItemsProps): React.ReactElement {
  const { app, data } = props;
  const { mark, owners, id, title, author, likeMe, price, views, file, favoriteMe, likes } = data;
  const { lang } = app;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="fineart__item products__item round">
      <div className="products__item-label gif">GIF</div>
      <div className="products__item-info">
        <div
          role="button"
          className={clsx('item-info__icon', open && 'close')}
          onClick={() => {
            setOpen(!open);
          }}>
          <i className="flaticon-information" />
          <i className="flaticon-letter-x cross" />
        </div>

        <div className={clsx('item-info__dropdown', open && 'active')}>
          {owners.map((owner, index) => {
            return <OwnerDropdownItem key={`Owner-${id}_${index}`} {...owner} />;
          })}
        </div>
      </div>
      <div className="products__item-img">
        <div className="item-img__cover">
          <Link href={`/product/${id}`}>
            <img style={{ cursor: 'pointer' }} src={file} alt="img" />
          </Link>
        </div>
        {mark && (
          <div className="products__item-mark">
            <img src="/img/mark.png" alt="mark" />
          </div>
        )}
      </div>
      <div className="products__item-title">{title}</div>
      <div className="products__item-name">{author}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite favoriteMe={favoriteMe} app={app} />
        <Likes likeMe={likeMe} likes={likes} app={app} />
        <div className="item-stats__count">1/1</div>
      </div>
      <div className="products__item-price">$ {price}</div>
      <div className="products__item-buy">
        <Link href={`/product/${id}`}>{lang.buy}</Link>
      </div>
    </div>
  );
}

export default FineArtItem;
