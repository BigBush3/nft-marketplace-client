/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import moment from 'moment'
import router from 'next/router';

/**
 * Элемент списка артистов
 * @returns
 */
export default function ActivityItem(props): React.ReactElement {
  const { item, index } = props;
  return (
    <div className='action_item' key={index}>
                        <div className='img_crop' style={{marginRight: '20px'}}>
                            <img className='picture_square' src={item.nft ? item.nft.img: null} alt="" />
                        </div>
                        <div>
                            <p>{item.action}</p>
                            
                        </div>
                        <div className="crop_text" style={{width: '140px', marginLeft: '20px'}}>                            <div>
                                <span>{moment(item.creationDate).fromNow()}</span>
                            </div>
                            <hr/>
                            
                            <div className='sad_pepe button' style={{marginTop: '20px'}}>
                                <Link href={`/product/${item._id}`}>
                                <a className='fill'><span>View item</span></a>
                                </Link>
                              
                             
                            </div>
                            

                        </div>
                    </div>
  );
}
