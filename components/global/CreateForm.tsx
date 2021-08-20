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
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';


interface CreateFormProps {
  app: Types.AppProps;
  createMany: boolean;
}

export default function CreateForm(props: CreateFormProps): React.ReactElement {
  const { app, createMany } = props;
  const { lang } = app;
  const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/62b7d9f5f9844b8582f51e4b5c906c09"));
  const NFT = new web3.eth.Contract([{"constant":false,"inputs":[{"internalType":"address","name":"_newAdmin","type":"address"}],"name":"addAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"addOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_spender","type":"address"},{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_oldValue","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_currentValue","type":"uint256"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256[]","name":"_ids","type":"uint256[]"},{"internalType":"uint256[]","name":"_values","type":"uint256[]"}],"name":"batchTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_initialSupply","type":"uint256"},{"internalType":"string","name":"_uriFile","type":"string"},{"internalType":"string","name":"_uriPdf","type":"string"}],"name":"create","outputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address[]","name":"_to","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newAdmin","type":"address"}],"name":"removeAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"removeOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"_ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"_values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_newFund","type":"address"}],"name":"transferFund","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousFund","type":"address"},{"indexed":true,"internalType":"address","name":"newFund","type":"address"}],"name":"TransferFund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_value","type":"string"},{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"}],"name":"URI","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"adminList","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"admins","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256[]","name":"_ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"creators","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fund","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"mapStringOfURI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mapUri","outputs":[{"internalType":"string","name":"file","type":"string"},{"internalType":"string","name":"pdf","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"owners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownersList","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}], "0x4C9Fc4C2a21F7C7f0Cbd4aD35cff4CF721d6e04b")
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
  const handleClickOpen = () => {
    setOpen(true);
  };

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
    }
    // при фиксированной продаже
    if (!fixPayChecked) {
      $(fixPayCheckInfoRef.current).slideUp();
    } else {
      $(fixPayCheckInfoRef.current).slideDown();
    }
    // при установке даты окончания
    if (!endDateChecked) {
      $(endDateCheckInfoRef.current).slideUp(200);
    } else {
      $(endDateCheckInfoRef.current).slideDown(200);
    }
  }, [auctionChecked, fixPayChecked, endDateChecked]);
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
    setCreateLoader(true)
    const metamask = await connectMetaMask()
    const subscription = async (topic)=>{
      await web3.eth.subscribe('logs', {
          address: "0x1bD9A75e6BCF3B9488f0D994C9D84B65AdDeF348",
          topics: [topic]
      }, (error, result)=>{
          console.log(error)
            console.log(result)
      });	
    } 
    const walletAddress = metamask.userAddress
    const wallet = metamask.web3
    console.log('metamask connected')
    console.log('NFT contract connected')
    console.log(NFT)
    console.log('walletAddress: ', walletAddress)
    console.log('web3: ', web3)
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
    let txData = NFT.methods.create(1, ipfsHash, ipfsPdfHash).encodeABI()
    await wallet.eth.sendTransaction({
        to: "0x4C9Fc4C2a21F7C7f0Cbd4aD35cff4CF721d6e04b",
        from: walletAddress,
        data: txData
    },
    function(error, res){
        console.log(error);
        console.log(res);
        subscription("0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62")
    }
);   setCreateLoader(false)
    setApproveLoader(true)
    txData = NFT.methods.setApprovalForAll("0x1bD9A75e6BCF3B9488f0D994C9D84B65AdDeF348", true).encodeABI()
    await wallet.eth.sendTransaction({
      to: "0x4C9Fc4C2a21F7C7f0Cbd4aD35cff4CF721d6e04b",
      from: walletAddress,
      data: txData
  },
  function(error, res){
      console.log(error);
      console.log(res);
      subscription("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31")
  }
); setApproveLoader(false)
  const something = NFT.methods.mapStringOfURI(ipfsHash).call({}, (err, res)=>{
    console.log(`tokenID of URI ${ipfsHash} - ${res}`)
  })
  const res = await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/create', {userId: cookie.get('id'), img: response.data.url, title: data.title, collect: data.collection, royalty: data.royalty, description: data.description, pdf: resPdf.data.url})
  console.log(res)
  router.push(`/product/${res.data.result._id}`)
  };
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
            <input type="number" />
            <span className="icon icon-eth" />
          </div>

          <div className="create_input">
            <span>{lang.auction.startDate}:</span>
            <input className="datepicker" />
            <span className="icon icon-calendar" />
          </div>
          <div className="create_input">
            <label htmlFor="end">
              <input
                type="checkbox"
                id="end"
                checked={endDateChecked}
                onClick={() => {
                  setEndDateChecked(!endDateChecked);
                }}
              />
              <span className="icon icon-check_sea" />
              <span className="heading">{lang.auction.endDate}:</span>
            </label>
            <div ref={endDateCheckInfoRef}>
              <input className="datepicker" />
              <span className="icon icon-calendar" />
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
            <input type="number" />
            <span className="icon icon-eth" />
          </div>
        </div>
      </div>
{/*       <div className="create_input">
        <span>{lang.auction.createHashTag}:</span>
        <input type="text" name='hashtag'/>
        <span className="icon icon-sharp" />
      </div> */}
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