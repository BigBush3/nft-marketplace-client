import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import PopularItem from './PopularItem';
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
        const _popularItems = await utils.r.getPopular({ rounds: SLIDER_PRODUCTS_PART * 2 });
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