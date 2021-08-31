import React, { useState, useMemo, useEffect } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import cookie from 'js-cookie'
import router from 'next/router';
import Header from '../components/global/Header';
import Theme from '../components/Theme';
import * as utils from '../utils';


import type * as Types from '../types/index.d';


const { WALLET_LOCAL_STORAGE_NAME } = utils.c;

/**
 * Страница Настройки профиля
 * @param props
 * @returns
 */
function Settings({app,}): React.ReactElement {
  const { lang } = app;
  const [header, setHeader] = useState(null)
  const [headerCopy, setHeaderCopy] = useState(null)
  const [headerActive, setHeaderActive] = useState<boolean>(false);
  const [logoActive, setLogoActive] = useState<boolean>(false);
  const [file, setFile] = useState(null)
  const [fileCopy, setFileCopy] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if(cookie.get('name')){
      setName(cookie.get('name'))
    }
    if(cookie.get('email')){
      setEmail(cookie.get('email'))
    }
    if (cookie.get('img')){
      setFile(cookie.get('imgUrl'))
    }
  }, [])
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  function handleChange(event){
    setFileCopy(event.target.files[0])
    const img = URL.createObjectURL(event.target.files[0])
    setFile(img)
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

    await fetch('https://desolate-inlet-76011.herokuapp.com/file/upload', requestOptionsFile)
  .then(response => response.text())
  .then(imageUrl => cookie.set('imgUrl', imageUrl))
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
      await fetch('https://desolate-inlet-76011.herokuapp.com/file/upload', headerOptionsFile)
      .then(response => response.text())
      .then(headerImageUrl => cookie.set('headerUrl', headerImageUrl))
    }
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, wallet: cookie.get('wallet'), imgUrl: cookie.get('imgUrl'), headerUrl: cookie.get('headerUrl')})
    }
    await fetch('https://desolate-inlet-76011.herokuapp.com/user/register', requestOptions)
    .then(response => response.json())
    .then(data => {
    console.log(data)
    cookie.set('name', data.name)
    cookie.set('email', data.email)
    cookie.set('id', data._id)
    cookie.set('wallet', data.wallet)
    router.push(`/cabinet/${data._id}`)
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
              </div>
              <div className="settings__form-item">
                <label>{lang.form.yourEmail}:</label>
                <input value={email} type="email" name="email" onChange={handleEmailChange} required/>
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
                  <input type="file" accept="image/*" onChange={e => {setHeaderCopy(e.target.files[0]); setHeader(URL.createObjectURL(e.target.files[0]))}}/>
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
    </Theme>
  );
}

export default Settings;
