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
import * as utils from '../../utils';
import type * as Types from '../../types/index';
import TextField from '@material-ui/core/TextField';
import { WithContext as ReactTags } from 'react-tag-input';
import Some from '@material-ui/icons/Clear'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../utils/canvasUtil'
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
import StyledSelect from '../UI/StyledSelect';
import Modal from '@material-ui/core/Modal';
import Slider from '@material-ui/core/Slider';


interface CreateFormProps {
  app: Types.AppProps;
  createMany: boolean;
  item: any;
}

export default function UpdateForm(props: CreateFormProps): React.ReactElement {
  const { app, createMany, item } = props;
  const { lang } = app;
  const [file, setFile] = useState(item.img)
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description)
  const [filterBy, setFilterBy] = useState(item.location)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [fileCopy, setFileCopy] = useState(null)
  const [openFile, setOpenFile] = useState(false)
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
  const handleChange = (event) => {
    const img = URL.createObjectURL(event.target.files[0])
    setFile(img)
    setOpenFile(true)
  }




  
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append(
      'file',
      fileCopy,
    );
        const requestOptionsFile = {
    method: 'POST',
    body: formData
  }
  let collResponse
  if (!(item.img === file)){
      const imgResponse = await (await fetch('https://nft-marketplace-api-plzqa.ondigitalocean.app/upload', requestOptionsFile)).json()
      collResponse = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/collection/update', {img: imgResponse.result[0].location, location: filterBy, title: title, description: description, id: router.query.id})
      router.push(`/collection/${collResponse.data._id}`)
  } else {
    collResponse = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/collection/update', {img: file, location: filterBy, title: title, description: description, id: router.query.id})
    router.push(`/collection/${collResponse.data._id}`)
  }
  
  }
  
  return (
    <>
    <form className="create_form">
    <label htmlFor="download" className="fill create_download btn btn_sea icon icon-download">
        <input type="file" id="download" onChange={handleChange} required/>
        <span>{lang.uploadFile}</span>
      </label>
      <span>{lang.fileFormats}</span>
      <img src={file}/>
      <div className="create_input">
        <span>Title:</span>
        <input type="text" name='name' value={title} onChange={(e) => setTitle(e.target.value)} required/>
      </div>
      <div className="create_input">
        <span>{lang.description}:</span>
        <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)} required/>
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
      <button onClick={onSubmit} type="submit" className="fill btn btn_sea">
        <span>Update Collection</span>
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