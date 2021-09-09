import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import MarketplaceItem from './MarketplaceItem';


const { SLIDER_PRODUCTS_PART } = utils.c;

interface MarketplaceItemProps {
  app?: Types.AppProps;
}

let _load = true;
let _count = 0;

/**
 * Список элементов маркетплейса
 * @param props
 * @returns
 */
export default function MarketplaceItems(props): React.ReactElement {
  const { app, search, searchBy, filterBy} = props;
  const lastItemRef = useRef<any>();
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  async function getMarketPlacePart(): Promise<void> {
    const result = await axios.get('https://desolate-inlet-76011.herokuapp.com/nft'); 
    const auction = result.data
    const oldState = marketplaceItems;
    const newState = oldState.concat(result.data);
    setMarketplaceItems(result.data);
    _load = true;
  }
  useEffect(() => {
    (async () => { 
      const result = await axios.get('https://desolate-inlet-76011.herokuapp.com/nft'); 
      setMarketplaceItems(result.data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())))
    })()
   
  }, [search, searchBy])
  async function windowScrollHandler(): Promise<void> {
    const rects = lastItemRef.current.getBoundingClientRect();
    const { y } = rects;
    if (y < 0 && _load && _count < 4) {
      _load = false;
      _count++;
      await getMarketPlacePart();
    }
  }
  useEffect(() => {
    (async () => {
      await getMarketPlacePart();
    })();
  }, []);
  return (
    <div className="marketplace__items">
      {marketplaceItems.filter((item) => item.location === 'marketplace').map((item, index, array) => {
        const lastRef = !array[index + 1] ? lastItemRef : undefined;
        return (
          <MarketplaceItem
            ref={lastRef}
            app={app}
            key={`MarketplaceItem-${item.id}-${Math.random()}`}
            data={item}
          />
        );
      })}
    </div>
  );
}