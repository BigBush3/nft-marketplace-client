import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import FineArtItem from './FineArtItem';

const { SLIDER_PRODUCTS_PART } = utils.c;

interface FineArtItemsProps {
  app?: Types.AppProps;
}

/**
 * Элементы изобразительного искусства на главной
 * @param props
 * @returns
 */
export default function FineArtItems(props: FineArtItemsProps): React.ReactElement {
  const { app } = props;
  const sliderRef = useRef<any>();
  const [fineArtItems, setFineArtItems] = useState<Types.ItemProps[]>([]);
  const settings = utils.$.sliderSettings;
  useEffect(() => {
    setTimeout(() => {
      sliderRef?.current.slickGoTo(0);
    }, 1000);
    (async () => {
      if (fineArtItems.length === 0) {
        let resFineart = await axios.get('http://localhost:8000/nft')
        const _fineartItems = resFineart.data.filter((item) => item.location === 'FineArt')
        setFineArtItems(_fineartItems);
      }
    })();
  }, [fineArtItems]);
  return (
    <Slider ref={sliderRef} className="fineart__items slider__products" {...settings}>
      {fineArtItems.map((item) => {
        return (
          <FineArtItem key={`FineArtItem-${item.id}`} mark={item.mark} data={item} app={app} />
        );
      })}
    </Slider>
  );
}