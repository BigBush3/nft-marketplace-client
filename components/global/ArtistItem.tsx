/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';

/**
 * Элемент списка артистов
 * @returns
 */
export default function ArtistItem(props): React.ReactElement {
  const { name, collections, location } = props;
  const lR = useRef<any>();
  const [active, setActive] = useState<boolean>(false);
  return (
    <li
      className={clsx('artist__item', active && 'active')}
      onClick={(e: any) => {
        if (e.target.getAttribute('class').match(/artist__item/)) {
          setActive(!active);
          // Jquery для переноса анимации открытия
          $(lR.current).slideToggle(250);
        }
      }}>
      <h4 className="artist__item-title">{name}</h4>
      <ul className="artist__sublist" ref={lR}>
        {collections.map((child, key) => {
                                  return (
            <li key={`ArtistChild-${key}`} className="artist__subitem">
              <Link href={`/collection/${child._id}`}>
                <a
                  onClick={() => {
                    // Закрытие мобильного меню артистов
                    $('.artist').removeClass('active');
                    $('.artist__list').removeClass('active');
                  }}
                  href="?"
                  className="artist__subitem-link">
                  {child.title}
                </a>
              </Link>
            </li>
          );


        })}
      </ul>
    </li>
  );
}
