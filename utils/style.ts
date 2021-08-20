/**
 * Здесь набор методов для установки стилей
 */
import type { Settings } from 'react-slick';

import * as c from './config';

const { SLIDER_PRODUCTS_PART } = c;

export const cyanColor = '#1cc9cf';

/**
 * Размещение стрелок баннера горизонтально
 */
export const setStylesBanner = (): void => {
  const sD = document.querySelector('.slick-dots');
  sD.removeAttribute('style');
};

/**
 * Настройки слайдера баннер
 */
export const bannerSettings: Settings = {
  
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
  autoplay: true,
  autoplaySpeed: 5000,
};

/**
 * Настройки слайдера Fine Art и Popular на главной
 */
export const sliderSettings: Settings = {
  
  slidesToShow: SLIDER_PRODUCTS_PART,
  slidesToScroll: SLIDER_PRODUCTS_PART,
  arrows: true,
  dots: false,
  infinite: false,
  responsive: [
    {
      breakpoint: 1231,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 961,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

/**
 * Настройки слайдера Галерея на странице Fine Art
 */
export const galerySliderSettings: Settings = {
  slidesToShow: 11,
  slidesToScroll: 11,
  infinite: false,
  arrows: true,
  responsive: [
    {
      breakpoint: 1441,
      settings: {
        slidesToShow: 9,
        slidesToScroll: 9,
      },
    },
    {
      breakpoint: 1231,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 7,
      },
    },
    {
      breakpoint: 961,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
    {
      breakpoint: 577,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 381,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

/**
 * Стилизация датыпикера
 */
export function setStylesDatepicker(): void {
  $(() => {
    // @ts-ignore
    $('.datepicker').datepicker();
  });
}

/**
 * Стилизация открытия списка авторов
 */
export function setStylesArtistList(): void {
  $('.artist .aside__heading').on('click', () => {
    $(this).addClass('active');
    $('.artist, .artist__list').addClass('active');
  });

  $('.artist__list-close').on('click', () => {
    $('.artist').removeClass('active');
    $('.artist__list').removeClass('active');
  });
}

/**
 * Настройки слайдера на странице Fine Art
 */
export const fineArtSliderSettings: Settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: false,
  arrows: true,
  
  responsive: [
    {
      breakpoint: 961,
      settings: {
        vertical: false,
        centerPadding: '0',
      },
    },
    {
      breakpoint: 700,
      settings: {
        vertical: false,
        centerPadding: '0',
        slidesToShow: 1,
      },
    },
  ],
};

/**
 * Для компонента футер
 */
export function setStylesFooter(): void {
  // По кошельку
  $(document).ready(() => {
    // @ts-ignore
    $('a.open_connect').magnificPopup({
      items: [
        {
          src: '.popup__connect',
          type: 'inline',
        },
      ],
    });
    // @ts-ignore
    $('a.open_terms').magnificPopup({
      items: [
        {
          src: '.popup__terms',
          type: 'inline',
        },
      ],
    });
    // @ts-ignore
    $('a.open_error').magnificPopup({
      items: [
        {
          src: '.popup__error',
          type: 'inline',
        },
      ],
    });
    // @ts-ignore
    $('.product__image-resize').magnificPopup({
      type: 'image',
    });
  });
}

/**
 * Установка стилей для модального окна Купить
 */
export function setStylesCheckout(): void {
  // @ts-ignore
  $('a.open_checkout').magnificPopup({
    items: [
      {
        src: '.popup__checkout',
        type: 'inline',
      },
    ],
  });
}

/**
 * Установка стилей для модального окна Сделать ставку
 */
export function setStylesPlaceBid(): void {
  // @ts-ignore
  $('a.open_bid').magnificPopup({
    items: [
      {
        src: '.popup__bid',
        type: 'inline',
      },
    ],
  });
}

/**
 * Для верхнего апп бара
 */
export function setStylesHeader(): void {
  // Мобильное меню
  $('.header__burger').on('click', () => {
    $('html').toggleClass('hidden');
    $('.header__block-wrap').slideToggle(250).toggleClass('active');
  });
  // Меню пользователя
  $('.header__user').on('click', () => {
    $('.header__user-toolbar').slideToggle(0);
  });
}
