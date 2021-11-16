import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';

import cookie from 'js-cookie'
import { useForm }from 'react-hook-form'
import axios from 'axios'
import Web3 from 'web3'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import router from 'next/router';
import connectMetaMask from './metamask'
import { makeStyles } from '@material-ui/core/styles';
import * as utils from '../../utils';
import type * as Types from '../../types/index';
import TextField from '@material-ui/core/TextField';
import { WithContext as ReactTags } from 'react-tag-input';

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


interface CreateFormProps {
  app: Types.AppProps;
  createMany: boolean;
  item: any;
}
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));
export default function UpdateForm(props: CreateFormProps): React.ReactElement {
  const { app, createMany, item } = props;
  const { lang } = app;
  const classes = useStyles();
  const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };
  const delimiters = [...KeyCodes.enter, KeyCodes.comma];
  const [tags, setTag] = useState([])
  const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET));
  // @ts-ignore
const NFT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS) // @ts-ignore
const NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)
// @ts-ignore
const TIMEDAUCTION = new web3.eth.Contract(TIMEDAUCTION_ABI, TIMEDAUCTION_ADDRESS)// @ts-ignore
const SIMPLEAUCTION = new web3.eth.Contract(SIMPLEAUCTION_ABI, SIMPLEAUCTION_ADDRESS)
const {register, handleSubmit} = useForm()
  const auctionCheckInfoRef = useRef();
  const [open, setOpen] = React.useState(false);
  const fixPayCheckInfoRef = useRef();
  const endDateCheckInfoRef = useRef();
  const [createLoader, setCreateLoader] = useState(false)
  const [approveLoader, setApproveLoader] = useState(false)
  const [fileCopy, setFileCopy] = useState(null)
  const [file, setFile] = useState(null)
  const [pdfCopy, setPdfCopy] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [auctionChecked, setAuctionChecked] = useState<boolean>(true);
  const [endDateChecked, setEndDateChecked] = useState<boolean>(false);
  const [fixPayChecked, setFixPayChecked] = useState<boolean>(false);
  function handleDelete(i) {
    setTag(
     tags.filter((tag, index) => index !== i),
    );
}
function handleAddition(tag) {
  setTag([...tags, tag]);
}
function handleDrag(tag, currPos, newPos) {
  const newTags = tags.slice();

  newTags.splice(currPos, 1);
  newTags.splice(newPos, 0, tag);

  // re-render
  setTag(newTags);
}
  const handleClickOpen = () => {
    setOpen(true);
  };
  const gasFee = {
    createAuction: 180100,
    createOrderSell: 159000,
    returnFreeBalance: 58100,
  
    createBidAuction: 216400,
    updateBidAuction: 76700,
    finishAuction: 144800,
    cancelAuction: 59700,
  
    buyOrder :136500,
      cancelOrderSell :63100,
      createBidMarket : 219800,
      realizeBid : 140500,
      cancelBid :58500
  }
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (fixPayChecked){
      $(auctionCheckInfoRef.current).slideUp();
      $(fixPayCheckInfoRef.current).slideDown();
      setAuctionChecked(false)
    } else {
      $(fixPayCheckInfoRef.current).slideUp();
    }
  }, [fixPayChecked])
  useEffect(() => {
    if (auctionChecked){
      $(auctionCheckInfoRef.current).slideDown();
      $(fixPayCheckInfoRef.current).slideUp();
      setFixPayChecked(false)
    } else {
      $(auctionCheckInfoRef.current).slideUp();
    }
  }, [auctionChecked])
  const isOwner = async (address) => {
    NFT.methods.admins(address).call({}, (err, res)=>{
      console.log(`it's owners address ${address} - ${res}`)
    })
  }
  function handleChange(event){
    console.log('hi!!!!')
    setFileCopy(event.target.files[0])
    const img = URL.createObjectURL(event.target.files[0])
    setFile(img)
  }
  function handlePdfChange(event){
    console.log("fuck")
    console.log(event)
    setPdf(event.target.files[0])
  }

  const isApprovedForAll = (userAddress) => {
    NFT.methods.isApprovedForAll(userAddress, "0x1bD9A75e6BCF3B9488f0D994C9D84B65AdDeF348").call({}, (err, res)=>{
      return res
    })
  }
  
  const onSubmit = async (data) => {
    setOpen(true)
    
    const price = data.price * 1e18
    const subscription = (contractAddress, topic)=>{
      console.log('start subscription')
      console.log('contractAddress: ', contractAddress)
      console.log('topic: ', topic)
      return web3.eth.subscribe('logs', {
          address: contractAddress,
          topics: [topic]
      })
    } 
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    const wallet = await new Web3(window.ethereum);
    let txData
    const approved = await NFT.methods.isApprovedForAll(walletAddress, NFTSTORE_ADDRESS).call({}, (err, res)=>{
      console.log(`isApprovedForAll - ${res}`)
    })
    if (!approved){
      setApproveLoader(true)
          txData = NFT.methods.setApprovalForAll(NFTSTORE_ADDRESS, true).encodeABI()
    await wallet.eth.sendTransaction({
      to: NFT_ADDRESS,
      from: walletAddress,
      data: txData
  },
  function(error, res){
      console.log(error);
      console.log(res);
      if (res){

      } else {
        alert('Reload the page, you canceled the transactionk')
      }
      subscription(NFT_ADDRESS, EVENTS_TOPICS.APPROVE)
  }
);  setApproveLoader(false)
    }


  setCreateLoader(true)
  if (auctionChecked){
      let fee = await getGasFee(gasFee.createAuction)
      console.log("Gas Fee - ", fee)
      
      txData = await NFTSTORE.methods.createAuction(NFT_ADDRESS, item.tokenId, web3.utils.toWei(String(data.firstBid)), Math.round(new Date(data.startDate).getTime()/1000), Math.round(new Date(data.endDate).getTime()/1000)).encodeABI()
      if(!wallet){
        alert('you have to connect cryptowallet')
      } else {
        wallet.eth.sendTransaction({
                to: NFTSTORE_ADDRESS,
                from: walletAddress,
                value: web3.utils.toWei(String(fee/1e18)),
                data: txData
            },
            async function (error, res){
                console.log(error);
                console.log(res);
                if (res){
                  let subEvent = await subscription(TIMEDAUCTION_ADDRESS, EVENTS_TOPICS.Time_Auction_Created)
              
              subEvent.on('data', async event => {
                console.log(event)
                const pure = event.data.slice(2)
                const sth = event.data.slice(0, 66)
                const res = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/update', {currentBid: data.firstBid, type: "timedAuction", tokenId: item._id, orderIndex: parseInt(sth), startDate: data.startDate, endDate: data.endDate, location: 'marketplace', status: 'active', userId: cookie.get('id'), action: `${cookie.get('name')} place an order and sell it for ${data.firstBid} ETH`})
                router.push(`/cabinet/${cookie.get('id')}`)
              })
                } else {
                  alert('Error! You canceled the transaction, go back to the main page.')
                }

            }
        )		
      }
    
  } else {
  let fee = await getGasFee(gasFee.createOrderSell)
  console.log(fee, NFT_ADDRESS, data.price, item.tokenId)
  
  // @ts-ignore
	txData = NFTSTORE.methods.createOrderSell(NFT_ADDRESS, item.tokenId, 1, web3.utils.toWei(String(data.price))).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		wallet.eth.sendTransaction({
		        to: NFTSTORE_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    async function(error, res){
		        console.log(error);
		        console.log(res);
            if (res){
              let subEvent = await subscription(SIMPLEAUCTION_ADDRESS, EVENTS_TOPICS.FIX_ORDER_CREATED)
              
              subEvent.on('data', async event => {
                console.log(item, cookie.get('id'))
                console.log(data)
                const pure = event.data.slice(2)
                const sth = event.data.slice(0, 66)
                console.log(parseInt(sth))
                const res = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/update', {type: "orderSell", tokenId: item._id, orderIndex: parseInt(sth), location: 'marketplace', status: 'active', price: data.price})
                router.push(`/cabinet/${cookie.get('id')}`)
              })
            } else {
              alert('Error! You canceled the transaction, go back to the main page.')
            }


		    }
		)		
	}
  }
  
  };
  const getGasFee = async(gasLimit)=>{
    let result = 0
    await NFTSTORE.methods.getGasFee(gasLimit).call({}, (err, res)=>{
      console.log(`gasFee - ${res}`)
      result = res
    })
    return result;
  }
  
  return (
    <>
    <form className="create_form" onSubmit={handleSubmit(onSubmit)}>
      
{/*       <label htmlFor="download_2" className="create_download_canvas icon icon-file">
        <input type="file" id="download_2" />
      </label> */}
      <div className={clsx('create_check', auctionChecked ? 'active' : 'inactive')}>
        <label htmlFor="check-23">
          <input
            type="radio"
            name="type"
            id="check-23"
            checked={auctionChecked}
            onClick={() => {
              setAuctionChecked(!auctionChecked);
            }}
          />
          <span className="icon icon-check_sea" />
          <span className="title">{lang.auction.title}</span>
        </label>
        <div className="create_check_info create_inputs" ref={auctionCheckInfoRef}>
          <div className="create_input w100">
            <span>{lang.auction.firstBid}:</span>
            <input type="number" step="any" {...register('firstBid')}/>
            <span className="icon icon-eth" />
          </div>

          <div className="create_input">
            <span>{lang.auction.startDate}:</span>
            <TextField id="datetime-local" className={classes.textField}         InputLabelProps={{
          shrink: true,
        }}
        type="datetime-local" {...register('startDate')}/>
            {/* <span className="icon icon-calendar" /> */}
          </div>
          <div className="create_input">
            <label htmlFor="end">
              <span className="heading">{lang.auction.endDate}:</span>
            </label>
            <div ref={auctionCheckInfoRef}>
            <TextField id="datetime-local"
        type="datetime-local" {...register('endDate')}/>
{/*               <span className="icon icon-calendar" /> */}
            </div>
          </div>
        </div>
      </div>
      <div className={clsx('create_check', fixPayChecked ? 'active' : 'inactive')}>
        <label htmlFor="check-31">
          <input
            type="radio"
            id="check-31"
            checked={fixPayChecked}
            onClick={() => {
              setFixPayChecked(!fixPayChecked);
            }}
          />
          <span className="icon icon-check_sea" />
          <span className="title">{lang.auction.fixPay}</span>
        </label>
        <div className="create_check_info" ref={fixPayCheckInfoRef}>
          <div className="create_input">
            <span>{lang.auction.setPrice}:</span>
            <input type="number" step="any"  {...register("price")}/>
            <span className="icon icon-eth" />
          </div>
        </div>
      </div>
{/*        <div className="create_input" style={{position: 'static'}}> */}
        {/* <span className="icon icon-sharp" /> */}
{/*        </div>  */}
      <button type="submit" className="fill btn btn_sea">
        <span>{lang.pageNames.createNFT}</span>
      </button>
    </form>
    <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Resell NFT</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <h2>Approving NFT</h2>
            </div>
            <div>
              {approveLoader ? <CircularProgress /> : <DoneIcon/>}
            </div>
            <div>
              <h2> Publicating NFT</h2>
            </div>
            <div>
              {createLoader ? <CircularProgress /> : <DoneIcon/>}
            </div>
            

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}