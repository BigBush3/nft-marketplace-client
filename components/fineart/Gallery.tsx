import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import axios from 'axios';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';

interface GalleryProps {
  app: Types.AppProps;
}

const settings = utils.$.galerySliderSettings;

/**
 * Галерея работ авторов
 * @param props
 * @returns
 */
export default function Gallery(props: GalleryProps): React.ReactElement {
  const { app } = props;
  const { lang } = app;
  const sliderRef = useRef<any>();
  const [artistList, setArtistList] = useState([]);
  useEffect(() => {
/*     setTimeout(() => {
      sliderRef?.current.slickGoTo(0);
    }, 1000); */
    (async () => {
      if (artistList.length === 0) {
        let resFineart = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft')
        const fineartItems = resFineart.data.filter((item) => item.location === 'FineArt')
        setArtistList(fineartItems);
      }
    })();
  }, []);
  return (
    <div className="gallery">
      <Slider ref={sliderRef} {...settings} className="gallery__items galery__slider">
        {artistList.map((item, key) => {
          const firstChild = {...item};
          return (
            <Link key={`GalleryItem-${key}`} href={`/product/${firstChild._id}`}>
              <a title={firstChild.title} href="?">
                <div className="gallery__item">
                  <img src={firstChild?.img} style={{width: '90px', height: '100px', borderRadius: '5px'}}alt="img" />
                </div>
                {firstChild?.mark && (
                  <div className="gallery__item-mark">
                    <img src="/img/mark.png" alt="mark" />
                  </div>
                )}
              </a>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}