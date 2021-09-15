import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import PopularItem from './PopularItem';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';

const { SLIDER_PRODUCTS_PART } = utils.c;

interface PopularItemsProps {
  app?: Types.AppProps;
}

/**
 * Слайдер популярных на главной
 * @param props
 * @returns
 */
export default function PopularItems(props: PopularItemsProps): React.ReactElement {
  const { app } = props;
  const sliderRef = useRef<any>();
  const [popularItems, setPopularItems] = useState<Types.ItemProps[]>([]);
  const settings = utils.$.sliderSettings;
  useEffect(() => {
    setTimeout(() => {
      sliderRef?.current.slickGoTo(0);
    }, 1000);
    (async () => {
      if (popularItems.length === 0) {
        let popular = await axios.get('https://desolate-inlet-76011.herokuapp.com/nft')
        popular = popular.data.filter((item) => item.location !== 'collection')
        // @ts-ignore
        // @ts-ignore
        const sortedPopular = popular.sort(function (a, b) {
          return b.currentBid - a.currentBid || a.likes - b.likes;
      });
      const _popularItems = sortedPopular.slice(0, 10);
        setPopularItems(_popularItems);
      }
    })();
  }, [popularItems]);
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