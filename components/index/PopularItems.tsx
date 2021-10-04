import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import PopularItem from './PopularItem';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';

const { SLIDER_PRODUCTS_PART } = utils.c;

interface PopularItemsProps {
  app?: Types.AppProps;
  filterBy: any;
}

/**
 * Слайдер популярных на главной
 * @param props
 * @returns
 */
export default function PopularItems(props: PopularItemsProps): React.ReactElement {
  const { app, filterBy } = props;
  const sliderRef = useRef<any>();
  const [popularItems, setPopularItems] = useState<Types.ItemProps[]>([]);
  const settings = utils.$.sliderSettings;
  const allPopularItems = useRef([])
  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current){
        sliderRef?.current.slickGoTo(0);
      }
    }, 1000);
    (async () => {
      if (popularItems.length === 0) {
        let popular = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft')
        popular = popular.data.filter((item) => item.location !== 'collection')
        // @ts-ignore
        // @ts-ignore
        const sortedPopular = popular.sort(function (a, b) {
          return b.likes - a.likes || a.views - b.views;
      });
      const _popularItems = sortedPopular.slice(0, 10);
      allPopularItems.current = _popularItems
        setPopularItems(_popularItems);
      }
    })();
  }, [popularItems]);
  useEffect(() => {

  }, [filterBy])
  return (
    <Slider ref={sliderRef} {...settings} className="popular__items slider__products">
      {popularItems.map((item) => {
        return (
          <PopularItem key={`PopularItem-${item.id}`} mark={item.mark} data={item} app={app} />
        );
      })}
    </Slider>
  );
}