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
  useEffect(() => {
    console.log(searchBy)
    if (searchBy === 'collection'){
      setMarketplaceItems(allMarketplaceItems.filter((item) => item.collect.toLowerCase().includes(search.toLowerCase())))
    } else if (searchBy === 'author'){
      setMarketplaceItems(allMarketplaceItems.filter((item) => item.owner.name.toLowerCase().includes(search.toLowerCase())))
    } else {
      setMarketplaceItems(allMarketplaceItems.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())))
    }
      
  }, [search, searchBy])
  useEffect(() => {
    if (priceRange[0] == 0 && priceRange[1] == 0){
      setMarketplaceItems(allMarketplaceItems)
    } else {
      setMarketplaceItems(allMarketplaceItems.filter((item) => item.price > priceRange[0] && item.price < priceRange[1]))
    }
    
  }, [priceRange])
  useEffect(() => {
    console.log(filterBy)
    if (filterBy === 1){
      setMarketplaceItems(allMarketplaceItems.sort((a, b) => {
        {
          if (a.type === 'orderSell' && b.type === 'orderSell'){
            return parseInt(a.price) > parseInt(b.price) ? 1: -1
          } else if (a.type === 'timedAuction' && b.type === 'orderSell'){
            return parseInt(a.currentBid) > parseInt(b.price) ? 1: -1
          } else if (a.type === 'orderSell' && b.type === 'timedAuction'){
            return parseInt(a.price) > parseInt(b.currentBid) ? 1: -1
          } else {
            return parseInt(a.currentBid) > parseInt(b.currentBid) ? 1: -1
          }
        }
      }))
    } else if (filterBy === 2){
      console.log('hi!!!')
      setMarketplaceItems(allMarketplaceItems.sort((a, b) => {
        console.log('i am inside')
        if (a.type === 'orderSell' && b.type === 'orderSell'){
          return parseInt(a.price) < parseInt(b.price) ? 1: -1
        } else if (a.type === 'timedAuction' && b.type === 'orderSell'){
          return parseInt(a.currentBid) < parseInt(b.price) ? 1: -1
        } else if (a.type === 'orderSell' && b.type === 'timedAuction'){
          return parseInt(a.price) < parseInt(b.currentBid) ? 1: -1
        } else {
          return parseInt(a.currentBid) < parseInt(b.currentBid) ? 1: -1
        }
      }))
    }else if (filterBy === 3){
      setMarketplaceItems(allMarketplaceItems.sort((a, b) => {
        if (a.type === 'orderSell' && b.type === 'orderSell'){
          return new Date(a.creationDate).getTime() > new Date(b.creationDate).getTime() ? -1: 1
        } else if (a.type === 'timedAuction' && b.type === 'orderSell'){
          return new Date(a.startDate).getTime() > new Date(b.creationDate).getTime() ? -1: 1
        } else if (a.type === 'orderSell' && b.type === 'timedAuction'){
          return new Date(a.creationDate).getTime() > new Date(b.startDate).getTime() ? -1: 1
        } else {
          return new Date(a.startDate).getTime() > new Date(b.startDate).getTime() ? -1: 1
        }
      }))
    }else if (filterBy === 4){
      setMarketplaceItems(allMarketplaceItems.sort((a, b) => {
        console.log(a.price, b.price)
        if (a.type === 'orderSell' && b.type === 'orderSell'){
          return new Date(a.creationDate).getTime() < new Date(b.creationDate).getTime() ? -1: 1
        } else if (a.type === 'timedAuction' && b.type === 'orderSell'){
          return new Date(a.startDate).getTime() < new Date(b.creationDate).getTime() ? -1: 1
        } else if (a.type === 'orderSell' && b.type === 'timedAuction'){
          return new Date(a.creationDate).getTime() < new Date(b.startDate).getTime() ? -1: 1
        } else {
          return new Date(a.startDate).getTime() < new Date(b.startDate).getTime() ? -1: 1
        }
      }))
    }
  }, [filterBy])
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