import React, {useEffect} from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import type * as Types from '../../types/index.d';

/**
 * Элемент всплывающего списка владельцев
 * @param props
 * @returns
 */
function OwnerDropdownItem(props): React.ReactElement {
  const { author, imgUrl, name, _id, ind } = props;
  console.log(props)
  return (
    <div className={clsx('info__dropdown-item', ind === 0 ? 'artist' : 'owner')}>
      <div className="dropdown-item__img">
        <img style={{width: '50px', height: '50px'}} src={imgUrl || '/img/artist.png'} alt="img" />
      </div>
      <div className="dropdown-item__cover">
        <div className="dropdown-item__status">{ind === 0 ? 'Артист' : 'Владелец'}</div>
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
