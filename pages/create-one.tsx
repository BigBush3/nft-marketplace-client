import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type * as Types from '../types/index.d';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import CreateForm from '../components/global/CreateForm';

interface CreateOneProps {
  app?: Types.AppProps;
}

/**
 * Страница создания одного экземпляра
 * @param props
 * @returns
 */
function CreateOne(props: CreateOneProps): React.ReactElement {
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
          <h1>{lang.pageNames.createOne}</h1>
        </div>
        <CreateForm app={app} createMany={false} />
        <Footer {...app} />
      </div>
    </Theme>
  );
}

export default CreateOne;
