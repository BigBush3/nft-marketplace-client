import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import type * as Types from '../../types';
import * as utils from '../../utils';
import MarketplaceItem from './CollectionItem';
import router from 'next/router';


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
export default function CollectionItems(props): React.ReactElement {
  const { app, search, searchBy, filterBy, priceRange} = props;
  const lastItemRef = useRef<any>();
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [allMarketplaceItems, setAllMarketplaceItems] = useState([])
  async function getMarketPlacePart(): Promise<void> {
    const result = await axios.get('https://desolate-inlet-76011.herokuapp.com/nft'); 
    console.log(result)
    let auction = result.data
    auction = auction.filter((item) => item.location === 'marketplace')
    setAllMarketplaceItems(auction)
    setMarketplaceItems(auction);
    _load = true;
  }
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
      {marketplaceItems.filter((item) => item.location === 'collection').map((item, index, array) => {
        const lastRef = !array[index + 1] ? lastItemRef : undefined;
        console.log('I am inside')
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