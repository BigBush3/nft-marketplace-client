import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type * as Types from '../types';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import UpdateForm from '../components/global/updateCollection';
import axios from 'axios'

interface CreateOneProps {
  app?: Types.AppProps;
  data?: any;
}

/**
 * Страница создания одного экземпляра
 * @param props
 * @returns
 */
function UpdateCollection(props: CreateOneProps): React.ReactElement {
  const { app, data } = props;
  const { lang } = app;
  console.log(data)

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="heading center">
          <h1>Update collection</h1>
        </div>
        <UpdateForm app={app} createMany={false} item={data} />
        <Footer {...app} />
      </div>
    </Theme>
  );
}

UpdateCollection.getInitialProps = async ({query}) => {
  const response = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/collection/${query.id}`)
  return {data: response.data}
};

export default UpdateCollection;
