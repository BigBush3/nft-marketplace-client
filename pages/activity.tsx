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
        <div style={{display: 'flex', justifyContent: 'center', flex: '1 1 auto'}}>
            {actions.map((item) => {
                console.log(item)
                return (
                    <div className='action_item'>
                        <div className='img_crop' style={{marginRight: '20px'}}>
                            <img style={{  width: '360px',
    height: '400px',
    borderRadius: '10px',}} src={item.nft.img} alt="" />
                        </div>
                        <div>
                            <p>{item.action}</p>
                            
                        </div>
                        <div style={{width: '140px', marginLeft: '20px'}}>                            <div>
                                <span>{moment(item.creationDate).fromNow()}</span>
                            </div>
                            <hr/>
                            <div style={{marginTop: '20px'}}>
                              <Link href={`/product/${item.nft._id}`}><a className='view_item'>view item</a>
                            </Link>  
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
