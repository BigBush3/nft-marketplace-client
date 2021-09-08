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
const defaultFaqItem: Types.AboutArticles = {
  ru: [{
    title: 'Что такое Nifty (NFT)?',
    description: `<p>NFT – аббревиатура от английского «non-fungible token» или невзаимозаменяемый токен – это уникальный цифровой предмет, чья оригинальность и собственность на который доказана при помощи технологии блокчейн.</p>

    <p>“NFT — это технология, которая окажет огромное влияние на все области нашей жизни. Потому что она позволяет оцифровать взаимодействие с любыми виртуальными и физическими товарами.” (Источник - https://vc.ru/crypto/214497-chto-takoe-nft)</p>`,
  },
  {
    title: 'Что значит невзаимозаменяемый?',
    description: `<p>Невзаимозаменяемый = уникальный, который невозможно формально заменить точно таким же.</p>

    <p>Например. Валюта — это классический пример взаимозаменяемого актива. Один доллар, один рубль или один биткоин можно с легкостью заменить одним долларом, одним рублем или одним биткоином.</p>
    
    <p>Каждый из NFT неповторим и существует в единственном экземпляре, его нельзя разделить, а вся информация о его авторе, покупателе и всех операциях с ним надежно хранится в блокчейне. Другими словами, NFT – это цифровой сертификат, прикрепленный к уникальному объекту. (Источник - https://www.golosameriki.com/a/nft-explained/5846708.html)</p>`,
  },{
    title: 'Как опубликовать NFT на платформе iNifty?',
    description: `<p>Команда iNifty всегда рада вашим заявкам!</p>

    <p>Пожалуйста, заполните контактную форму здесь.</p>`,
  },{
    title: 'Как подписаться на обновления iNifty?',
    description: `<p>Очень просто! Используйте эту ссылку.</p>`,
  },{
    title: 'Что значит печать верификации?',
    description: `<p>Печать верификации предоставляется NFT, которые были токенизированы при помощи новой патентированной системы iNifty глобального стандарта токенизации и верификации, при участии аккредитированных арт экспертов. Таким образом, артисты, коллекционеры, дилеры могут создавать и токенизировать предметы искусства, зарегистрированных на системе блокчейн.</p>`,
  },{
    title: 'Что такое Fine Art?',
    description: `<p>Раздел Fine Art представлен Сертифицированными Цифровыми Копиями физических произведений искусства, а также эксклюзивными цифровыми картинами, верифицированные аккредитованными экспертами искусства.</p>`,
  },{
    title: 'Что такое Marketplace?',
    description: `<p>Раздел Marketplace представлен уникальными NFT от известных деятелей, звезд и мировых брендов. Практически каждая NFT является эксклюзивной коллаборацией, выпущенную очень ограниченным тиражом.</p>`,
  },{
    title: 'Могу ли перепродать NFT, которую я купил на iNifty.io?',
    description: `<p>Да, iNifty предоставляет возможность вторичной продажи или аукциона.</p>

    <p>Перейдите на платформу iNifty.io, зайдите на свой кошелек и выберите NFT, которую вы хотите перепродать. Назначьте цену или выберите вариант аукциона. Отправьте транзакцию на подтверждение, воспользоваться функцией вторничной продажи. Как только транзакция будет одобрена, ваша NFT будет выложена на продажу в разделе Marketplace.</p>`,
  },{
    title: 'Как использовать iNifty?',
    description: `<p>Для того, чтобы создать аккаунт и делать ставки на NFT аукционе, прежде всего нужно подключить Ваш крипто кошелек. Крипто кошелек – это специальный софт, который позволяет управлять крипто активами. Как только вы установили кошелек, зарегистрируйтесь, перейдите на сайт inifty.io и подключите крипто кошелек. Как только Вы создадите аккаунт, нужно будет отправить ETH на Ваш кошелек, чтобы начать покупать/делать ставки на NFT.</p>`,
  }],
  en: [{
    title: 'What is a Nifty (NFT)?',
    description: `<p>A non-fungible token is a unit of data stored on a digital ledger, called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable. NFTs can be used to represent items such as photos, videos, audio, and other types of digital files. (Wiki)</p>`,
  },{
    title: 'Non-Fungible? What does that mean?',
    description: `<p> A non-fungible asset refers to an item that is not interchangeable. “Non-fungible” more or less means that it's unique and can't be replaced with something else.</p>`,
  },{
    title: 'How do I publish an NFT with iNifty?',
    description: `<p>The iNifty Team looking forward to hearing from you!</p>
    <p>Please fill out our contact form HERE</p>`,
  },{
    title: 'How do I sign up for iNifty?',
    description: `<p>Please use the signup link here.</p>
    <p>If you're having trouble signing into your AOL account, don't give up just yet! Submit a request here on the Help Center.</p>`,
  },{
    title: 'What does verification badge mean?',
    description: `<p>Verified badges are granted to NFTs that were minted using iNifty new patent-pending global standard for tokenization and verification by accredited art appraisers and experts, enabling creators, collectors and dealers to create and tokenize art pieces registered on the blockchain. </p>`,
  },{
    title: 'What is Fine Art?',
    description: `<p>Fine Art section consists of Сertified Digital Representation of Physical Fine Art Masterpieces and Exclusive Digital Artworks, verified by accredited art experts and appraisers.</p>`,
  },{
    title: 'What is Marketplace?',
    description: `<p>Marketplace section displays unique NFTs from celebrities and world known brands. Most of them are one of a kind collaborations, limited edition digital collectibles. </p>`,
  },{
    title: 'Can I resale an NFT that I have bought on iNifty.io?',
    description: `<p>Yes you can.</p>
    <p>Go to inifty.io, go to your wallet and click on a NFT in it you wish to resale. Pick a price or choose the auction option. Send the transaction to approve your iNifty account to sell the NFT for you.
    Once the transaction has been confirmed, your NFT will be posted for sale.</p>`,
  },{
    title: 'How to use iNifty?',
    description: `<p>To create an account and bid on NFTs you first need to connect your wallet. 
    A 'wallet' is software that you can use to manage your art and other tokens on Ethereum.
    Once your crypto wallet is installed, log in, then go to inifty.io and "Sign Up" using your ETH wallet address. Once you've made the account you just need to send some ETH to your wallet to begin bidding on artworks.</p>`,
  },]
}

/**
 * Получение элементов FAQ
 */
export const getFAQItems = (locale: keyof typeof defaultFaqItem): Types.Article[] => {
  return defaultFaqItem[locale]
};

const aboutArticles: Types.AboutArticles = {
  ru: [
    {
      title: '',
      description: `<p>iNifty – это международный NFT маркетплейс, публикующий только эксклюзивные NFT.</p>
      <p>Наша миссия – показать важность и значимость NFT всему миру.</p>
      `,
    },
    {
      title: '',
      description: `<p>iNifty фокусируется на редких коллекционных цифровых активах от известных артистов и звезд мировой величины, а также на оцифрованных физических предметах искусства. Эти категории – уже стали активами мировой цифровой экономики и будущим коллекционирования.</p>`,
    },
    {
      title:
        '',
      description: `<p>iNifty твердо верит в новую экономическую модель для индустрии развлечений и мира искусства. Модель, которая обьединяет Артистов, Индустрии, Страны и Регионы.</p>

      <p>Наша цель – взять все преимущества виртуального мира и соединить их с реальностью.</p>`,
    },
    {
      title: '',
      description: `<p>Больше искусства в шоу бизнес</p>

      <p>Больше шоу бизнеса – в искусство.</p>`,
    },
  ],
  en: [
    {
      title:
        '',
      description: `<p>iNifty - is curated NFT marketplace with exclusive and selective NFTs only.</p>
      <p>Our mission is to bring value to the emerging NFT market.</p>`,
    },
    {
      title: '',
      description: `<p>iNifty concentrates on rare digital collectibles from celebrities and tokenization of real art.
      These categories represent the assets for the whole virtual economy and the future of collecting.</p>`,
    },
    {
      title:
        '',
      description: `<p>iNifty team is very passionate about a new global economy model for entertainment business - connecting artists, industries and regions.</p> 
      <p>Our goal is to take all the advantages of digital dimensions and bridge them with physical world.</p>`,
    },
    {
      title: '',
      description: `<p>More art in entertainment</p>
      <p>More entertainment in art</p>`,
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
