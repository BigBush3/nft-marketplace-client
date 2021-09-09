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
import type * as Types from '../../types/index.d';
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
export default function CreateForm(props: CreateFormProps): React.ReactElement {
  const { app, createMany } = props;
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
    createAuction: 180000,
    createOrderSell: 159000,
    returnFreeBalance: 58000,
  
    createBidAuction: 216300,
    updateBidAuction: 76600,
    finishAuction: 144600,
    cancelAuction: 59600,
  
    buyOrder :136400,
      cancelOrderSell :63000,
      createBidMarket : 219700,
      realizeBid : 140400,
      cancelBid :58400
  }

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    utils.$.setStylesDatepicker();
    // Выдвижения нужных полей
    // для аукциона
    if (!auctionChecked) {
      $(auctionCheckInfoRef.current).slideUp();
    } else {
      $(auctionCheckInfoRef.current).slideDown();
      if (fixPayChecked){
        setFixPayChecked(false)
        
      }
    }
    // при фиксированной продаже
    if (!fixPayChecked) {
      $(fixPayCheckInfoRef.current).slideUp();

    } else {
      $(fixPayCheckInfoRef.current).slideDown(); 
      if (auctionChecked){
        setAuctionChecked(false)
        
      }
    }
    // при установке даты окончания
    if (!endDateChecked) {
      $(endDateCheckInfoRef.current).slideUp(200);
    } else {
      $(endDateCheckInfoRef.current).slideDown(200);
    }
  }, [auctionChecked, fixPayChecked, endDateChecked]);
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
    const price = data.price * 1e18
    setOpen(true)
    setCreateLoader(true)
    const metamask = await connectMetaMask()
    const subscription = (contractAddress, topic)=>{
      console.log('start subscription')
      console.log('contractAddress: ', contractAddress)
      console.log('topic: ', topic)
      return web3.eth.subscribe('logs', {
          address: contractAddress,
          topics: [topic]
      })
    } 
    const walletAddress = metamask.userAddress
    const wallet = metamask.web3
    console.log('metamask connected')
    console.log('NFT contract connected')
    console.log(NFT)
    console.log('walletAddress: ', walletAddress)
    console.log('web3: ', web3)
    const owner = await isOwner(walletAddress)
    console.log(owner)
    const formData = new FormData();
    // Update the formData object
    formData.append(
      'file',
      fileCopy,
    );
    const pdfData = new FormData()
    pdfData.append(
      'file',
      pdf
    )

    const response = await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/upload', formData)
    const resPdf = await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/upload', pdfData)
    const ipfsHash = response.data.result.IpfsHash
    const ipfsPdfHash = resPdf.data.result.IpfsHash
    console.log(ipfsHash)
    console.log(data.dateRange)
    let txData = NFT.methods.create(1, data.royalty, ipfsHash, ipfsPdfHash).encodeABI()
    await wallet.eth.sendTransaction({
        to: NFT_ADDRESS,
        from: walletAddress,
        data: txData
    },
    function(error, res){
        console.log(error);
        console.log(res);
        subscription(NFT_ADDRESS, EVENTS_TOPICS.CREATE)
    }
);   setCreateLoader(false)
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
      subscription(NFT_ADDRESS, EVENTS_TOPICS.APPROVE)
  }
); setApproveLoader(false)
  const something = await NFT.methods.mapStringOfURI(ipfsHash).call({}, (err, res)=>{
    console.log(`tokenID of URI ${ipfsHash} - ${res}`)
  })
  if (auctionChecked){
      let fee = await getGasFee(gasFee.createAuction)
      console.log("Gas Fee - ", fee)
      let txData = await NFTSTORE.methods.createAuction(NFT_ADDRESS, something, web3.utils.toWei(String(data.firstBid)), Math.round(new Date(data.startDate).getTime()/1000), Math.round(new Date(data.endDate).getTime()/1000)).encodeABI()
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
                let subEvent = await subscription(TIMEDAUCTION_ADDRESS, EVENTS_TOPICS.Time_Auction_Created)
              
              subEvent.on('data', async event => {
                 
  const res = await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/create', {userId: cookie.get('id'), hashtags: tags, img: response.data.url, title: data.title, collect: data.collection, royalty: data.royalty, description: data.description, pdf: resPdf.data.url, currentBid: data.firstBid, type: "timedAuction", tokenId: something, orderIndex: parseInt(event.data), startDate: data.startDate, endDate: data.endDate})
  router.push(`/product/${res.data.resClient._id}`)

              })
    
            // subEvent.on('changed', changed => console.log(changed))
            // subEvent.on('error', err => { throw err })
            // subEvent.on('connected', nr => console.log(nr))
            }
        )		
      }
    
  } else {
  let fee = await getGasFee(gasFee.createOrderSell)
	let txData = NFTSTORE.methods.createOrderSell(NFT_ADDRESS, something, 1, web3.utils.toWei(String(data.price))).encodeABI()
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
		        if(price>0){
		        	let subevent = await subscription(SIMPLEAUCTION_ADDRESS, EVENTS_TOPICS.FIX_ORDER_CREATED)
              subevent.on("data", async event => {
                            
  const res = await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/create', {userId: cookie.get('id'),hashtags: tags, img: response.data.url, title: data.title, collect: data.collection, royalty: data.royalty, description: data.description, pdf: resPdf.data.url, price: data.price, type: "orderSell", tokenId: something, orderIndex: parseInt(event.data)})
 router.push(`/product/${res.data.resClient._id}`)
              })
		        } else {
			        subscription(SIMPLEAUCTION_ADDRESS, EVENTS_TOPICS.Simple_Auction_Created)
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
      <label htmlFor="download" className="fill create_download btn btn_sea icon icon-download">
        <input type="file" id="download" onChange={handleChange} required/>
        <span>{lang.uploadFile}</span>
      </label>
      <span>{lang.fileFormats}</span>
      {file ? <img src={file} alt="" /> : null}
      
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
        <span>{lang.auction.createHashTag}:</span>
        <ReactTags  className="create_input" tags={tags}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    delimiters={delimiters} />
        {/* <span className="icon icon-sharp" /> */}
{/*        </div>  */}
      <div className="create_input">
        <span>{lang.auction.nftName}:</span>
        <input type="text" name='name' {...register("title")} required/>
      </div>
      <div className="create_input">
        <span>{lang.auction.collectionName}:</span>
        <input type="text" name='collection' {...register("collection")} required/>
      </div>
      <div className="create_input">
        <span>{lang.description}:</span>
        <textarea name='description' {...register("description")} required/>
      </div>
      <label htmlFor="pdf" className="create_download btn btn_gray icon icon-download-black">
        <input type="file" id="pdf" accept=".pdf" onChange={handlePdfChange}/>
        <span>{lang.uploadDescription}</span>
      </label>
      <div>{pdf ? pdf.name: null}</div>
      <div className="create_inputs">
        <div className="create_input">
          <span>{lang.roalty}:</span>
          <input type="number" name='royalty' {...register("royalty")} required/>
          <span className="icon icon-persent" />
        </div>
        {createMany && (
          <div className="create_input">
            <span>{lang.auction.countNFT}:</span>
            <input type="number" />
          </div>
        )}
      </div>
      <button type="submit" className="fill btn btn_sea">
        <span>{lang.pageNames.createNFT}</span>
      </button>
    </form>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Создание NFT</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <h2>Создание токена</h2>
            </div>
            <div>
              {createLoader ? <CircularProgress /> : <DoneIcon/>}
            </div>
            <div>
              <h2>Approve токена</h2>
            </div>
            <div>
              {approveLoader ? <CircularProgress /> : <DoneIcon/>}
            </div>
            

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}