import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import Modal from '@material-ui/core/Modal';
import fs from 'fs'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../utils/canvasUtil'
import Some from '@material-ui/icons/Clear'
import StyledSelect from '../UI/StyledSelect';

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
  const getProvider = () => {
    const provider = new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET)
    provider.on('connect', () => console.log('WS Connected'))
    provider.on('error', () => {
      console.error('WS Error')
      web3.setProvider(getProvider())
    })
    provider.on('end', () => {
      console.error('WS End')
      web3.setProvider(getProvider())
    })

    return provider
  }
  const web3 = new Web3(getProvider())
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
  const [filterBy, setFilterBy] = useState('marketplace')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [createLoader, setCreateLoader] = useState(false)
  const [approveLoader, setApproveLoader] = useState(false)
  const [sellLoader, setSellLoader] = useState(false)
  const [fileCopy, setFileCopy] = useState(null)
  const [file, setFile] = useState(null)
  const [pdfCopy, setPdfCopy] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [openFile, setOpenFile] = useState(false)
  const [auctionChecked, setAuctionChecked] = useState<boolean>(true);
  const [endDateChecked, setEndDateChecked] = useState<boolean>(false);
  const [fixPayChecked, setFixPayChecked] = useState<boolean>(false);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])
  const showCroppedHeader = useCallback(async () => {
    try {
      const dataUrl = await getCroppedImg(
        file,
        croppedAreaPixels,
        
      )
      console.log('donee', { dataUrl })
      const fileImage = dataURLtoFile(dataUrl, `${new Date().getTime()}-somethingdata.png`)
      setFile(URL.createObjectURL(fileImage))
      setFileCopy(fileImage)
      setOpenFile(false)
    } catch (e) {
      console.error(e)
    }
  }, [file, croppedAreaPixels])
  const handleCloseHeader= () => {
    setOpenFile(false)
  }
  function dataURLtoFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}
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
    const img = URL.createObjectURL(event.target.files[0])
    setFile(img)
    setOpenFile(true)
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
    const formData = new FormData();
    formData.append(
      'file',
      fileCopy,
    );
        const requestOptionsFile = {
    method: 'POST',
    body: formData
  }
  const imgResponse = await (await fetch('https://nft-marketplace-api-plzqa.ondigitalocean.app/upload', requestOptionsFile)).json()
  const collCreate = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/collection/create', {img: imgResponse.result[0].location, location: filterBy, title: data.collection, description: data.description, user: cookie.get('id')})
  console.log(collCreate)
  router.push(`/cabinet/${cookie.get('id')}`)
  
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
        <input type="file" id="download" onChange={handleChange}/>
        <span>{lang.uploadFile}</span>
      </label>
      {file ? <img src={file} alt="" style={{marginTop: '10px', borderRadius: '10px'}} /> :
      
      <label htmlFor="download_2" className="create_download_canvas icon icon-file">
        <input type="file" id="download_2" onChange={handleChange}/>
      </label>}
      <div className="create_input">
        <span>{lang.auction.collectionName}:</span>
        <input type="text" name='collection' {...register("collection")} required/>
      </div>
      <div className="create_input">
        <span>{lang.description}:</span>
        <textarea name='description' {...register("description")} required/>
      </div>
      <div style={{marginTop: '15px'}}>
        <span className='create_span'>{lang.collection.collectionLocation}</span>
        <StyledSelect
                variant="outlined"
                value={filterBy}
                app={lang}
                onChange={(e: any) => {
                  setFilterBy(e.target.value);
                }}
                options={[
                  {
                    value: 'marketplace',
                    text: "Marketplace",
                  },
                  {
                    value: 'fineart',
                    text: "FineArt",
                  },
                ]}
              />
      </div>
      <button type="submit" className="fill btn btn_sea">
        <span>{lang.pageNames.createCollection}</span>
      </button>
    </form>
      <Modal
    open={openFile}
    onClose={handleCloseHeader}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
  ><div className='popup' style={{maxWidth: '720px', padding: '57px 68px 47px 16px'}}>
    <div style={{minWidth: '300px', minHeight: '400px', borderRadius: '10px'}}>
    <Some className='close_cross' onClick={handleCloseHeader} style={{cursor: 'pointer'}}/>
      <div style={{  position: 'absolute',
      borderRadius: '10px',
      overflow: 'hidden',
  top: '0',
  left: '0',
  right: '0',
  bottom: '80px'}}>
            <Cropper
              image={file}
              crop={crop}
              zoom={zoom}
              aspect={3/1}
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
      </div>
      <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                width: '50%',
                transform: 'translateX(-50%)',
                height: '80px',
                display: 'flex',
                alignItems: 'center'
              }}>
              <img src="/img/325962_minus_close_delete_exit_remove_icon.svg" style={{width: '15px', height: '15px', marginRight: '10px'}} alt="" />
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  
                  //@ts-ignore
                  onChange={(e, zoom) => setZoom(zoom)} />
                  <img src="/img/325963_plus_add_new_icon.svg" style={{width: '15px', height: '15px', marginLeft: '10px'}} alt="" />
                  <div className='button' style={{marginTop: '135px', position: 'absolute'}}>
                                     <button className='buy fill' onClick={showCroppedHeader}>
                    <span>Save</span>
                  </button>
                  </div>
 
              </div><div>

                </div>

    </div>
      
    </div>
</Modal>
    </>
  );
}