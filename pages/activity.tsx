/* eslint-disable react/no-danger */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import Slider from 'react-slick';
import axios from 'axios'
import * as utils from '../utils';
import type * as Types from '../types/index.d';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import Link from 'next/link'
import moment from 'moment'

interface AboutProps {
  data: Types.Article[];
  app?: Types.AppProps;
}

function Activity(props): React.ReactElement {
  const { data, app, actions } = props;
  const { lang } = app;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);
  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="heading center">
          <h1>{lang.pageNames.activity}</h1>
        </div>
        <div className="description">
            <h2 style={{textAlign: 'center', marginTop: '30px'}}>This is page about activites that happens on our website</h2>
        </div>
        <div className="prescription">
            <p style={{color: 'gray', marginTop: '15px', textAlign: 'center'}}>System will update every 5 minutes</p>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            {actions.map((item) => {
                console.log(item)
                return (
                    <div className='action_item'>
                        <div className='img_crop'>
                            <img src={item.nft.img} alt="" />
                        </div>
                        <div>
                            {item.action}
                        </div>
                        <div>
                            <Link href={`/product/${item.nft._id}`}><a>view item</a>
                            </Link>
                            <div>
                                {moment(item.creationDate).fromNow()}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

Activity.getInitialProps = async ({req, res, query}) => {
    const response = await axios.get('https://desolate-inlet-76011.herokuapp.com/nft/actions')
    return {actions: response.data}
  }
  

export default Activity;
