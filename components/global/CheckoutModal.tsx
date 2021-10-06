/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import cookie from 'js-cookie'
import connectMetaMask from './metamask'
import axios from 'axios'
import Modal from '@material-ui/core/Modal';
import { CircularProgress } from '@material-ui/core';

import {
	NFT_ABI, 
	NFT_ADDRESS, 

	NFTSTORE_ADDRESS, 
	NFTSTORE_ABI,
	
	TIMEDAUCTION_ABI,
	TIMEDAUCTION_ADDRESS,
	
	SIMPLEAUCTION_ABI,
	SIMPLEAUCTION_ADDRESS,

	RINKEBY_RPC_URL, 
	ULR_INFURA_WEBSOCKET, 
	EVENTS_TOPICS
} from '../../config/default.json'
import Web3 from 'web3'
import router from 'next/router';

interface CheckoutModalProps {
  app: Types.AppProps;
}

/**
 * Модальное окно Купить
 * @param props
 * @returns
 */
export default function CheckoutModal(props): React.ReactElement {
  const { app, data, open, handleClose } = props;
  const [openm ,setOpenm] = useState(open)
  const { lang } = app;
  const [proceed, setProceed] = useState(false)
  const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET));
// @ts-ignore
  const NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)
  // @ts-ignore
  let SIMPLEAUCTION = new web3.eth.Contract(SIMPLEAUCTION_ABI, SIMPLEAUCTION_ADDRESS)
  const getGasFee = async(gasLimit)=>{
    let result = 0
    await NFTSTORE.methods.getGasFee(gasLimit).call({}, (err, res)=>{
      console.log(`gasFee - ${res}`)
      result = res
    })
    return result;
  }
  const showFee = (price) => {
    return (<p>{String(Math.round((parseInt(price)/1e18*1+(954800000000000/1e18)) * 100000000) / 100000000)}</p>)
  }
  const getOrder = async (tokenId, orderIndex) => {
    let result
    await SIMPLEAUCTION.methods.orderSells(NFT_ADDRESS, tokenId, orderIndex).call({}, (err, res)=>{
      console.log(`order - ${orderIndex} of token ${tokenId}`)
      console.log(res)
      result = res
    })
    return result;
  }
  
  async function handleClick(e){
    if (!cookie.get('id')){
      // @ts-ignore
      document.querySelector('.open_connect').click();
      handleClose()
    } else {
  setProceed(true)
  let metamask = await connectMetaMask()
	let walletAddress = metamask.userAddress
	let wallet = metamask.web3
	console.log('metamask connected')
  // @ts-ignore
	let NFT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
	console.log('NFT contract connected')
	console.log(NFT)
	console.log('walletAddress: ', walletAddress)
	console.log('web3: ', web3)
    let fee = await getGasFee(136400)
    console.log(data)
	let txData = SIMPLEAUCTION.methods.buyOrder(NFT_ADDRESS, data.tokenId, data.orderIndex, 1).encodeABI()
	let order = await getOrder(data.tokenId, data.orderIndex)
  console.log(fee)
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		await wallet.eth.sendTransaction({
		        to: SIMPLEAUCTION_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(parseInt(order.price)/1e18*1+(fee/1e18) )),
		        data: txData
		    },
		    function(error, res){
		        console.log(error);
		        console.log(res);
		    }
		)
	}
  try{
      const result = await axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/buy", {ownerId: data.owner._id, buyerId: cookie.get('id'), tokenId: data._id, action: `${cookie.get('name')} bought it for ${data.price} ETH`})

  } catch(err){
    console.log(err.message)
  }
  setProceed(false)
  router.push(`/token/${data._id}`)
    }
    
  }
  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
  >
    <div className="popup__checkout popup">
       <div>
      <div className="popup__heading heading">
        <h3>Checkout</h3>
      </div>

      <div className="popup__sub">
        You are about to purchase <span>{data.title}</span> from <span>{data.owner.name}</span>
      </div>

      <div className="popup__bid-form">
        <div className="bid-form__header">
          <div className="bid-form__item">
            <input type="text" value={data.price} disabled={true} />
            <span>ETH</span>
          </div>
        </div>

        <div className="bid-form__calc">
{/*           <div className="form__calc-item">
            <div className="calc-item__title">Your balance</div>
            <div className="calc-item__value">0 ETH</div>
          </div> */}
          <div className="form__calc-item">
            <div className="calc-item__title">Service fee</div>
            <div className="calc-item__value">2.5 %</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">You will pay</div>
            <div className="calc-item__value">{data.price} ETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Gas Fee</div>
            <div className="calc-item__value">{showFee(data.price)} ETH</div>
          </div>
        </div>
        {proceed ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress/>
      </div>: <div className="popup__button button">
          <button className="fill" onClick={handleClick}>
            <span>Proceed to payment</span>
          </button>
          <a href="#" className="cancel" onClick={handleClose}>
            <span>Cancel</span>
          </a>
        </div>}
        
      </div>
        </div>

      
    </div>
    </Modal>
  );
}