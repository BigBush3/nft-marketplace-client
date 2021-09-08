/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import Router from 'next/router';
import Slider from 'react-slick';
import axios from 'axios';
import type * as Types from '../../types/index.d';
import * as utils from '../../utils';
import FineArtItem from './FineArtItem';

const { SLIDER_PRODUCTS_PART } = utils.c;

interface FineArtItemsProps {
  app?: Types.AppProps;
}

let firstLoad = true;

/**
 * Элементы предпросмотра коллекции в FineArt
 * @param props
 * @returns
 */
export default function FineArtItems(props: FineArtItemsProps): React.ReactElement {
  const { app } = props;
  const { lang } = app;
  const mainRef = useRef<any>();
  const [fineArtItems, setFineArtItems] = useState<Types.ItemProps[]>([]);
  const [collectionState, setCollectionState] = useState<Types.ItemProps[]>([]);
  const settings = utils.$.fineArtSliderSettings;
  // Обработчик события обновления хеша страницы
  const getDataPart = (_fineArtItems) => {
    return async () => {
      const hash = Router.asPath.match(/#.+/);
      let collection: RegExpMatchArray | string = hash ? hash[0].match(/c=\d+/) : null;
      collection = collection ? collection[0].replace('c=', '') : null;
      let _collection;
      const collInt = parseInt(collection, 10);
      if (collection && !isNaN(collInt)) {
        _collection = _fineArtItems[collInt]?.isCollection
          ? _fineArtItems[collInt].items
          : [_fineArtItems[collInt]];
      } else {
        _collection = _fineArtItems[0]?.isCollection ? _fineArtItems[0].items : [_fineArtItems[0]];
      }
      setCollectionState(_collection);
    }
  };
  useEffect(() => {
    (async () => {
      if (fineArtItems.length === 0) {
        let resFineart = await axios.get('https://desolate-inlet-76011.herokuapp.com/nft')
        const fineartItems = resFineart.data.filter((item) => item.location === 'FineArt')
        setFineArtItems(fineartItems);
        getDataPart(fineartItems)();
      }
    })();
    if (!firstLoad) {
      $(document).ready(() => {
        const rects = mainRef?.current?.getBoundingClientRect();
        window.scrollTo({ top: window.pageYOffset + rects.y, behavior: 'smooth' });
      });
    }
    firstLoad = false;
    // Просмотр товара в отдельной карточке
    // прослушивает изменения хеша страницы
    Router.events.on('hashChangeComplete', getDataPart(fineArtItems));
    return () => {
      // Очищает прослушиватель при размонтировании компонента
      Router.events.off('hashChangeComplete', getDataPart(fineArtItems));
    };
  }, [fineArtItems]);
  return (
    <main ref={mainRef} className="main fineart">
      <div className="fineart__overview">
        {/** элемент работы/коллекции */}
        <Slider {...settings} className="fineart__overview-items overview__slider active">
          {/** элемент работы */}
          {collectionState.map((item, key) => {
            return <FineArtItem item={item} key={`ItemOfCollection-${key}`} app={app} />;
          })}
        </Slider>
      </div>

      <div className="fineart__overview-pagination pagination">
        <div className="pagination__prev">
          <a href="#">
            <i className="flaticon-left-arrow" />
          </a>
        </div>
        <div className="pagination__items">
          <div className="pagination__item active">
            <a href="#">1</a>
          </div>
          <div className="pagination__item">
            <a href="#">2</a>
          </div>
          <div className="pagination__item">
            <a href="#">3</a>
          </div>
          <div className="pagination__item">
            <a href="#">4</a>
          </div>
          <div className="pagination__item">
            <a href="#">5</a>
          </div>
          <div className="pagination__item">...</div>
          <div className="pagination__item">
            <a href="#">20</a>
          </div>
        </div>
        <div className="pagination__next">
          <a href="#">
            <i className="flaticon-left-arrow" />
          </a>
        </div>
      </div>
    </main>
  );
}