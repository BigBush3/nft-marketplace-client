/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';

const useStyles = makeStyles({
  select: {
    background: 'inherit',
    borderWidth: 0,
    font: ' 400 13px OpenSans',
  },
});

interface PlaceBidModalProps {
  app: Types.AppProps;
}

/**
 * Модальное окно сделать ставку
 * @param props
 * @returns
 */
export default function PlaceBidModal(props: PlaceBidModalProps): React.ReactElement {
  const { app } = props;
  const { lang } = app;
  const classes = useStyles();
  const selectRef = useRef<any>();
  const [type, setType] = useState<number>(1);
  function changeSelect(e: any): void {
    setType(e.target.value);
  }
  useEffect(() => {
    utils.$.setStylesPlaceBid();
    selectRef.current.addEventListener('change', changeSelect);
  }, []);
  return (
    <div className="popup__bid popup mfp-hide">
      <div className="popup__heading heading">
        <h3>{lang.placeBid}</h3>
      </div>

      <div className="popup__sub">
        You are about to place a bid for <span>Moonset</span> by <span>Definftz</span>
      </div>

      <div className="popup__bid-form">
        <div className="bid-form__header">
          <div className="bid-form__item">
            <input type="text" placeholder="Enter bid" />
            <div className="bid-form__cover">
              <div className="info">
                <div className="info">
                  <div className="info-icon">
                    <i className="flaticon-information" />
                  </div>
                </div>
              </div>
              <select ref={selectRef} className={classes.select}>
                <option value={1}>WETH1</option>
                <option value={2}>WETH2</option>
                <option value={3}>WETH3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bid-form__calc">
          <div className="form__calc-item">
            <div className="calc-item__title">Your balance</div>
            <div className="calc-item__value">0 ETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">
              Your bidding balance
              <div className="info">
                <div className="info-icon">
                  <i className="flaticon-information" />
                </div>
              </div>
            </div>
            <div className="calc-item__value">0 WETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Service free</div>
            <div className="calc-item__value">0 WETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Total bid amount</div>
            <div className="calc-item__value">0 WETH</div>
          </div>
        </div>

        <div className="popup__button button">
          <a href="#" className="fill">
            <span>{lang.placeBid}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
