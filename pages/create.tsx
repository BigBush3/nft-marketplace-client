/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/self-closing-comp */
import React, { useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type * as Types from '../types/index.d';
import Theme from '../components/Theme';
import Header from '../components/global/Header';

interface CreateProps {
  app?: Types.AppProps;
}

/**
 * Страница выбора создания одного или нескольких nft
 * @param props
 * @returns
 */
function Create(props: CreateProps): React.ReactElement {
  const { app } = props;
  const { lang } = app;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="heading center">
          <h1>{lang.pageNames.createNFT}</h1>
        </div>

        <div className="create_blocks flex">
          <div className="create_block">
            <Link href="/create-one">
              <a className="create_block_img">
                <picture>
                  <source srcSet="/img/logo.png" type="image/webp" />
                  <img src="/images/logo_2.svg" alt="img" />
                </picture>
              </a>
            </Link>
            <div className="create_block_title heading">
              <h3>{lang.create.one}</h3>
            </div>
            <div className="create_block_i">
              <i className="flaticon-information"></i>
            </div>
            <div
              className="create_block_text"
              dangerouslySetInnerHTML={{ __html: lang.create.oneDesc }}
            />
          </div>
          <div className="create_block">
            <Link href="/create-many">
              <a className="create_block_img">
                <picture>
                  <source srcSet="/img/logo.png" type="image/webp" />
                  <img src="/images/logo_3.svg" alt="img" />
                </picture>
              </a>
            </Link>
            <div className="create_block_title heading">
              <h3>{lang.create.many}</h3>
            </div>
            <div className="create_block_i">
              <i className="flaticon-information"></i>
            </div>
            <div
              className="create_block_text"
              dangerouslySetInnerHTML={{ __html: lang.create.manyDesc }}
            />
          </div>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

export default Create;
