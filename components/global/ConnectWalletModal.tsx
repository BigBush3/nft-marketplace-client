/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import Image from 'next/image';
import Web3 from 'web3';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import Metamask from '../../public/img/metamask.png';
import MEW from '../../public/img/mew.png';
import Coinbase from '../../public/img/coinbase.png';

const web3 = new Web3();

const { WALLETS } = utils.c;

/**
 * Модальное окно подключения кошелька
 * из-за Magnific Popup нельзя обработать компонент контролируемо
 * поэтому логика реализована в components/global/Header.tsx
 * @param props
 * @returns
 */
function ConnectWalletModal(props: Types.AppProps): React.ReactElement {
  const { lang } = props;

  useEffect(() => {
    /** * */
  }, []);
  return (
    <div className="popup__connect popup mfp-hide">
      <div className="popup__heading heading">
        <h3>{lang.modal.connectToAWalet}</h3>
      </div>
      <div
        className="popup__text"
        dangerouslySetInnerHTML={{ __html: lang.modal.connectToAWalletDesc }}
      />
      <div className="popup__connect-items">
        <div className="popup__connect-item" id="metamask">
          <div className="connect-item__title">{WALLETS.metamask}</div>
          <div className="connect-item__logo">
            <Image src={Metamask} alt="img" />
          </div>
        </div>
        <div className="popup__connect-item" id="mew">
          <div className="connect-item__title">{WALLETS.mew}</div>
          <div className="connect-item__logo">
            <Image src={MEW} alt="img" />
          </div>
        </div>
        <div className="popup__connect-item" id="coinbase">
          <div className="connect-item__title">{WALLETS.coinBase}</div>
          <div className="connect-item__logo">
            <Image src={Coinbase} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectWalletModal;
