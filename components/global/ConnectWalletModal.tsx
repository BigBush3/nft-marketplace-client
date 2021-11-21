/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
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
  const size = useWindowSize()

  useEffect(() => {
    /** * */
  }, []);
  return (
    <div className="popup__connect popup mfp-hide">
      <div className="popup__heading heading">
        <h3>{lang.modal.connectToAWalet}</h3>
      </div>
      <div className="popup__connect-items">
        <div className="popup__connect-item" style={{cursor: 'pointer'}} id="metamask">
          <div className="connect-item__title">{WALLETS.metamask}</div>
          <div className="connect-item__logo">
            <Image src={Metamask} alt="img" />
          </div>
        </div>
        {size.width > 400 ?         <><div className="popup__connect-item" style={{cursor: 'pointer'}} id="mew">
          <div className="connect-item__title">{WALLETS.mew}</div>
          <div className="connect-item__logo">
            <Image src={MEW} alt="img" />
          </div>
        </div>        <div className="popup__connect-item" style={{cursor: 'pointer'}} id="coinbase">
          <div className="connect-item__title">{WALLETS.coinBase}</div>
          <div className="connect-item__logo">
            <Image src={Coinbase} alt="img" />
          </div>
        </div></> : null}


      </div>
    </div>
  );
}
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      //@ts-ignore
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default ConnectWalletModal;
