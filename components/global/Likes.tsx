import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios'
import cookie from 'js-cookie'

import type * as Types from '../../types/index.d';

interface LikesProps {
  app: Types.AppProps;
  likeMe: boolean;
  likes: number;
}

/**
 * Элемент лайков
 * @param props
 * @returns
 */
export default function Likes(props): React.ReactElement {
  const { data} = props;
  const [like, setLike] = useState<boolean>(null);
  const [newLikes, setNewLikes] = useState<number>(null);
  useEffect(() => {
    if (cookie.get('id')){
      if (data?.AccLikes){
        setLike(userExists(data?._id, data.AccLikes))
        setNewLikes(data.likes)
      }

      
    }

  }, [])
  function userExists(username, arr) {
    if (arr){
      return arr.some(function(el) {
        console.log(el)
   return el === cookie.get('id'); 
  
}); 
}

  }
  return (
    <div
      className={clsx('item-stats__likes', (like) && 'active')}
      role="button"
      onClick={async () => {
        if (cookie.get('id')){
          const result = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/likes', {status: !like, product: data._id, userId: cookie.get('id')})
        if (like){
          setLike(false)
          setNewLikes(newLikes - 1);
        } else {
          setLike(true)
          setNewLikes(newLikes + 1);
        }
       
        
        } else {
          //@ts-ignore
          document.querySelector('.open_connect').click();
        }

      }}>
      <i className="flaticon-heart" /> <span>{newLikes}</span>
    </div>
  );
}
