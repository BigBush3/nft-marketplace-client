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
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MarketplaceItems from '../components/global/MarketplaceItems';

import type * as Types from '../types/index.d';
import * as utils from '../utils';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, styled } from '@material-ui/core/styles';

const { CYAN_COLOR } = utils.c;
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';


const ExpandMoreRoundedIconStyled = styled(ExpandMoreRoundedIcon)({
  color: CYAN_COLOR,
});

const useStyles = makeStyles((theme) => ({
  select: {
    color: theme.palette.primary.main,
    minWidth: '150px',
    marginRight: '1em',
    fontFamily: 'OpenSans',
    [theme.breakpoints.down('sm')]: {
      minWidth: '20px',
    },
  },
  option: {
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
  svg: {
    marginRight: '0.5em',
    transform: 'rotate(90deg)',
  },
}));

/**
 * Страница Marketplace
 * @param props
 * @returns
 */
function Marketplace(props): React.ReactElement {
  const { app, data } = props;
  const { banners } = data;
  const { lang } = app;
  const [filterBy, setFilterBy] = useState(4);
  const [width, setWidth] = useState<number>(null);  

  
  
  const ref = useRef()
  const size = useWindowSize()
  const [searchBy, setSearchBy] = useState(1)
  const [search, setSearch] = useState('')
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fromEth, setFromEth] = useState(undefined)
  const [toEth, setToEth] = useState(undefined)
  const [open, setOpen] = useState(false)
  const [priceList, setPriceList] = useState([0, 0])
  const classes = useStyles('outlined');
  useEffect(() => {
    setWidth(window.innerWidth)

  }, [])
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
    console.log('hi')
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
             {lang.pageNames.marketPlace}
          </h1>
        </div>
        <Banner {...app} banners={banners} />
        <div className="content marketplace">
          <ArtistsList app={app} location='marketplace'/>
          <main className="main marketplace">
            {size.width > 400 ?  <div className="main__top">
              <div className="heading__sort main__sort">
              <Button style={{backgroundColor: 'transparent', width: '140px', height: '50px', marginRight:'20px', border: '1px solid lightgray', fontWeight: 'lighter', textTransform: 'capitalize', fontSize: '16px', padding: '26.5px 14px 26.5px 14px'}} aria-describedby={id} variant="outlined" color="primary" onClick={handleClick}>
        Price range
      </Button> 
      <StyledSelect
                variant="outlined"
                value={filterBy}
                app={lang}
                onChange={(e: any) => {
                  setFilterBy(e.target.value);
                }}
                options={[
                  {
                    value: 1,
                    text: "Highest price",
                  },
                  {
                    value: 2,
                    text: "Lowest price",
                  },
                  {
                    value: 3,
                    text: "Newest",
                  },
                  {
                    value: 4,
                    text: "Popular",
                  }
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
          <div style={{display: 'flex', marginLeft: '15px', marginRight: '15px', marginBottom: '40px'}}>
            <div style={{marginRight:'10px', height: '10px'}}>
              <TextField style={{width: 100, height: 10}} type="number" label="From ETH" value={fromEth} onChange={(e) => setFromEth(e.target.value)}/>
            </div>
            <div>
              <TextField style={{width: '100px', height: '10px'}} type="number" label="To ETH"  value={toEth} onChange={(e) => setToEth(e.target.value)}/>
            </div>
          </div>
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
            </div>: <div className="main__top"><StyledSelect
                width='mobile'
                variant="outlined"
                value={filterBy}
                app={lang}
                onChange={(e: any) => {
                  setFilterBy(e.target.value);
                }}
                options={[
                  {
                    value: 1,
                    text: "Highest",
                  },
                  {
                    value: 2,
                    text: "Lowest",
                  },
                  {
                    value: 3,
                    text: "Newest",
                  },
                  {
                    value: 4,
                    text: "Popular",
                  }
                ]}
              />
              <div className="heading__sort main__sort" style={{display: 'flex'}}>
              <Button style={{backgroundColor: 'transparent', height: '40px', marginLeft: '-12px', width: '100px',border: '1px solid lightgray', fontWeight: 'lighter', textTransform: 'capitalize', fontSize: '10px', padding: '20.5px 14px 19px 14px', boxShadow: 'none', color: '#00BCD4'}} aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
        Price range
      </Button> 
      
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
            <div style={{marginRight:'10px', height: '10px'}}>
              <TextField style={{width: 100, height: 10}} type="number" label="From ETH" value={fromEth} onChange={(e) => setFromEth(e.target.value)}/>
            </div>
            <div>
              <TextField style={{width: '100px', height: '10px'}} type="number" label="To ETH"  value={toEth} onChange={(e) => setToEth(e.target.value)}/>
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
            </div>}
            <MarketplaceItems app={app} search={search} searchBy={searchBy} filterBy={filterBy} priceRange={priceList}/>
          </main>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      //@ts-ignore
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
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
