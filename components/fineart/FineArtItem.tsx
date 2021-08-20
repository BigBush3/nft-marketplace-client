/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';

interface FineArtItemProps {
  item: Types.ItemProps;
  app: Types.AppProps;
}

/**
 * Элемент Fine Art
 * @param props
 * @returns
 */
export default function FineArtItem(props: FineArtItemProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const { item, app } = props;
  const { lang } = app;
  const { owners, author, title, views, likes, likeMe, favoriteMe, price, mark, id } = item;
  return (
    <div className="fineart__item products__item">
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
        {/** Всплывающий список владельцев */}
        <div className={clsx('item-info__dropdown', open && 'active')}>
          {owners.map((owner, index) => {
            return <OwnerDropdownItem key={`Owner-${title}_${index}`} {...owner} />;
          })}
        </div>
      </div>
      <a href={`/product/${id}`} className="products__item-img">
        <div className="item-img__cover">
          <img src="/img/artist_item.png" alt="img" />
        </div>
        {mark && (
          <div className="products__item-mark">
            <img src="/img/mark.png" alt="mark" />
          </div>
        )}
      </a>
      <div className="products__item-title">{author}</div>
      <div className="products__item-name">{title}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite favoriteMe={favoriteMe} app={app} />
        <Likes likeMe={likeMe} likes={likes} app={app} />
        <div className="item-stats__count">1/1</div>
      </div>
      <div className="products__item-price">$ {price}</div>
      <div className="products__item-buy button">
        <a href="#" className="rate btn_blank">
          <span>{lang.placeBid}</span>
        </a>
        <a href="#" className="buy fill btn_fill">
          <span>{lang.buy}</span>
        </a>
      </div>
    </div>
  );
}