/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
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
  const [artistList, setArtistList] = useState([]);
  const size = useWindowSize()
  useEffect(() => {
    (async () => {
      if (artistList.length === 0) {
        const result = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/artists')
        setArtistList(result.data);
      }
    })();
  }, []);
  return (
    <aside className="aside artist">
      {size.width > 400 ?<div className="aside__heading heading">
        <h3>
           {lang.authors}
        </h3>
      </div>:        <div className="aside__heading heading" style={{border: '1px solid lightgray', fontWeight: 'lighter', borderRadius: '4px', fontSize: '16px'}}>
        <h3 style={{fontWeight: 'lighter', color: '#00BCD4', fontSize: '16px'}}>
           {lang.authors}
        </h3>
      </div>}

      <ul className="artist__list">
        <div className="artist__list-heading heading">
          <h3>
            {lang.authors}
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
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      //@ts-ignore
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}
