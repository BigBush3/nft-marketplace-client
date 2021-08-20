/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import ArtistItem from './ArtistItem';

interface ArtistListProps {
  app?: Types.AppProps;
}

/**
 * Список артистов
 * @returns
 */
export default function ArtistsList(props: ArtistListProps): React.ReactElement {
  const { app } = props;
  const { lang } = app;
  const [artistList, setArtistList] = useState<Types.ArtistItemData[]>([]);
  useEffect(() => {
    (async () => {
      if (artistList.length === 0) {
        const result = await utils.r.getArtistList();
        setArtistList(result);
      }
    })();
  }, []);
  return (
    <aside className="aside artist">
      <div className="aside__heading heading">
        <h3>
          <i className="flaticon-businessman" /> {lang.authors}
        </h3>
      </div>
      <ul className="artist__list">
        <div className="artist__list-heading heading">
          <h3>
            <i className="flaticon-businessman" /> {lang.authors}
          </h3>
          <div className="artist__list-close">
            <i className="flaticon-letter-x" />
          </div>
        </div>
        {artistList.map((artist, key) => {
          return <ArtistItem key={`ArtistParent-${key}`} {...artist} />;
        })}
      </ul>
    </aside>
  );
}
