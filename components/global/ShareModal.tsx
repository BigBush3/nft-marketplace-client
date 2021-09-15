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
      <div className='share_text'>
          <p className="share_paragraph">{app.lang.shareModalText}</p>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <div>
             <FacebookShareButton  url={url}><FacebookIcon style={{width: '50px', height: '50px', marginRight: '20px'}}/></FacebookShareButton>
             <p style={{fontSize: '10px'}}>Facebook</p>
          </div>
          <div>
             <TelegramShareButton url={`https://t.me/share/url?url=${url}&text=${text}`}><TelegramIcon style={{width: '50px', height: '50px', marginRight:'20px'}}/></TelegramShareButton> 
             <p style={{fontSize: '10px'}}>Telegram</p>
          </div>
          <div>
             <TwitterShareButton url={url}><TwitterIcon style={{width: '50px', height: '50px'}}/></TwitterShareButton> 
             <p style={{fontSize: '10px'}}>Twitter</p>
          </div>
            
      </div>
        
    </div>
</Modal>
  );
}

export default ShareModal;
