import * as d from './data';
/**
 * Класс реализующий методы запросов на сервер
 */
class Request {
  /**
   * Получение элементов Fine Art
   * @param params
   * @returns
   */
  public async getFineArt(params: { rounds: number }) {
    return d.getItems(params.rounds);
  }

  /**
   * Получение популярных элементов
   * @param params
   * @returns
   */
  public async getPopular(params: { rounds: number }) {
    return d.getItems(params.rounds);
  }

  /**
   * Получение элементов Маркетплейс
   * @param params
   * @returns
   */
  public async getMarketplace(params: { rounds: number }) {
    return d.getItems(params.rounds);
  }

  /**
   * Получение элементов баннера главной страницы
   * @param params
   * @returns
   */
  public async getHomeBanner(params: { locale: string }) {
    return d.getBannerItems(params.locale);
  }

  /**
   * Получение списка артистов с суб полями для fine art
   * @param params
   * @returns
   */
  public async getArtistList() {
    return d.getArtistList();
  }
}

export default new Request();
