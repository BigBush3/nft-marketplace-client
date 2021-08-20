import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type * as Types from '../types/index.d';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import CreateForm from '../components/global/CreateForm';

interface CreateManyProps {
  app?: Types.AppProps;
}

/**
 * Страница создания нескольких екземпляров
 * @param props
 * @returns
 */
function CreateMany(props: CreateManyProps): React.ReactElement {
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
          <h1>{lang.pageNames.createMany}</h1>
        </div>
        <CreateForm app={app} createMany={true} />
        <Footer {...app} />
      </div>
    </Theme>
  );
}

export default CreateMany;
