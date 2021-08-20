import React , {useState}from 'react';
import { useForm }from 'react-hook-form'
import cookie from 'js-cookie'
import axios from 'axios'
import router from 'next/router';

import type * as Types from '../../types/index.d';

/**
 * Модальное окно сообщения об ошибке
 * @param props
 * @returns
 */
function ReportModal(props): React.ReactElement {
  const { lang } = props;
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async(e) => {
    const response = await axios.post('https://desolate-inlet-76011.herokuapp.com/report', {title, description, sender: cookie.get('id')})
    console.log(response.data)
    router.reload()
  }
  return (
    <div className="popup__error popup mfp-hide">
      <div className="popup__heading heading">
        <h3>{lang.footer.reportAnError}</h3>
      </div>

      <form className="popup__form">
        <div className="popup__form-item">
          <input type="text" placeholder={lang.theme} onChange={(e) => setTitle(e.target.value)} required/>
        </div>
        <div className="popup__form-item">
          <textarea placeholder={lang.message} onChange={(e)=> setDescription(e.target.value)} required/>
        </div>
        <div className="popup__button button">
          <button type='submit' className="fill" onClick={handleSubmit}>
            <span>{lang.send}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportModal;
