import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import MarketplaceItem from './MarketplaceItem';
import SoldOutItem from './SoldOut'
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
export default function MarketplaceItems(props): React.ReactElement {
  const { app, search, searchBy, filterBy, priceRange, userData} = props;
  const lastItemRef = useRef<any>();
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const allMarketplaceItems = useRef([])
  const [state, setState] = useState(false);
/*   async function getMarketPlacePart(): Promise<void> {
    const result = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft'); 
    let auction = result.data
    auction = auction.filter((item) => item.location === 'marketplace' || item.status === 'soldOut')
    allMarketplaceItems.current = auction
    setMarketplaceItems(auction);
    _load = true;
  } */
  useEffect(() => {
    if (searchBy === 'collection'){
      setMarketplaceItems(allMarketplaceItems.current.filter((item) => item.collect.toLowerCase().includes(search.toLowerCase())))
    } else if (searchBy === 'author'){
      setMarketplaceItems(allMarketplaceItems.current.filter((item) => item.owner.name.toLowerCase().includes(search.toLowerCase())))
    } else {
      setMarketplaceItems(allMarketplaceItems.current.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())))
    }
  }, [search, searchBy])
  useEffect(() => {
    if (router.asPath === '/marketplace'){
              if (priceRange[0] === 0 && priceRange[1] === 0){
      setMarketplaceItems(allMarketplaceItems.current)
    } else {
      setMarketplaceItems(allMarketplaceItems.current.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]))
    }
    }
 
 
    
  }, [priceRange])
  useEffect(() => {
    if (Number(filterBy) === 4){
      setMarketplaceItems(allMarketplaceItems.current.sort((a, b) => {
        return b.likes - a.likes || b.views - a.views;
      }))
    }
    setState(!state)
  }, [])
  //@ts-ignore
  useEffect(() => {
    if (Number(filterBy) === 2){
      setMarketplaceItems(allMarketplaceItems.current.sort((a, b) => {
          if (b.status === 'soldOut'){
            return -1
          }
          else if (a.type === 'orderSell' && b.type === 'orderSell'){
            return Number(a.price) - Number(b.price)
          } else if (a.type === 'timedAuction' && b.type === 'orderSell'){
            return Number(a.currentBid) - Number(b.price)
          } else if (a.type === 'orderSell' && b.type === 'timedAuction'){
            return Number(a.price) - Number(b.currentBid)
          }
           else {
            return Number(a.currentBid) - Number(b.currentBid)
          }
        
      }))
    } else if (Number(filterBy) === 1){
      setMarketplaceItems(allMarketplaceItems.current.sort((a, b) => {
        if (b.status === 'soldOut'){
          return -1
        }
        else if (a.type === 'orderSell' && b.type === 'orderSell'){
          return Number(b.price) - Number(a.price)
        } else if (a.type === 'timedAuction' && b.type === 'orderSell'){
          return Number(b.currentBid) - Number(a.price)
        } else if (a.type === 'orderSell' && b.type === 'timedAuction'){
          return Number(b.price) - Number(a.currentBid)
        }else {
          return Number(b.currentBid) - Number(a.currentBid)
        }
      }))
    }else if (Number(filterBy) === 3){
      setMarketplaceItems(allMarketplaceItems.current.sort((a, b) => {
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
    }else if (Number(filterBy) === 4){
      setMarketplaceItems(allMarketplaceItems.current.sort((a, b) => {
        return b.likes - a.likes || b.views - a.views;
      }))
    }
    setState(!state)
  }, [filterBy])
  useEffect(() => {
    console.log('hi')
  }, [state])
  //@ts-ignore
  useEffect(() => {
          (async () => {
      const result = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft');
      let auction = result.data
      auction = auction.filter((item) => item.location === 'marketplace' && item.status !== 'created')

      allMarketplaceItems.current = auction
      setMarketplaceItems(auction);
    })()
  }, []);
  return (
    
    <div className="marketplace__items">
      {marketplaceItems.filter((item) => item.location === 'marketplace' || item.status === 'soldOut').map((item, index, array) => {
        const lastRef = !array[index + 1] ? lastItemRef : undefined;
        console.log('collectiong..')
        if (new Date(item.endDate).getTime() < new Date().getTime()){
          return (
            <SoldOutItem ref={lastRef} app={app} key={`MarketplaceItem-${item.id}-${Math.random()}`} data={item}/>
          )
        }
        if (item.location === 'marketplace'){
                  return (
          <MarketplaceItem
            userData={userData}
            ref={lastRef}
            app={app}
            key={`MarketplaceItem-${item.id}-${Math.random()}`}
            data={item}
          />
        );
        } else {
          return (
            <SoldOutItem ref={lastRef} app={app} key={`MarketplaceItem-${item.id}-${Math.random()}`} data={item}/>
          )
        }

      })}
    </div>
  );
}