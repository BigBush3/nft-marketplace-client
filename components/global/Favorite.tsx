import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import cookie from 'js-cookie'
import type * as Types from '../../types/index.d';
import router from 'next/router';

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
  const { data } = props;
  const [favorite, setFavorite] = useState<boolean>(null);
  const [favNfts, setFavNfts] = useState([])
  const [state, setState] = useState(false)
  useEffect(() => {
    if (cookie.get('id')){
          (async() => {
      const response = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/user/${cookie.get('id')}`)
      setFavNfts(response.data.favouriteNfts)
      console.log(userExists(data._id, response.data.favouriteNfts))
      setFavorite(userExists(data?._id, response.data.favouriteNfts))
    })()
    }

  }, [])
  const deleteFav = () => {
  if (favNfts){
        const removeIndex = favNfts.findIndex( item => item?._id === data._id );
// remove object
    favNfts.splice( removeIndex, 1 );
  }

}

  function userExists(username, arr) {
    if (arr){
      return arr.some(function(el) {
        console.log(el)
  if (el?._id){
   return el?._id === username; 
  } else {
    return false
  }
  
}); 
}

  }
  return (
    <div
      className={clsx('item-stats__favorites', (favorite) && 'active')}
      role="button"
      onClick={async () => {
        if (cookie.get('id')){
                  await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/user/favorite', {status: !favorite, id: cookie.get('id'), product: data._id})
        if (favorite){
          setFavorite(false)
        } else {
          setFavorite(true);
        }
        
        } else {
          // @ts-ignoreß
          document.querySelector('.open_connect').click();
        }

      }}>
      <i className="flaticon-star" />
    </div>
  );
}