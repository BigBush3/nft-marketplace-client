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
export default function FineArtItems(props): React.ReactElement {
  const { app, userData} = props;
  const sliderRef = useRef<any>();
  const [fineArtItems, setFineArtItems] = useState<Types.ItemProps[]>([]);
  const settings = utils.$.sliderSettings;
  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current){
        sliderRef?.current.slickGoTo(0);
      }
      
    }, 1000);
    (async () => {
      if (fineArtItems.length === 0) {
        let resFineart = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft')
        const _fineartItems = resFineart.data.filter((item) => item.location === 'fineart')
        setFineArtItems(_fineartItems.sort((a, b) => {
          return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        }));
      }
    })();
  }, [fineArtItems]);
  return (
    <Slider ref={sliderRef} className="fineart__items slider__products" {...settings}>
      {fineArtItems.map((item) => {
        return (
          <FineArtItem userData={userData} key={`FineArtItem-${item.id}`} mark={item.mark} data={item} app={app} />
        );
      })}
    </Slider>
  );
}