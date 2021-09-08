/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios'
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';



const settings = utils.$.bannerSettings;

/**
 * Баннер вверху страниц
 * @param props
 * @returns
 */
export default function Banner(props): React.ReactElement {
  const { lang, banners } = props;
  return (
    <div className="bunner">
      <Slider {...settings} className="bunner__items owl-carousel">
        {banners.map((item, index) => {
          return (
            <div key={`Banner ${index}`}>
              <div className="bunner__item" style={{ backgroundImage: `url(${item.imgUrl})`, backgroundSize: '100%', minHeight: "360px", color: item.color}}>
                <div style = {{color: item.color}} className="bunner__item-title heading">
                  <h2 >{item.title}</h2>
                </div>
                <div style={{color: item.color}} className="bunner__item-text">
                  <p>{item.text}</p>
                </div>
                <div className="bunner__item-more">
                  <a href={item.url}>
                    {lang.more}
                    <i className="flaticon-right-arrow" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}