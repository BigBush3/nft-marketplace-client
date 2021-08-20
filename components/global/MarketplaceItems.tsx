import React, { useEffect, useRef, useState } from 'react';
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
export default function MarketplaceItems(props: MarketplaceItemProps): React.ReactElement {
  const { app } = props;
  const lastItemRef = useRef<any>();
  const [marketplaceItems, setMarketplaceItems] = useState<Types.ItemProps[]>([]);
  async function getMarketPlacePart(): Promise<void> {
    const result = await utils.r.getMarketplace({ rounds: SLIDER_PRODUCTS_PART * 2 });
    const oldState = marketplaceItems;
    const newState = oldState.concat(result);
    setMarketplaceItems(newState);
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
    window.addEventListener('scroll', windowScrollHandler);
    return () => {
      window.removeEventListener('scroll', windowScrollHandler);
      _load = true;
      _count = 0;
    };
  }, [_load]);
  return (
    <div className="marketplace__items">
      {marketplaceItems.map((item, index, array) => {
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