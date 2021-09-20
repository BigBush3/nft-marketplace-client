import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type * as Types from '../types';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import UpdateForm from '../components/global/updateForm';

interface CreateOneProps {
  app?: Types.AppProps;
}

/**
 * Страница создания одного экземпляра
 * @param props
 * @returns
 */
function UpdateOne(props: CreateOneProps): React.ReactElement {
  const { app } = props;
  const { lang } = app;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="heading center">
          <h1>{lang.pageNames.resell}</h1>
        </div>
        <UpdateForm app={app} createMany={false} />
        <Footer {...app} />
      </div>
    </Theme>
  );
}

export default UpdateOne;
