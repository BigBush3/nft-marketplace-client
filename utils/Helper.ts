/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import type * as Types from '../types/index.d';
/**
 * Класс реализующий вспомогательные методы
 */

interface GlobalLang {
  [key: string]: Types.Language;
}

class Helper {
  lang: GlobalLang = {};

  /**
   * Безопасно получает объект переменных локали
   * @param locale значение локали
   */
  public getLang = (locale: string): Types.Language => {
    // eslint-disable-next-line no-unneeded-ternary
    const loc = locale ? locale : 'ru';
    if (!this.lang[loc]) {
      // eslint-disable-next-line import/no-dynamic-require
      this.lang[loc] = require(`../locales/${loc}/lang`).default;
    }
    return this.lang[loc];
  };

  /**
   * Удаление сласса hidden из html после 
   * перехода по ссылке из мобильного меню
   */
  public unHiddenHtml() {
    $('html').toggleClass('hidden');
  }

  /**
   * проверяет что код исполняется в браузере, а не на сервере
   * @returns
   */
  public isApp(): boolean {
    return typeof window !== 'undefined';
  }
}

export default new Helper();
