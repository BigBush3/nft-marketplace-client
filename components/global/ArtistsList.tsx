/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import ArtistItem from './ArtistItem';
import { getItems } from '../../utils/data';

interface ArtistListProps {
  app?: Types.AppProps;
  user?: any;
  location?: any;
}

/**
 * Список артистов
 * @returns
 */
export default function ArtistsList(props: ArtistListProps): React.ReactElement {
  const { app, user, location } = props;
  const { lang } = app;
  const [artistList, setArtistList] = useState([]);
  const size = useWindowSize()
  useEffect(() => {
    (async () => {
      if (artistList.length === 0) {
        const result = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/artists')
        if (user){
          setArtistList(result.data.filter((item) => item._id === user))
        } else if (location === 'fineart'){

          
          setArtistList(result.data.filter((item) => item.collections.filter((collection) => collection.location === 'fineart').length > 0 ? true : false))
        }
        else if(location === 'marketplace'){
          setArtistList(result.data.filter((item) => item.collections.filter((collection) => collection.location === 'marketplace').length > 0 ? true : false))

        } 
        else
         {
          setArtistList(result.data.filter((item) => item.collections.length > 0));
        }
        
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
          console.log(artist)
          return <ArtistItem key={`ArtistParent-${key}`} {...artist} location={location} />;
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
