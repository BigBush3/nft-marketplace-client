/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

interface ButtonStyledProps {
  text1: string;
  fill1: boolean;
  text2: string;
  fill2: boolean;
  rate?: boolean;
}

/**
 * Двойный кнопки взаимно меняющие цвет при наведении на странице продукта
 * @param props
 * @returns
 */
export default function ButtonsStyled(props): React.ReactElement {
  const { text1, fill1, text2, fill2, rate, type } = props;
  const firstRef = useRef<any>();
  const secondRef = useRef<any>();
  const [firstFill, setFirstFill] = useState<boolean>(fill1);
  const [secondFill, setSecondFill] = useState<boolean>(fill2);

  useEffect(() => {
    /**
     * Для обеспечения переключения цветов как в верстке
     */
/*     firstRef.current.addEventListener('mouseenter', () => {
      setFirstFill(rate);
      setSecondFill(!rate);
    });
    firstRef.current.addEventListener('mouseleave', () => {
      setFirstFill(!rate);
      setSecondFill(rate);
    });
    secondRef.current.addEventListener('mouseenter', () => {
      setSecondFill(!rate);
      setFirstFill(rate);
    });
    secondRef.current.addEventListener('mouseleave', () => {
      setSecondFill(rate);
      setFirstFill(!rate);
    }); */
  }, []);
  return (
    <>
    {type === 'orderSell' ?       <a
        ref={secondRef}
        href="#"
        className={clsx(
          rate && 'buy open_checkout btn_blank',
          !fill2 && 'border btn_blank',
          secondFill && 'fill'
        )}>
        <span>{text2}</span>
      </a>:       <a
        ref={firstRef}
        href="#"
        className={clsx(
          rate && 'rate open_bid btn_blank',
          fill1 && !rate && 'btn_fill',
          firstFill && 'fill'
        )}>
        <span>{text1}</span>
      </a>}


    </>
  );
}