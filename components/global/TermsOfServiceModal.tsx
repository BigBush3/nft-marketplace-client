/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import type * as Types from '../../types/index.d';

function TermsOfServiceModal(props: Types.AppProps): React.ReactElement {
  const { lang } = props;
  return (
    <div className="popup__terms popup mfp-hide">
      <div className="popup__heading heading">
        <h3>{lang.modal.termsOfService.title}</h3>
      </div>
      <div
        className="popup__text"
        dangerouslySetInnerHTML={{ __html: lang.modal.termsOfService.description }}
      />
      <div className="popup__terms-check">
        <div className="terms-check__item">
          <input type="checkbox" id="age" />
          <label htmlFor="age">{lang.modal.termsOfService.iHaveOld}</label>
        </div>
        <div className="terms-check__item">
          <input type="checkbox" id="police" />
          <label htmlFor="police">{lang.modal.termsOfService.iAccept}</label>
        </div>
      </div>

      <div className="popup__button button">
        <a href="#" className="fill">
          <span>{lang.modal.termsOfService.proceed}</span>
        </a>
      </div>
    </div>
  );
}

export default TermsOfServiceModal;
