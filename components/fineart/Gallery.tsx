import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import axios from 'axios';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';

interface GalleryProps {
  app: Types.AppProps;
  onClickGallery: any;
  nfts: any;
}

const settings = utils.$.galerySliderSettings;

/**
 * Галерея работ авторов
 * @param props
 * @returns
 */
export default function Gallery(props: GalleryProps): React.ReactElement {
  const { app, onClickGallery, nfts } = props;
  const { lang } = app;
  const sliderRef = useRef<any>();
  const [artistList, setArtistList] = useState([]);
  useEffect(() => {
     setTimeout(() => {
      sliderRef?.current.slickGoTo(0);
    }, 1000);
    if (Array.isArray(nfts)){
      setArtistList(nfts)
    } else {
          (async () => {
      if (artistList.length === 0) {
        let resFineart = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft')
        const fineartItems = resFineart.data.filter((item) => item.location === 'fineart')
        setArtistList(fineartItems);
      }
    })();
    }

  }, []);
  return (
    <div className="gallery">
      <Slider ref={sliderRef} {...settings} className="gallery__items galery__slider">
        {artistList.map((item, key) => {
          const firstChild = {...item};
          return (
              <div title={firstChild.title} onClick={() => onClickGallery(key)}>
                <div className="gallery__item">
                  <img src={firstChild?.img} style={{width: '134px', height: '196px', borderRadius: '5px', objectFit: 'cover'}}alt="img" />
                </div>
              </div>
          );
        })}
      </Slider>
    </div>
  );
}