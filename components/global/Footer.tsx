/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import Modal from '@material-ui/core/Modal';
import axios from 'axios'
import cookie from 'js-cookie'
import {useForm} from 'react-hook-form'
import ConnectWalletModal from './ConnectWalletModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import LogoImage from '../../public/img/logo.png';
import Some from '@material-ui/icons/Clear'




import * as utils from '../../utils';
import type * as Types from '../../types/index.d';



/**
 * Футер приложения
 * @param props
 * @returns
 */
function Footer(props: Types.AppProps): React.ReactElement {
  const { lang } = props;
  const {register, handleSubmit} = useForm()
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    utils.$.setStylesFooter();
  }, []);
  const onSubmit = async (data) => {
    const res = await axios.post('https://desolate-inlet-76011.herokuapp.com/report' ,{title: data.title, description: data.description, sender: cookie.get('id')})
    console.log(res.data)
    setOpen(false)
  }
  return (
    <div className="footer">
      <div className="footer__logo">
        <a href="index.html">
          <Image src={LogoImage} alt="logo" />
        </a>
      </div>
      <div className="footer__socials">
        <span>{lang.footer.weInSocial}</span>
        <div className="footer__socials-list">
          <div className="footer__socials-item">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <a href="https://facebook.com/"><i className="flaticon-facebook-logo" /></a>
          </div>
          <div className="footer__socials-item">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <a href="https://vk.com/"><i className="flaticon-vk" /></a>
          </div>
          <div className="footer__socials-item">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <a href="https://instagram.com/"><i className="flaticon-instagram" /></a>
          </div>
        </div>
      </div>

      <div className="footer__nav">
        <ul className="footer__nav-items">
          <li className="footer__nav-item">
            <a href="#" className="footer__nav-link">
              {lang.pageNames.about}
            </a>
          </li>
          <li className="footer__nav-item">
            <a href="#" className="footer__nav-link">
              {lang.footer.privacyPolicy}
            </a>
          </li>
          <li className="footer__nav-item">
            <a href="#" className="footer__nav-link open_terms">
              {lang.footer.termsOfUse}
            </a>
          </li>
          <li className="footer__nav-item">
            <a href='#' type='button' className="footer__nav-link open_error" onClick={handleOpen}>
              {lang.footer.reportAnError}
            </a>
          </li>
        </ul>
      </div>

      <div className="footer__copy">{lang.footer.allRightsReserved} &copy; 2021</div>

      <div className="footer__subscribe">
        <span>{lang.footer.subscribe}</span>
        <form className="footer__subscribe-form">
          <div className="subscribe__form-input">
            <input type="email" placeholder={lang.form.yourEmail} />
          </div>
          <div className="subscribe__form-button">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button type="submit">
              <i className="flaticon-send" />
            </button>
          </div>
        </form>
      </div>
      <ConnectWalletModal {...props} />
      <TermsOfServiceModal {...props} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
    <div className='popup__modal'>
      <Some className='close_cross' onClick={handleClose} style={{cursor: 'pointer'}}/>
          <div className="popup__heading heading">
        <h3>{lang.footer.reportAnError}</h3>
      </div>

      <form className="popup__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="popup__form-item">
          <input type="text" placeholder={lang.theme} {...register('title')} required/>
        </div>
        <div className="popup__form-item">
          <textarea placeholder={lang.message} {...register('description')} required/>
        </div>
        <div className="popup__button button">
          <button type='submit' className="fill">
            <span>{lang.send}</span>
          </button>
        </div>
      </form>
      
        </div>

      </Modal>
    </div>
  );
}

export default Footer;
