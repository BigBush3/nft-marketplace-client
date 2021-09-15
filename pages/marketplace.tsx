import React, { useState, useEffect, useMemo } from 'react';
import type { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import Banner from '../components/global/Banner';
import ArtistsList from '../components/global/ArtistsList';
import StyledSelect from '../components/UI/StyledSelect';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MarketplaceItems from '../components/global/MarketplaceItems';

import type * as Types from '../types/index.d';
import * as utils from '../utils';



/**
 * Страница Marketplace
 * @param props
 * @returns
 */
function Marketplace(props): React.ReactElement {
  const { app, data } = props;
  const { banners } = data;
  const { lang } = app;
  const [filterBy, setFilterBy] = useState<number>(null);
  const [searchBy, setSearchBy] = useState('')
  const [search, setSearch] = useState('')
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fromEth, setFromEth] = useState(null)
  const [toEth, setToEth] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  useEffect(() => {
    utils.$.setStylesArtistList();
  }, []);
  const onChange = (e, search) => {
    setSearchBy(search)
    setSearch(e)
  }
  return (
    <Theme>
      <Header app={app} {...app} onChange={onChange}/>
      <div className="wrapper ">
        <div className="heading center">
          <h1>
            <i className="flaticon-fire" /> {lang.pageNames.marketPlace}
          </h1>
        </div>
        <Banner {...app} banners={banners} />
        <div className="content marketplace">
          <ArtistsList app={app} />
          <main className="main marketplace">
            <div className="main__top">
              <div className="heading__sort main__sort">
              <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Open Popover
      </Button> 
                <StyledSelect
                  variant="outlined"
                  value={filterBy}
                  onChange={(e: any) => {
                    setFilterBy(e.target.value);
                  }}
                  options={[
                    {
                      value: 1,
                      text: `${lang.price} &uarr;`,
                    },
                    {
                      value: 2,
                      text: `${lang.price} &darr;`,
                    },
                    {
                      value: 3,
                      text: `${lang.date} &uarr;`,
                    },
                    {
                      value: 4,
                      text: `${lang.date} &darr;`,
                    },
                  ]}
                />
                      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
          <div style={{display: 'flex', margin: '20px'}}>
            <div style={{marginRight:'10px'}}>
              <TextField type="number" label="From ETH" variant="outlined" value={fromEth} onChange={(e) => setFromEth(e.target.value)}/>
            </div>
            <div>
              <TextField type="number" label="To ETH" variant="outlined" value={toEth} onChange={(e) => setToEth(e.target.value)}/>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div>
              <Button variant="contained" color="secondary">
                clear
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary">
                apply
              </Button>
            </div>
          </div>
        </div>
      </Popover>
              </div>
            </div>
            <MarketplaceItems app={app} search={search} searchBy={searchBy} filterBy={filterBy}/>
          </main>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

Marketplace.getInitialProps = async ({req, res}) => {
  const result = await axios.get('https://desolate-inlet-76011.herokuapp.com/banner')
  return {
    data: {
      banners: result.data,
    },
  };
};

export default Marketplace;
