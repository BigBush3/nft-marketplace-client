import React, { useState, useMemo, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import cookie from 'js-cookie'
import router from 'next/router';
import Header from '../components/global/Header';
import Theme from '../components/Theme';
import * as utils from '../utils';
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import { getCroppedImg } from '../utils/canvasUtil'

import type * as Types from '../types/index.d';
import Modal from '@material-ui/core/Modal';
import Some from '@material-ui/icons/Clear'
import axios from 'axios';


const { WALLET_LOCAL_STORAGE_NAME } = utils.c;

interface ErrorMessage { 
  status: String;
  field: String;
  previousEmail: String;
  previousNickname: String;
}
/**
 * Страница Настройки профиля
 * @param props
 * @returns
 */
function Settings({app,}): React.ReactElement {
  const { lang } = app;
  const [openAvatar, setOpenAvatar] = useState(false)
  const [openHeader, setOpenHeader] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [header, setHeader] = useState(null)
  const [headerCopy, setHeaderCopy] = useState(null)
  const [headerActive, setHeaderActive] = useState<boolean>(false);
  const [logoActive, setLogoActive] = useState<boolean>(false);
  const [file, setFile] = useState(null)
  const [fileCopy, setFileCopy] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>()
  const handleCloseHeader = () => {
    setOpenHeader(false)
  }
  const handleCloseAvatar = () => {
    setOpenAvatar(false)
  }
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])
  const showCroppedImage = useCallback(async () => {
    try {
      const dataUrl = await getCroppedImg(
        file,
        croppedAreaPixels,
        
      )
      console.log('donee', { dataUrl })
      const fileImage = dataURLtoFile(dataUrl, `${new Date().getTime()}-somethingdata.png`)
      setFile(URL.createObjectURL(fileImage))
      console.log(dataUrl)
      setFileCopy(fileImage)
      setOpenAvatar(false)
    } catch (e) {
      console.error(e)
    }
  }, [file, croppedAreaPixels])
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
  const showCroppedHeader = useCallback(async () => {
    try {
      const dataUrl = await getCroppedImg(
        header,
        croppedAreaPixels,
        
      )
      console.log('donee', { dataUrl })
      const fileImage = dataURLtoFile(dataUrl, `${new Date().getTime()}-somethingdata.png`)
      setHeader(URL.createObjectURL(fileImage))
      setHeaderCopy(fileImage)
      setOpenHeader(false)
    } catch (e) {
      console.error(e)
    }
  }, [header, croppedAreaPixels])
  useEffect(() => {
    if (cookie.get('id')){
      (async() => {
        const resp = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/user/${cookie.get('id')}`)
        if (resp.data.headerUrl){
          setHeader(resp.data.headerUrl)
        }
      })()
    }
    if(cookie.get('name')){
      setName(cookie.get('name'))
    }
    if(cookie.get('email')){
      setEmail(cookie.get('email'))
    }
    if (cookie.get('imgUrl')){
      setFile(cookie.get('imgUrl'))
    }
    console.log(cookie.get('headerUrl'))
    if (cookie.get('headerUrl')){
      setHeader(cookie.get('headerUrl'))
    }
  }, [])
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  function handleChange(event){
    setFileCopy(event.target.files[0])
    const img = URL.createObjectURL(event.target.files[0])
    setFile(img)
    setOpenAvatar(true)
  }
  const handleChangeHeader = (e) => {
    setHeaderCopy(e.target.files[0]);
    setHeader(URL.createObjectURL(e.target.files[0]));
    setOpenHeader(true)
  }
  function handleEmailChange(e){
    setEmail(e.target.value)
  }
  function handleNameChange(e){
    setName(e.target.value)
  }
  async function submitHandler(e){
    e.preventDefault()
    try{
      if (fileCopy){
      const formData = new FormData();
      // Update the formData object
      formData.append(
        'file',
        fileCopy,
      );
          const requestOptionsFile = {
      method: 'POST',
      body: formData
    }

    await fetch('https://nft-marketplace-api-plzqa.ondigitalocean.app/upload', requestOptionsFile)
  .then(response => response.json())
  .then(imageUrl => cookie.set('imgUrl', imageUrl.result[0].location))
    }
    if (headerCopy){
      const headerData = new FormData();
      headerData.append(
        'file', headerCopy
      )
      const headerOptionsFile = {
        method: 'POST',
        body: headerData
      }
      await fetch('https://nft-marketplace-api-plzqa.ondigitalocean.app/upload', headerOptionsFile)
      .then(response => response.json())
      .then(headerImageUrl => cookie.set('headerUrl', headerImageUrl.result[0].location))
    }
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, wallet: cookie.get('wallet'), imgUrl: cookie.get('imgUrl'), headerUrl: cookie.get('headerUrl'), previousNickname: cookie.get('name'), previousEmail: cookie.get('email')})
    };
    await fetch('https://nft-marketplace-api-plzqa.ondigitalocean.app/user/register', requestOptions)
    .then(response => response.json())

    .then(data => {
    console.log(data)
    if (data.name){
    cookie.set('name', data.name)
    cookie.set('email', data.email)
    cookie.set('id', data._id)
    cookie.set('wallet', data.wallet)
    router.push(`/cabinet/${data._id}`)
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      setErrorMessage(data)
    }

    })


    
    }
  catch(err){
      console.log(err.message)
    }
  }

  return (
    <Theme>
      <Header app={app}/>
      <div className="wrapper">
        <div className="content">
          <main className="main settings">
            <div className="heading center">
              <h1>{lang.pageNames.settings}</h1>
            </div>

            <form className="settings__form" onSubmit={submitHandler}>
              <div className="settings__form-item">
                <label>{lang.form.yourName}:</label>
                <input value={name} type="text" name="name" onChange={handleNameChange} required/>
                <p style={{color: 'red'}}>{errorMessage?.field === 'nickname' && errorMessage?.status}</p>
              </div>
              <div className="settings__form-item">
                <label>{lang.form.yourEmail}:</label>
                <input value={email} type="email" name="email" onChange={handleEmailChange} required/>
                <p style={{color: 'red'}}>{errorMessage?.field === 'email' && errorMessage?.status}</p>
              </div>

              <div className="settings__form-item settings__form-photo">
                <label>
                  {lang.form.profilePhoto}:
                </label>
                <div className="form-photo__items">
                  <div className="form-photo__item">
                    <div className="form-photo__cover">
                      {file ? <img src={file} alt='img'/> : <img src="img/avatar_0.png" alt="img" />}
                    </div>
                  </div>
                </div>
                <div className="settings__form-file button">
                  <input type="file" onChange={handleChange}/>
                  <div className="fill">
                    <i className="flaticon-download-1" />
                    <span>{lang.upload}</span>
                  </div>
                </div>
              </div>

              <div className="settings__form-item settings__form-photo">
                <label>
                  {lang.form.headerImage}:
                  <div className="products__item-info info"/>
                  
                </label>
                <div className="form-photo__header">

                  {header ? <img src={header} alt="img"/>:<img src="img/header.png" alt="img"/>}
                </div>
                <div className="settings__form-file button">
                  <input type="file" accept="image/*" onChange={handleChangeHeader}/>
                  <div className="fill">
                    <i className="flaticon-download-1" />
                    <span>{lang.upload}</span>
                  </div>
                </div>
              </div>

              <div className="settings__form-save">
                <button type="submit">{lang.save}</button>
              </div>
            </form>
          </main>
        </div>
        <Footer {...app} />
      </div>
      <Modal
    open={openAvatar}
    onClose={handleCloseAvatar}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
  ><div className='popup' style={{maxWidth: '720px', padding: '57px 68px 47px 16px'}}>
          <Some className='close_cross' onClick={handleCloseAvatar} style={{cursor: 'pointer'}}/>
    <div style={{minWidth: '300px', minHeight: '400px', borderRadius: '10px'}}>
      
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
              aspect={1}
              cropShape='round'
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
                                     <button className='buy fill' onClick={showCroppedImage}>
                    <span>Save</span>
                  </button>
                  </div>
 
              </div><div>

                </div>

    </div>
      
    </div>
</Modal>
<Modal
    open={openHeader}
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
              image={header}
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
    </Theme>
  );
}

export default Settings;
