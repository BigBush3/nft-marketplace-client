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
import Slider from '@material-ui/core/Slider';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import TextField from '@material-ui/core/TextField';
import { WithContext as ReactTags } from 'react-tag-input';
import fs from 'fs'

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
  const [royalty, setRoyalty] = useState(25)
  const [open, setOpen] = React.useState(false);
  const fixPayCheckInfoRef = useRef();
  const endDateCheckInfoRef = useRef();
  const video = useRef(false)
  const type = useRef('')
  const [createLoader, setCreateLoader] = useState(false)
  const [approveLoader, setApproveLoader] = useState(false)
  const [sellLoader, setSellLoader] = useState(false)
  const [fileCopy, setFileCopy] = useState(null)
  const [file, setFile] = useState(null)
  const [pdfCopy, setPdfCopy] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [auctionChecked, setAuctionChecked] = useState<boolean>(true);
  const [endDateChecked, setEndDateChecked] = useState<boolean>(false);
  const [fixPayChecked, setFixPayChecked] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState(0)
  function handleDelete(i) {
    setTag(
     tags.filter((tag, index) => index !== i),
    );
}
const handleRoyalty = (e, newValue) => {
  setRoyalty(newValue)
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
    NFTSTORE.methods.admins(address).call({}, (err, res)=>{
      console.log(`it's owners address ${address} - ${res}`)
    })
  }
  function handleChange(event){
    setFileCopy(event.target.files[0])
    console.log(event.target.files[0])
    if (event.target.files[0].type === 'video/mp4'){
      video.current = true
      type.current = 'video'
    }
    else if (event.target.files[0].name.substr(event.target.files[0].name.length - 3) === 'gif'){
      type.current = 'gif'
    } else {
      type.current = 'img'
    }
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
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    const wallet = await new Web3(window.ethereum);
    const subscription = (contractAddress, topic)=>{
      console.log('start subscription')
      console.log('contractAddress: ', contractAddress)
      console.log('topic: ', topic)
      return web3.eth.subscribe('logs', {
          address: contractAddress,
          topics: [topic]
      })
    } 
    console.log(walletAddress)
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
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let sheesh = new FormData();
    sheesh.append('file', fileCopy);

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
        name: `testname-${new Date().getTime()}-${fileCopy.name}`,
    });
    sheesh.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    sheesh.append('pinataOptions', pinataOptions);

    const response =  await axios
        .post(url, sheesh, {
          //@ts-ignore
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
              //@ts-ignore
                'Content-Type': `multipart/form-data; boundary=${sheesh._boundary}`,
                pinata_api_key: 'cb10e48b8d541b88d58a',
                pinata_secret_api_key: '90cdc703305e1085e06dfb8062fc5958dcc0985fba2b1180c3cdb59cc67dd573'
            }
        })
    const ipfsHash = response.data.IpfsHash
    let ipfsPdfHash = ''
    if (pdfCopy){
      let pdfData = new FormData()
      pdfData.append('file', pdfCopy)
      const metadata = JSON.stringify({
        name: `testname-pdf-${new Date().getTime()}-${pdfCopy.name}`,
    });
    pdfData.append('pinataMetadata', metadata);
    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    pdfData.append('pinataOptions', pinataOptions);
    const resPdf =  await axios
    .post(url, sheesh, {
      //@ts-ignore
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
          //@ts-ignore
            'Content-Type': `multipart/form-data; boundary=${sheesh._boundary}`,
            pinata_api_key: 'cb10e48b8d541b88d58a',
            pinata_secret_api_key: '90cdc703305e1085e06dfb8062fc5958dcc0985fba2b1180c3cdb59cc67dd573'
        }
    })
    ipfsPdfHash = resPdf.data.IpfsHash
    }
    let resp
    let txData = NFT.methods.create(1, royalty, ipfsHash, ipfsPdfHash).encodeABI()
    await wallet.eth.sendTransaction({
        to: NFT_ADDRESS,
        from: walletAddress,
        data: txData
    },
    async function(error, res){
      if (createMany){
        resp = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/createMany', {userId: cookie.get('id'), hashtags: tags, img: `https://inifty.mypinata.cloud/ipfs/${ipfsHash}`, title: data.title, collect: data.collection, royalty: royalty, description: data.description, pdf: `https://inifty.mypinata.cloud/ipfs/${ipfsPdfHash}`, currentBid: data.firstBid, type: "timedAuction", tokenId: something, orderIndex: 0, startDate: data.startDate, endDate: data.endDate, amount: data.amount, action: `${cookie.get('name')} created nft and sell it for ${data.firstBid} ETH`, nftType: type.current, status: 'created', price: data.price})
      } else {
        resp = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/create', {userId: cookie.get('id'), hashtags: tags, img: `https://inifty.mypinata.cloud/ipfs/${ipfsHash}`, title: data.title, collect: data.collection, royalty: royalty, description: data.description, pdf: `https://inifty.mypinata.cloud/ipfs/${ipfsPdfHash}`, currentBid: data.firstBid, type: "timedAuction", tokenId: something, orderIndex: 0, startDate: data.startDate, endDate: data.endDate, action: `${cookie.get('name')} created nft and sell it for ${data.firstBid} ETH`, nftType: type.current, status: 'created', price: data.price})
        console.log(response.data)
      }
        console.log(error);
        console.log(res);
        subscription(NFT_ADDRESS, EVENTS_TOPICS.CREATE)
    }
);   setCreateLoader(false)
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
      subscription(NFT_ADDRESS, EVENTS_TOPICS.APPROVE)
  }
); setApproveLoader(false)
    }

  const something = await NFT.methods.mapStringOfURI(ipfsHash).call({}, (err, res)=>{
    console.log(`tokenID of URI ${ipfsHash} - ${res}`)
  })
  setSellLoader(true)
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
              
                const result = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/subscription', {id: resp.data.resClient, userId: cookie.get('id'), contractAddress: TIMEDAUCTION_ADDRESS, topic: EVENTS_TOPICS.Time_Auction_Created, tokenId: something, type: 'timedAuction', status: 'active' })
                router.push(`/product/${result.data.resClient._id}`)
            }
        )		
      }
    
  } else {
  let fee = await getGasFee(gasFee.createOrderSell)
	let txData = NFTSTORE.methods.createOrderSell(NFT_ADDRESS, something, 1, web3.utils.toWei(String(data.price))).encodeABI()
	if(!wallet){
		alert('you have to connect cryptowallet')
	} else {
		await wallet.eth.sendTransaction({
		        to: NFTSTORE_ADDRESS,
		        from: walletAddress,
		        value: web3.utils.toWei(String(fee/1e18)),
		        data: txData
		    },
		    async function(error, res){
		        console.log(error);
		        console.log(res);
            console.log(resp.data.resClient._id)
            const result = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/subscription', {id: resp.data.resClient._id, userId: cookie.get('id'), contractAddress: SIMPLEAUCTION_ADDRESS, topic: EVENTS_TOPICS.FIX_ORDER_CREATED, tokenId: something, status: 'active', type: 'orderSell'})
            console.log(result.data)
            router.push(`/product/${result.data.resClient._id}`)
		    }
		)		
	}
  }
  
  }
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
      {file ? [video.current ? <video src={file} width="450" height="300" controls>
     </video>: <img src={file} alt="" />] : null}
      
{/*       <label htmlFor="download_2" className="create_download_canvas icon icon-file">
        <input type="file" id="download_2" />
      </label> */}
      {!createMany && <div className={clsx('create_check', auctionChecked ? 'active' : 'inactive')}>
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
            <TextField style={{'fontWeight': 'lighter'}} id="datetime-local" className={classes.textField}         InputLabelProps={{
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
            <TextField style={{'fontWeight': 'lighter'}} id="datetime-local" 
        type="datetime-local" {...register('endDate')}/>
{/*               <span className="icon icon-calendar" /> */}
            </div>
          </div>
        </div>
      </div>}
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
                    autofocus={false}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    delimiters={delimiters}
                    placeholder='' />
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
      <div className="create_inputs" style={{marginTop: '15px', fontSize: '15px', fontWeight: 'lighter'}}>
        <div className="create_slider">
          <span>{lang.roalty}:</span>
{/*           <input type="number" name='royalty' {...register("royalty")} required/> */}
<div style={{display: 'flex'}}>
                <Slider value={royalty} onChange={handleRoyalty} defaultValue={25} step={5} min={0} max={50} aria-label="Temperature" valueLabelDisplay="auto"/>
          <span className="icon icon-persent" style={{display: 'block', marginLeft: '10px'}}/>
</div>

        </div>
        {createMany && (
          <div className="create_input">
            <span>{lang.auction.countNFT}:</span>
            <input type="number" {...register("amount")}/>
          </div>
        )}
      </div>
      <button type="submit" className="fill btn btn_sea">
        <span>{lang.pageNames.createNFT}</span>
      </button>
    </form>
    <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create NFT</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <h2>Creating NFT</h2>
            </div>
            <div>
              {createLoader ? <CircularProgress /> : <DoneIcon/>}
            </div>
            <div>
              <h2>Approving NFT</h2>
            </div>
            <div>
              {approveLoader ? <CircularProgress /> : <DoneIcon/>}
            </div>
            <div>
              <h2>Publicating NFT.</h2>
            </div>
            <div>
              {sellLoader ? <CircularProgress/> : <DoneIcon/>}
            </div>
            

          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}