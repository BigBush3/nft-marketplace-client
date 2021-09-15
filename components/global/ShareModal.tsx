import React , {useState, useEffect}from 'react';
import { useForm }from 'react-hook-form'
import cookie from 'js-cookie'
import axios from 'axios'
import Modal from '@material-ui/core/Modal';
import {FacebookShareButton, TelegramShareButton, TwitterShareButton} from 'react-share'
import FacebookIcon from '@material-ui/icons/Facebook';
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';

import router from 'next/router';

import type * as Types from '../../types/index.d';

/**
 * Модальное окно сообщения об ошибке
 * @param props
 * @returns
 */
function ShareModal(props): React.ReactElement {
  const { lang, handleClose, open, data, app } = props;
  const text = 'check out this awesome nft!'
  const [url, setUrl] = useState('')
  useEffect(() => {
      setUrl(window.location.href)
  }, [])
  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
  ><div className='popup'>
        <FacebookShareButton url={url}><FacebookIcon/></FacebookShareButton> <TelegramShareButton url={`https://t.me/share/url?url=${url}&text=${text}`}><TelegramIcon/></TelegramShareButton> <TwitterShareButton url={url}><TwitterIcon/></TwitterShareButton>
    </div>
</Modal>
  );
}

export default ShareModal;
