import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import PopularItem from './PopularItem';
import axios from 'axios'
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import moment from 'moment'
import { InsertCommentTwoTone } from '@material-ui/icons';

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
export default function PopularItems(props): React.ReactElement {
  const { app, filterBy, userData } = props;
  const sliderRef = useRef<any>();
  const [popularItems, setPopularItems] = useState([]);
  const settings = utils.$.sliderSettings;
  const allPopularItems = useRef([])
  const [state, setState] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current){
        sliderRef?.current.slickGoTo(0);
      }
    }, 1000);
  }, [popularItems])
  useEffect(() => {
    setTimeout(() => {
      if (sliderRef.current){
        sliderRef?.current.slickGoTo(0);
      }
    }, 1000);
    (async () => {
        let popular = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft')
        popular = popular.data.filter((item) => item.location !== 'collection' || item.status !== 'soldOut')
        // @ts-ignore
        // @ts-ignore
        const sortedPopular = popular.sort(function (a, b) {
          return b.likes - a.likes || b.views - a.views;
      });
      const _popularItems = sortedPopular.slice(0, 10);
      allPopularItems.current = _popularItems.map((item) => {
        console.log(new Date(item.endDate).getTime() < new Date().getTime())
      })
        setPopularItems(_popularItems)
    })();
  }, []);
    //@ts-ignore
    useEffect(() => {
      if (Number(filterBy) === 1){
        setPopularItems(allPopularItems.current.filter((a) => {
            return moment(a.creationDate).isAfter(moment().subtract(1, 'day'))
            
          
        }))
      } else if (Number(filterBy) === 2){
        setPopularItems(allPopularItems.current.filter((a) => {
          return moment(a.creationDate).isAfter(moment().subtract(1, 'week'))

        }))
      }else if (Number(filterBy) === 3){
        setPopularItems(allPopularItems.current.filter((a) => {
          return moment(a.creationDate).isAfter(moment().subtract(1, 'month'))

        }))
      }
      setState(!state)
    }, [filterBy])
    useEffect(() => {
      console.log('hi')
    }, [state])
  return (
    <Slider ref={sliderRef} {...settings} className="popular__items slider__products">
      {popularItems.filter((item) => item.startDate ? new Date(item.startDate).getTime() > new Date().getTime() || new Date(item.endDate).getTime() < new Date().getTime() : true).filter((item) => item.type !== 'timedAuction').map((item) => {
        return (
          <PopularItem userData={userData} key={`PopularItem-${item.id}`} mark={item.mark} data={item} app={app} />
        );
      })}
    </Slider>
  );
}