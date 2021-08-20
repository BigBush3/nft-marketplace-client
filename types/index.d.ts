import type Language from '../locales/index.d';

export { Language };

/**
 * Тип возвращаемого значения промиса
 */
export type PromiseType<T> = T extends Promise<infer U> ? U : T;

/**
 * Свойства приложения
 */
export interface AppProps {
  lang: Language;
}

/**
 * Данные элемента списка истории владения
 */
export interface OwnerProps {
  id: number;
  author: boolean;
  image: string;
  name: string;
}

/**
 * Данные элемента товаров на главной
 */
export interface ItemProps {
  id: number;
  file: string;
  title: string;
  author: string;
  views: number;
  favoriteMe: boolean;
  likeMe: boolean;
  likes: number;
  price: number;
  owners: OwnerProps[];
  items: ItemProps[];
  isCollection: boolean;
  mark: boolean;
}

/**
 * Ключ языковой локали
 */
export type LangValue = 'en' | 'ru';

/**
 * Баннер с названием и описанием
 */
export interface Banner {
  title: string;
  description: string;
  image: string;
}

// Элементы списка артистов на Fine Art
interface ArtistChild {
  title: string;
  link: string;
  image: string;
  mark: boolean;
}

/**
 * Элемент артиста из списка на fineart и marketplace
 */
export interface ArtistItemData {
  name: string;
  children: ArtistChild[];
}

/**
 * Элемент вопроса и ответа для FAQ
 */
export interface FAQItem {
  title: string;
  description: string;
}

/**
 * Элемент статьи раздела О нас
 */
export interface Article {
  title: string;
  description: string;
}

/**
 * Объект статей раздела О нас
 */
export interface AboutArticles {
  ru: Article[];
  en: Article[];
}
