/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import clsx from 'clsx';
import { Select, MenuItem, Divider } from '@material-ui/core';
import Web3 from 'web3';
import WalletLink from 'walletlink';
import WalletConnectProvider from '@walletconnect/web3-provider';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import cookie from 'js-cookie'
import axios from 'axios';import StyledSelect from '../UI/StyledSelect';
import LogoImage from '../../public/img/logo.png';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';


const { WALLET_LOCAL_STORAGE_NAME } = utils.c;
const { unHiddenHtml } = utils.h;

// const redirUri = 'https://www.coinbase.com/oauth/authorize?client_id=8aae835f3048f7234600443edf1bd574e65effe059107e0e06584ffab2e00e9e&redirect_uri=https%3A%2F%2Fnft.uyem.ru%2Fcoinbase&response_type=code&scope=wallet%3Auser%3Aread';

// const providerUrl = 'http://127.0.0.1:7545';
/**
 * TODO ...
 * const web3 = new Web3(providerUrl);

const api = '89d6c7e689d73133639a013aaf3c1d87dc7ab09246464314d6057d8bfdf5f425';
// const api = '8aae835f3048f7234600443edf1bd574e65effe059107e0e06584ffab2e00e9e'; // app
const cb = 'https://www.coinbase.com/oauth/authorize?response_type=code&client_id=19d6c7e689d73133639a013aaf3c1d87dc7ab09246464314d6057d8bfdf5f425&redirect_uri=https%3A%2F%2nft.uyem.ru%2Fcoinbase';
// const cb = `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${api}&redirect_uri=https%3A%2F%2nft.uyem.ru%2Fcoinbase&state=134ef5504a94&scope=wallet:user:read,wallet:accounts:read`;

const ac6 = '0x5CBD4F42e9E1709E944819f758862cD7ECdfD8Bf'; // wallet
// const ac6 = '0xCEC1fDF97FF57b5982F0f57E4b7Bf3d3F290A6E4';

const NFT_ABI = [{"constant":false,"inputs":[{"internalType":"address","name":"_newAdmin","type":"address"}],"name":"addAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"addOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_spender","type":"address"},{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_oldValue","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_currentValue","type":"uint256"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256[]","name":"_ids","type":"uint256[]"},{"internalType":"uint256[]","name":"_values","type":"uint256[]"}],"name":"batchTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_initialSupply","type":"uint256"},{"internalType":"string","name":"_uriFile","type":"string"},{"internalType":"string","name":"_uriPdf","type":"string"}],"name":"create","outputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address[]","name":"_to","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newAdmin","type":"address"}],"name":"removeAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"removeOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"_ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"_values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_newFund","type":"address"}],"name":"transferFund","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousFund","type":"address"},{"indexed":true,"internalType":"address","name":"newFund","type":"address"}],"name":"TransferFund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_value","type":"string"},{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"}],"name":"URI","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"adminList","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"admins","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256[]","name":"_ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"creators","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fund","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isAdmin","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"mapStringOfURI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"mapUri","outputs":[{"internalType":"string","name":"file","type":"string"},{"internalType":"string","name":"pdf","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"owners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownersList","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
 */

const providerUrl = 'https://mainnet.infura.io/v3/cab3253649344bdc8709512c85be0c21';

interface HeaderProps {
  app: Types.AppProps;
}

/**
 * Шапка приложения
 * @param props
 * @returns
 */
function Header(props): React.ReactElement {    
  const [verified, setVerified] = useState(false)
  const router = useRouter();
  const { app, data, onChange} = props;
  const { lang } = app;
  const [searchBy, setSearchBy] = useState<'title' | 'author' | 'collection'>('title');

  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false)
  let scrollPos = 0;
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [some, setSome] = useState(false)


  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked1(event.target.checked);
  };
  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked2(event.target.checked);
  };
  
  const handleSubmit = () => {
    if (checked1 && checked2){
      router.push('/settings')
    }
  }

   const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; 
  /**
   * Выдвижение хедера при прокрутке страницы
   */
  function windowScrollHandler() {
    const st = window.scrollY;
    $('.header.top').addClass('sticky');
    if (st - scrollPos < -18) {
      $('.header.top').addClass('fixed');
    } else if (st > scrollPos) {
      $('.header.top').removeClass('fixed');
    }
    if (st < 5) {
      $('.header.top').removeClass('sticky fixed');
    }
    scrollPos = st;
  }
  /**
   * Реализация логики подключения кошельков
   */
  async function connectWalletsHandler(): Promise<void> {
    // Кнопки подключения и закрытия

    const metamask = document.querySelector('#metamask');
    const mew = document.querySelector('#mew');
    const coinbase = document.querySelector('#coinbase');
    const mfpClose: HTMLAnchorElement = document.querySelector('.mfp-close');
    function saveAccounts(accounts: string[]) {
      // Если получены номера аккаунтов
      if (accounts?.length !== 0) {
        mfpClose.click();
        cookie.set('wallet', accounts[0]);
        const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({wallet: accounts[0]})
        }
        fetch('https://desolate-inlet-76011.herokuapp.com/user/login', requestOptions)
        .then(response => response.json())
        .then(dame => {
          console.log(dame)
          if(dame.name && dame.email){
            cookie.set('name', dame.name)
            cookie.set('email', dame.email)
            cookie.set('id', dame.id)
            cookie.set('verified', dame.verified)
            console.log(cookie.get('verified'))
            
            if (dame.imgUrl){
              fetch(cookie.get('imgUrl'))
    .then(r => r)
    .then(picture => picture.blob())
    .then(img => URL.createObjectURL(img))
    .then(blob => {
      cookie.set('img', blob)
    })
            }
            closeConnectDialog()
            setOpen(false)
            console.log(data)
            router.push(`/cabinet/${cookie.get('id')}`)
          } else{
            closeConnectDialog()
            setOpen(true)
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
      } else {
        alert('Wallet not connected');
        // TODO вывод что кошелек не найден
      }
    }
    /**
     * Прослушиватель нажатия на Метамаск
     */
    async function connectToMetamask() {
      let accounts;
      const { ethereum }: any = window;
      // Если подключение к расширению браузера
      if (ethereum?.isMetaMask) {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        // Если подключение к мобильному устройству
        const provider = new WalletConnectProvider({
          rpc: {
            1: providerUrl,
          },
        });
        accounts = await provider?.enable();
      }
      /*
       TODO ...
       const NFT = new web3.eth.Contract(NFT_ABI, ac6);
      const txData = NFT.methods.create(1, 'fileHash', 'pdfHash').encodeABI();
      web3.eth.sendTransaction(
        {
          to: ac6,
          from: accounts[0],
          data: txData,
          value: web3.utils.toWei('0.3', 'ether'),
        },
        (error, res) => {
          console.log(1, error);
          console.log(2, res);
        }
      );
      const balance = await web3.eth.getBalance(ac6);
      console.log(web3.utils.fromWei(balance, 'ether' ))
      */
      // Если получены номера аккаунтов
      saveAccounts(accounts);
    }
    /**
     * Прослушиватель нажатия на MEW
     */
    async function connectToMew(): Promise<void> {
      let MEWconnect = await import('@myetherwallet/mewconnect-web-client');
      if (utils.h.isApp()) {
        MEWconnect = MEWconnect.default;
      }
      const mewConnect = new MEWconnect.Provider();
      // Initialize a Web3 Provider object
      const ethereum = await mewConnect.makeWeb3Provider(1, providerUrl);
      let accounts = [];
      try {
        accounts = await ethereum.enable();
      } catch (e) {
        accounts = await ethereum.send('eth_requestAccounts');
      }
      // Если получены номера аккаунтов
      saveAccounts(accounts);
    }
    /**
     * Прослушиватель нажатия на CoinBase
     */
    async function connectToCoinBase() {
      const walletLink = new WalletLink({
        appName: 'APP_NAME',
        appLogoUrl: 'APP_LOGO_URL',
        darkMode: false,
      });
      let accounts;
      const provider = walletLink.makeWeb3Provider(providerUrl, 1);
      try {
        accounts = await provider.send('eth_requestAccounts');
      } catch (e) {
        accounts = await provider.enable();
      }
      saveAccounts(accounts);
    }
    /**
     * Обработчик нажатия на кнопку закрыть диалог
     * очищаем все прослушиватели
     */
    function closeConnectDialog() {
      mfpClose.removeEventListener('click', closeConnectDialog);
      metamask.removeEventListener('click', connectToMetamask);
      mew.removeEventListener('click', connectToMew);
      coinbase.removeEventListener('click', connectToCoinBase);
    }
    // Навешивает прослушиватель закрытия для очистки остальных прослушивателей
    mfpClose.addEventListener('click', closeConnectDialog);
    // прослушивает нажатие кнопки metamask
    metamask.addEventListener('click', connectToMetamask);
    // прослушивает нажатие кнопки mew
    mew.addEventListener('click', connectToMew);
    // прослушивает нажатие кнопки coinbase
    coinbase.addEventListener('click', connectToCoinBase);
  }
  useEffect(() => {

    if (cookie.get('verified')){
      setSome(true)
    }
    utils.$.setStylesHeader();
    window.addEventListener('scroll', windowScrollHandler);
    return () => {
      // Удаление прослушивателя прокрутки при размонтировании
      window.removeEventListener('scroll', windowScrollHandler);
    };
  }, []);
  function disconnectHandler(){
    cookie.set('name', '')
    cookie.set('img', '')
    cookie.set('email', '')
    cookie.set('wallet', '')
    cookie.set('id', '')
    cookie.set('verified', false)
  }
  return (
    <><header className="header top">
      <div className="wrapper">
        <div className="header__top">
          <div className="header__logo">
            <a href="index.html">
              <Image src={LogoImage} alt="logo" />
            </a>
          </div>
          <div className="header__block-wrap">
            <div className="header__block">
              <nav className="header__nav">
                <ul className="header__nav-items">
                  <li className="header__nav-item">
                    <Link href="/">
                      <a role="button" onClick={unHiddenHtml} className="header__nav-link">
                        {lang.pageNames.home}
                      </a>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link href="/fineart">
                      <a role="button" onClick={unHiddenHtml} className="header__nav-link">
                        {lang.pageNames.fineArt}
                      </a>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link href="/marketplace">
                      <a role="button" onClick={unHiddenHtml} className="header__nav-link">
                        {lang.pageNames.marketPlace}
                      </a>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link href="/faq">
                      <a role="button" onClick={unHiddenHtml} className="header__nav-link">
                        {lang.pageNames.support}
                      </a>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link href="/about">
                      <a role="button" onClick={unHiddenHtml} className="header__nav-link">
                        {lang.pageNames.about}
                      </a>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link href="/activity">
                      <a role="button" onClick={unHiddenHtml} className="header__nav-link">
                        {lang.pageNames.activity}
                      </a>
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="header__cover">
                { cookie.get('id') ? [
                  <div className="header__user" key='some gang'>
                    <div className="header__user-img">
                      {cookie.get('imgUrl') ? <img src={cookie.get('imgUrl')} alt='avatar'/> : <img src="/img/avatar_0.png" alt="avatar" />}
                      
                    </div>
                    <div className="header__user-title">{lang.userMenu.title}</div>
                    <div className="header__user-toolbar">
                      <ul className="user-toolbar__list">
                        <li className="user-toolbar__item">
                          <Link href={`/cabinet/${cookie.get('id')}`}>
                          {/* tslint:disable-next-line */}
                            <a role="button" onClick={unHiddenHtml}>
                              <i className="flaticon-businessman" />
                              {lang.userMenu.myProfile}
                            </a>
                          </Link>
                        </li>

                        <li className="user-toolbar__item">
                          <Link href="/settings">
                            <a role="button" onClick={unHiddenHtml}>
                              <i className="flaticon-cogwheel" /> {lang.userMenu.settings}
                            </a>
                          </Link>
                        </li>
                        <li className="user-toolbar__item logout">
                          <Link href="/">
                          <a role='button' onClick={disconnectHandler}>
                            <i className="flaticon-letter-x close" />
                            {lang.userMenu.disconnect}
                          </a>
                          </Link>
 
                        </li>
                      </ul>
                    </div>
                  </div>
                 ] : [
                  <div className="header__user" key='too much gang'>
                    <div className='secret_key'>
                                         <a href="#" className="open_connect" onClick={connectWalletsHandler}>
                      <i className="flaticon-wallet" />
                      <span>{lang.wallet}</span>
                    </a>
                    </div>
 
                  </div>
                 ]}
                <div className="header__lang">
                  <Select
                    disableUnderline={true}
                    value={lang.value}
                    label={lang.language}
                    onChange={(e: any) => {
                      // Смена языка
                      Router.push(Router.asPath, Router.asPath, { locale: e.target.value });
                    }}>
                    <MenuItem value="ru">RU</MenuItem>
                    <MenuItem value="en">EN</MenuItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="header__connect tab">
            <a href="#" className="open_connect">
              <i className="flaticon-wallet" />
              <span>Connect Wallet</span>
            </a>
          </div>

          <div
            role="button"
            className={clsx('header__burger', menuOpened && 'active')}
            onClick={() => {
              setMenuOpened(!menuOpened);
            }}>
            <span />
          </div>
        </div>
        <div className="header__search">
          <div className="header__search-sort">
            <StyledSelect
              title={lang.searchBy.name}
              options={[
                {
                  value: 'title',
                  text: lang.searchBy.title,
                },
                {
                  value: 'author',
                  text: lang.searchBy.author,
                },
                {
                  value: 'collection',
                  text: lang.searchBy.collection,
                },
              ]}
              value={searchBy}
              onChange={(e: any) => {
                setSearchBy(e.target.value);
              }}
            />
          </div>
          <div className="header__search-input">
            <input
              type="text"
              name="search"
              placeholder={`${lang.searchBy.name} ${lang.searchBy[searchBy]}`}
              onChange={(e) => onChange(e.target.value, searchBy)}
            />
          </div>
          <div className="header__search-button">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button type="submit">
              <i className="flaticon-search" />
            </button>
          </div>
        </div>
      </div>
    </header>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className='popup__heading heading'>{lang.modal.termsOfService.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {/* tslint:disable-next-line */}
          <div dangerouslySetInnerHTML={{ __html: lang.modal.termsOfService.description }} className='popup__text'/>
          </DialogContentText>
          <form onSubmit={handleSubmit}>
          <div className='popup__terms-check'>
            <div className="terms-check__item">
                        <Checkbox
        checked={checked1}
        onChange={handleChange1}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        required id='age'
          />
          <label htmlFor="age">{lang.modal.termsOfService.iHaveOld}</label>
            </div >
            <div className="terms-check__item">
                          <Checkbox
        checked={checked2}
        onChange={handleChange2}
        inputProps={{ 'aria-label': 'primary checkbox' }}
        required id='police'
          />
            <label htmlFor="police">{lang.modal.termsOfService.iAccept}</label>
            </div>

          </div>
          <div role='button' className="popup__button button">
          <a role='button' className="fill" onClick={handleSubmit} type='submit'>
            <span>{lang.modal.termsOfService.proceed}</span>
          </a>
        </div>
          </form>

        </DialogContent>
      </Dialog>
    </>
  );
}

Header.getInitialProps = async ({req, res}) => {
  /* tslint:disable-next-line */
  if (req.cookies.id){
    const response = await axios.get(`https://desolate-inlet-76011.herokuapp.com/user/${req.cookies.id}`)
    console.log(response.data)
    return {data: response.data}
  }
  return
  
}

export default Header;
