import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import type * as Types from '../../types/index.d';

/**
 * Элемент всплывающего списка владельцев
 * @param props
 * @returns
 */
function OwnerDropdownItem(props): React.ReactElement {
  const { author, imgUrl, name, _id } = props;
  return (
    <div className={clsx('info__dropdown-item', author ? 'artist' : 'owner')}>
      <div className="dropdown-item__img">
        <img src={imgUrl || '/img/artist.png'} alt="img" />
      </div>
      <div className="dropdown-item__cover">
        <div className="dropdown-item__status">{author ? 'Артист' : 'Владелец'}</div>
        <Link href={`/cabinet/${_id}`}>
          <a href="?" className="dropdown-item__title">
            {name}
          </a>
        </Link>
      </div>
    </div>
  );
}

export default OwnerDropdownItem;
