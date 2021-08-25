/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';

interface CheckoutModalProps {
  app: Types.AppProps;
}

/**
 * Модальное окно Купить
 * @param props
 * @returns
 */
export default function CheckoutModal(props): React.ReactElement {
  const { app, data } = props;
  const { lang } = app;
  useEffect(() => {
    utils.$.setStylesCheckout();
  }, []);
  return (
    <div className="popup__checkout popup mfp-hide">
      <div className="popup__heading heading">
        <h3>Checkout</h3>
      </div>

      <div className="popup__sub">
        You are about to purchase <span>{data.title}</span> from <span>{data.owner.name}</span>
      </div>

      <div className="popup__bid-form">
        <div className="bid-form__header">
          <div className="bid-form__item">
            <input type="text" value="0,5" disabled={true} />
            <span>ETH</span>
          </div>
        </div>

        <div className="bid-form__calc">
          <div className="form__calc-item">
            <div className="calc-item__title">Your balance</div>
            <div className="calc-item__value">0 ETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Service free</div>
            <div className="calc-item__value">0.013 ETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">You will pay</div>
            <div className="calc-item__value">0.513 ETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Gas Fee</div>
            <div className="calc-item__value">0.513 ETH</div>
          </div>
        </div>

        <div className="popup__button button">
          <a href="#" className="fill">
            <span>Proceed to payment</span>
          </a>
          <a href="#" className="cancel">
            <span>Cancel</span>
          </a>
        </div>
      </div>
    </div>
  );
}