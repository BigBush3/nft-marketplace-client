import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';

/**
 * Элемент вопроса и открывающегося ответа
 * @param props
 * @returns
 */
export default function FAQItem(props: Types.FAQItem): React.ReactElement {
  const { title, description } = props;
  const [active, setActive] = useState<boolean>(false);
  const lR = useRef<any>();
  return (
    <div className="faq_article_dropdown_li">
      <span
        className={clsx('icon', 'icon-arrow_white', active && 'active')}
        role="button"
        onClick={(e: any) => {
          if (e.target?.getAttribute('class')?.match(/icon-arrow_white/)) {
            setActive(!active);
            // Jquery для переноса анимации открытия
            $(lR.current).slideToggle(500);
          }
        }}>
        {title}
      </span>
      <div
        className="faq_article_dropdown_info"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: description }}
        ref={lR}
      />
    </div>
  );
}
