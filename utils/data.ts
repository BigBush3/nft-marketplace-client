import type * as Types from '../types/index.d';
import * as c from './config';

const { SLIDER_PRODUCTS_PART } = c;

const artistKeys = [0, 1, 2, 3, 4];
const getArtists = (itemId): Types.OwnerProps[] => {
  return artistKeys.map((item) => {
    return {
      id: item,
      author: item === 0,
      name: `Пользователь ${itemId}_${item}`,
      image: '',
    };
  });
};

/**
 * Получение предварительных результатов списка продуктов
 * @param rounds
 * @returns
 */
export const getItems = (rounds: number): Types.ItemProps[] => {
  const itemKeys = [];
  for (let i = 0; i < rounds; i++) {
    itemKeys.push(i);
  }
  return itemKeys.map((item, index) => {
    return {
      id: item,
      file: '/img/items/item-1.jpg',
      title: `Название ${item}`,
      author: `Имя артиста ${item}`,
      views: Math.ceil(Math.random() * (5000 - 100) + 100),
      favoriteMe: false,
      likeMe: false,
      likes: Math.ceil(Math.random() * (200 - 10) + 10),
      price: Math.ceil((Math.random() * (1000 - 10) + 10) * 100) / 100,
      owners: getArtists(item),
      mark: index % 3 === 0,
      isCollection: index % 2 === 0,
      items:
        index % 2 === 0
          ? (() => {
              const count = parseInt((Math.random() * 6).toFixed(0), 10);
              const result: Types.ItemProps[] = [];
              for (let n = 0; n <= count; n++) {
                result.push({
                  id: item,
                  file: '/img/items/item-1.jpg',
                  title: `Название ${n}`,
                  author: `Имя артиста ${item}`,
                  views: Math.ceil(Math.random() * (5000 - 100) + 100),
                  favoriteMe: false,
                  likeMe: false,
                  mark: index % 3 === 0,
                  isCollection: false,
                  likes: Math.ceil(Math.random() * (200 - 10) + 10),
                  price: Math.ceil((Math.random() * (1000 - 10) + 10) * 100) / 100,
                  owners: getArtists(item),
                  items: [],
                });
              }
              return result;
            })()
          : [],
    };
  });
};

interface DefaultBanner {
  ru: Types.Banner;
  en: Types.Banner;
}

const defautlBanner: DefaultBanner = {
  ru: {
    title: 'Заголовок баннера',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
      Risus commodo viverra maecenas accumsan lacus vel facilisis.`,
    image: '/img/webp/bunner.webp',
  },
  en: {
    title: 'Заголовок баннера',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
      Risus commodo viverra maecenas accumsan lacus vel facilisis.`,
    image: '/img/webp/bunner.webp',
  },
};

const bannerKeys = [0, 1];
/**
 * Получение баннеров
 * @param locale
 * @returns
 */
export const getBannerItems = (locale: string): Types.Banner[] => {
  return bannerKeys.map((item, index) => {
    return {
      title: `${defautlBanner[locale].title} ${index}`,
      description: `${defautlBanner[locale].description} ${index}`,
      image: defautlBanner[locale].image,
    };
  });
};

/**
 * Получение предварительного списка артистов
 */
export const getArtistList = (): Types.ArtistItemData[] => {
  const result: Types.ArtistItemData[] = [];
  const chKeys = [0, 1, 2, 3, 4, 5, 6, 7];
  for (let i = 0; i < SLIDER_PRODUCTS_PART * 4; i++) {
    result.push({
      name: `Artist Name ${i}`,
      children: chKeys.map((item) => {
        return {
          id: item,
          title: `Artist Child Link ${i}_${item}`,
          link: `#c=${item}&i=0`,
          image: '/img/thumb.png',
          mark: i % 3 === 0,
        };
      }),
    });
  }
  return result;
};

interface DefaultFAQItem {
  ru: Types.FAQItem;
  en: Types.FAQItem;
}
const defaultFaqItem: DefaultFAQItem = {
  ru: {
    title: 'Вопрос',
    description: `<p>Длинный ответ с поддержкой HTML <a href="?">Тестовая ссылка</a></p>`,
  },
  en: {
    title: 'Ask',
    description: `<p>Long ansver with HTML support <a href="?">Test link</a></p>`,
  }
}

/**
 * Получение элементов FAQ
 */
export const getFAQItems = (locale: keyof typeof defaultFaqItem): Types.FAQItem[] => {
  const faqKeys = [0, 1, 2, 3, 4, 5, 6];
  return faqKeys.map((item) => {
    return {
      title: `${defaultFaqItem[locale].title} ${item}`,
      description: `${defaultFaqItem[locale].description}`,
    };
  });
};

const aboutArticles: Types.AboutArticles = {
  ru: [
    {
      title: 'Nifty Gateway был основан с очень простой миссией - сделать Nifties доступными для всех.',
      description: `<p>Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus.</p>
      <p>Lorem, ipsum dolor sit amet, consectetur adipisicing elit. Doloribus facilis cumque, unde, excepturi dolore corporis officiis quisquam autem, quibusdam deleniti quae suscipit reprehenderit laborum dolor quidem dolores! Consequatur ratione, sit.</p>`,
    },
    {
      title: 'Как работает Nifty Gateway?',
      description: `
      Nifty Gateway объединяется с ведущими художниками и брендами для создания коллекций ограниченного выпуска высококачественных Nifties, доступных исключительно на нашей платформе.Мы объединились с такими людьми, как всемирно известный художник Майкл Каган. Подайте заявку, чтобы творить вместе с нами здесь.
      Каждая коллекция будет открыта в определенное время (выпадение) и будет доступна только в течение ограниченного времени.
      
      Мы будем стремиться делать новые капли примерно раз в 3 недели . После того, как начальная коллекция для коллекции закрывается или распродается , вы сможете получить только изящные вещи из этой коллекции на торговой площадке.
      
      Nifty Gateway также является централизованной торговой площадкой в ​​долларах США для покупки и продажи Nifties .
      
      Nifty Gateway позволяет отображать свои Nifties , а также выводить их на внешние кошельки или вносить Nifties из внешних кошельков в свою коллекцию.
      `,
    },
    {
      title:
        'Nifty Gateway был основан с очень простой миссией - сделать Nifties доступными для всех.',
      description: `<p>Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus.</p>
      <p>Lorem, ipsum dolor sit amet, consectetur adipisicing elit. Doloribus facilis cumque, unde, excepturi dolore corporis officiis quisquam autem, quibusdam deleniti quae suscipit reprehenderit laborum dolor quidem dolores! Consequatur ratione, sit.</p>`,
    },
    {
      title: 'Как работает Nifty Gateway?',
      description: `<p>Nifty Gateway объединяется с ведущими художниками и брендами для создания коллекций ограниченного выпуска высококачественных Nifties, доступных исключительно на нашей платформе.Мы объединились с такими людьми, как всемирно известный художник Майкл Каган. Подайте заявку, чтобы творить вместе с нами здесь.</p>
      <p>Каждая коллекция будет открыта в определенное время (выпадение) и будет доступна только в течение ограниченного времени.</p>
      <p>Мы будем стремиться делать новые капли примерно раз в 3 недели . После того, как начальная коллекция для коллекции закрывается или распродается , вы сможете получить только изящные вещи из этой коллекции на торговой площадке.</p>
      <p>Nifty Gateway также является централизованной торговой площадкой в ​​долларах США для покупки и продажи Nifties .</p>
      <p>Nifty Gateway позволяет отображать свои Nifties , а также выводить их на внешние кошельки или вносить Nifties из внешних кошельков в свою коллекцию.</p>`,
    },
  ],
  en: [
    {
      title:
        'EN Nifty Gateway был основан с очень простой миссией - сделать Nifties доступными для всех.',
      description: `EN <p>Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus.</p>
      <p>Lorem, ipsum dolor sit amet, consectetur adipisicing elit. Doloribus facilis cumque, unde, excepturi dolore corporis officiis quisquam autem, quibusdam deleniti quae suscipit reprehenderit laborum dolor quidem dolores! Consequatur ratione, sit.</p>`,
    },
    {
      title: 'EN Как работает Nifty Gateway?',
      description: `EN <p>Nifty Gateway объединяется с ведущими художниками и брендами для создания коллекций ограниченного выпуска высококачественных Nifties, доступных исключительно на нашей платформе.Мы объединились с такими людьми, как всемирно известный художник Майкл Каган. Подайте заявку, чтобы творить вместе с нами здесь.</p>
      <p>Каждая коллекция будет открыта в определенное время (выпадение) и будет доступна только в течение ограниченного времени.</p>
      <p>Мы будем стремиться делать новые капли примерно раз в 3 недели . После того, как начальная коллекция для коллекции закрывается или распродается , вы сможете получить только изящные вещи из этой коллекции на торговой площадке.</p>
      <p>Nifty Gateway также является централизованной торговой площадкой в ​​долларах США для покупки и продажи Nifties .</p>
      <p>Nifty Gateway позволяет отображать свои Nifties , а также выводить их на внешние кошельки или вносить Nifties из внешних кошельков в свою коллекцию.</p>.
      `,
    },
    {
      title:
        'EN Nifty Gateway был основан с очень простой миссией - сделать Nifties доступными для всех.',
      description: `EN <p>Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus. Lorem ipsum dolor sit amet, consectetur, adipisicing elit. Necessitatibus maiores adipisci magnam, ab! Optio eveniet modi eos tenetur saepe laboriosam iusto non quasi tempora cumque, eius rerum eaque omnis repellendus.</p>
      <p>Lorem, ipsum dolor sit amet, consectetur adipisicing elit. Doloribus facilis cumque, unde, excepturi dolore corporis officiis quisquam autem, quibusdam deleniti quae suscipit reprehenderit laborum dolor quidem dolores! Consequatur ratione, sit.</p>`,
    },
    {
      title: 'EN Как работает Nifty Gateway?',
      description: `EN <p>Nifty Gateway объединяется с ведущими художниками и брендами для создания коллекций ограниченного выпуска высококачественных Nifties, доступных исключительно на нашей платформе.Мы объединились с такими людьми, как всемирно известный художник Майкл Каган. Подайте заявку, чтобы творить вместе с нами здесь.</p>
      <p>Каждая коллекция будет открыта в определенное время (выпадение) и будет доступна только в течение ограниченного времени.</p>
      <p>Мы будем стремиться делать новые капли примерно раз в 3 недели . После того, как начальная коллекция для коллекции закрывается или распродается , вы сможете получить только изящные вещи из этой коллекции на торговой площадке.</p>
      <p>Nifty Gateway также является централизованной торговой площадкой в ​​долларах США для покупки и продажи Nifties .</p>
      <p>Nifty Gateway позволяет отображать свои Nifties , а также выводить их на внешние кошельки или вносить Nifties из внешних кошельков в свою коллекцию.</p>`,
    },
  ],
};

/**
 * Получение статей О нас
 * @param locale
 * @returns
 */
export const getAboutArticles = (locale: string): Types.Article[] => {
  return aboutArticles[locale];
};
