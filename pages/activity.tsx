/* eslint-disable react/no-danger */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useRef } from 'react';
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
import router from 'next/router';
import ActivityItem from '../components/global/ActivityItem'

interface AboutProps {
  data: Types.Article[];
  app?: Types.AppProps;
}

function Activity(props): React.ReactElement {
  const { data, app, actions } = props;
  const { lang } = app;
  const lastItemRef = useRef<any>();

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);
  const routeHandler = (id) => {
    //@ts-ignore
    window.location.href = `/product/${id}`
  }
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
        <div style={{display: 'flex', justifyContent: 'center', flex: '1 1 auto', flexDirection: 'column', alignItems: 'center'}}>
            {actions.map((item, index, array) => {
                return (
                  <div className='action_item' key={`fuck-you-${index}`}>
                  <Link href={`/product/${item._id}`}><div className='img_crop' style={{marginRight: '20px'}}>
                  
                      <img className='picture_square' src={item.nft ? item.nft.img: null} alt="" />
                  </div>
                  </Link>
                  
                  <div>
                      <p>{item.action}</p>
                      
                  </div>
                  <div className="crop_text" style={{width: '140px', marginLeft: '20px'}}>                            <div>
                          <span>{moment(item.creationDate).fromNow()}</span>
                      </div>
                      <hr/>
                      
                      <div className='sad_pepe button' style={{marginTop: '20px'}}>
                         
                              <button onClick={() => routeHandler(item._id)} className='fill'><span>View item</span></button>
                                             
                       
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
    const response = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/actions')
    return {actions: response.data}
  }
  

export default Activity;
