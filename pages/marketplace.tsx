import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';



/**
 * Страница Marketplace
 * @param props
 * @returns
 */
function Marketplace(props): React.ReactElement {
  const { app, data } = props;
  const { banners } = data;
  const { lang } = app;
  const [filterBy, setFilterBy] = useState('');
  const ref = useRef()
  const [searchBy, setSearchBy] = useState('')
  const [search, setSearch] = useState('')
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fromEth, setFromEth] = useState(undefined)
  const [toEth, setToEth] = useState(undefined)
  const [open, setOpen] = useState(false)
  const [priceList, setPriceList] = useState([0, 0])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false)
  };

  const id = open ? 'simple-popover' : undefined;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  useEffect(() => {
    utils.$.setStylesArtistList();
  }, []);
  const onChangeSome = (e, search) => {
    setSearchBy(search)
    setSearch(e)
  }
  const priceHandler = () => {
    handleClose()
    setPriceList([fromEth, toEth])
  }
  const clickHandler = () => {
    setFromEth(null)
    setToEth(null)
    setPriceList([0, 0])
    handleClose()
  }
  return (
    <Theme>
      <Header app={app} {...app} onChange={onChangeSome}/>
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
              <Button style={{backgroundColor: 'transparent', width: '140px', height: '50px', marginRight:'20px'}} aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Price range
      </Button> 
      <Select
        title='Filter'
        labelId="search-filter"
        value={filterBy}
        //@ts-ignore
        onChange={(e) => setFilterBy(e.target.value)}>
            <MenuItem key={`Select-Highestprice`}  value='1'>
              <p dangerouslySetInnerHTML={{__html: 'Highest price'}} />
            </MenuItem>
            <MenuItem key={`Select-LowestPrice`}  value='2'>
              <p dangerouslySetInnerHTML={{__html: 'Lowest price'}} />
            </MenuItem>
            <MenuItem key={`Select-Newest`}  value='3'>
              <p dangerouslySetInnerHTML={{__html: 'Newest'}} />
            </MenuItem>
            <MenuItem key={`Select-Popular`}  value='4'>
              <p dangerouslySetInnerHTML={{__html: 'Popular'}} />
            </MenuItem>
      </Select>
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
          <div style={{display: 'flex', marginTop: '20px', marginLeft: '15px', marginRight: '15px', marginBottom: '30px'}}>
            <div style={{marginRight:'10px'}}>
              <TextField style={{width: '100px', height: '10px'}} type="number" label="From ETH" variant="outlined" value={fromEth} onChange={(e) => setFromEth(e.target.value)}/>
            </div>
            <div>
              <TextField style={{width: '100px', height: '10px'}} type="number" label="To ETH" variant="outlined" value={toEth} onChange={(e) => setToEth(e.target.value)}/>
            </div>
          </div>
          <hr/>
          <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '20px'}}>
            <div className='button'>
            <button  style={{width: '100px', height: '40px'}} onClick={clickHandler}>
             <span>Clear</span>
              </button>
            </div>
            <div className='button'>
              <button className='fill' style={{width: '100px', height: '40px'}} onClick={priceHandler}>
             <span>Apply</span>
              </button>
            </div>
          </div>
        </div>
      </Popover>
              </div>
            </div>
            <MarketplaceItems app={app} search={search} searchBy={searchBy} filterBy={filterBy} priceRange={priceList}/>
          </main>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

Marketplace.getInitialProps = async ({req, res}) => {
  const result = await axios.get('https://nft-marketplace-api-plzqa.ondigitalocean.app/banner')
  return {
    data: {
      banners: result.data,
    },
  };
};

export default Marketplace;
