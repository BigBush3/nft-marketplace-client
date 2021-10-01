/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo } from 'react';
import type { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import axios from 'axios'
import Theme from '../components/Theme';
import Banner from '../components/global/Banner';
import Gallery from '../components/fineart/Gallery';
import ArtistsList from '../components/global/ArtistsList';
import FineArtItems from '../components/fineart/FineArtItems';
import Header from '../components/global/Header';

import * as utils from '../utils';
import type * as Types from '../types/index.d';


interface FineArtProps {
  app?: Types.AppProps;
  data: {
    banners: Types.Banner[];
  };
}

/**
 * Страница изобразительног искусства
 * @param props
 * @returns
 */
function FineArt(props): React.ReactElement {
  const { app, data } = props;
  const { banners } = data;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  useEffect(() => {
    utils.$.setStylesArtistList();
  }, []);
  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="heading center">
          <h1>
            <i className="flaticon-fire" /> Fine Art
          </h1>
        </div>
        <Banner {...app} banners={banners} />
        <Gallery app={app}/>
        <div className="content">
          <ArtistsList app={app}/>
          <FineArtItems app={app}/>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

FineArt.getInitialProps = async (ctx: GetServerSidePropsContext): Promise<FineArtProps> => {
  const result = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/banner')
  return {
    data: {
      banners: result.data,
    },
  };
};

export default FineArt;
