import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import { IoIosArrowDown } from "react-icons/io";
import { MdCloudOff } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import {
    Page, f7,
  } from 'framework7-react';
import axios from 'axios';
import store from '../js/store';
import TimeAgo from 'javascript-time-ago';
import ReactTimeAgo from 'react-time-ago'; 
import en from 'javascript-time-ago/locale/en'
import useConnection from '../hooks/useConnection';
import OfflinePanel from '../components/offlinePanel';


export default function SellToTDX({ f7router }) {
  TimeAgo.addLocale(en);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [enableOfflineMode, setEnableOfflineMode] = useState(false);

  const [commodityValue, setCommodityValue] = useState('');
  const [siloValue, setSiloValue] = useState('');
  const [weight, setWeight] = useState('');

  const [commodityList, setCommodityList] = useState([]);
  const [siloList, setSiloList] = useState([]);
  const [time, setTime] = useState('');

  const [commodityPrice ,setCommodityPrice] = useState({});
  const [priceLoading ,setPriceLoading] = useState(false);
  const [commodityRate, setCommodityRate] = useState([]);

  const {connectionStatus} = useConnection();
  
  const fetchCommodity = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/commodities/${store.state.user.token}`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const commodityData = response.data;
      console.log('commodity Data', commodityData);
      setCommodityList(commodityData);
    } catch (error) {
      console.error('Error fetching data:', error);
      if(error.code === 'ERR_NETWORK'){
        setEnableOfflineMode(true);
      }
      // f7.dialog.alert('Unable to fetch data','');
    }
}

  const fetchSilo = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/silos/${store.state.user.token}`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const siloData = response.data;
      console.log('silo Data', siloData);
      setSiloList(siloData);
    } catch (error) {
      console.error('Error fetching data:', error);
      f7.dialog.alert('Unable to fetch data','');
    }
}

  const fetchCommodityRates = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/commodityrates/${store.state.user.token}`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const rateData = response.data;
      console.log('rate Data', rateData);
      // setErrorMessage('');
      // setSiloList(siloData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // setErrorMessage(error.code);
      // f7.dialog.alert('Unable to fetch data','');
    }
}

  const fetchPriceCheck = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/pricecheck/${store.state.user.token}`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const priceCheck = response.data;
      console.log('price Check', priceCheck);
      // setErrorMessage('');
      // setSiloList(siloData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // setErrorMessage(error.code);
      // f7.dialog.alert('Unable to fetch data','');
    }
}

  useEffect(() => {
    fetchSilo();
    fetchCommodity();
    fetchCommodityRates();
    // fetchPriceCheck();
  }, [time]);

  const handleSubmit = () => {
    if(!commodityValue){
      f7.dialog.alert('Please select a commodity','');
      return null;
    }
    if(!siloValue){
      f7.dialog.alert('Please select a silo');
      return null;
    }
    if(!weight || weight < 1){
      f7.dialog.alert('Weight field cannot be empty','');
      return null;
    }
    if (weight && siloValue && commodityValue ){
      const saleData = {commodity: commodityValue, quantity: weight, siloid: siloValue };
      store.dispatch('updateSaleData', saleData);
      console.log('state', store.state);
      f7router.navigate('/enter-farmer-details/');
    }
  }

  const calculatePrice = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/pricecheck/${store.state.user.token}`,
        { 
          quantity: weight,
          commodity: commodityValue.split(", ")[0],
         }, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const priceData = response.data;
      console.log('price Data', priceData);
      setCommodityPrice(priceData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // f7.dialog.alert('Unable to fetch data','');
    }
}

const fetchCommodityRate = async () => {
  try {
    const response = await axios.post(
      `https://torux.app/api/user/commodityrates/${store.state.user.token}`,
      {}, // This is the request body, currently empty
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.state.user.access_token}`,
        },
      }
    );
    const rateData = response.data;
    console.log('rate Data', rateData);
    setCommodityRate(rateData);
  } catch (error) {
    console.error('Error fetching data:', error);
    // f7.dialog.alert('Unable to fetch data','');
  }
}

const loadPrice = async () => {
  setPriceLoading(true);
  calculatePrice();
  fetchCommodityRate();
  setPriceLoading(false);
};

useEffect(() => {
  loadPrice();
}, [weight, commodityValue]);

  return (
    <Page name="home">
    <div className="relative w-full flex flex-col h-screen overflow-hidden">
      <Navbar  title="Sell to TDX" goBack={true} f7router={f7router} menu={true}/>

      <div className="flex-1 w-full sm:p-5 p-3 flex flex-col justify-between gap-y-5 bg-background-primary">
        <div>
          <div className="mb-3">
            <label className="text-[0.9em] font-bold text-slate-600 mb-1">Commodity</label>
            <div className="rounded bg-white h-[2.5em] w-full relative border border-slate-200">
              <div className="w-[1.2em] h-[1.2em] flex justify-center items-center z-10 absolute top-[0.7em] right-[10px]">
              <IoIosArrowDown />
              </div>     
              <select className="rounded px-3 h-full w-full" value={commodityValue} onChange={(e) => setCommodityValue(e.target.value) }>
                <option value="">Select Commodity</option>
                {commodityList.map((commodity) => {
                  if(commodity.name){
                   return (<option key={commodity.id} value={`${commodity.id}, ${commodity.name}`}>{commodity.name}</option>)
                  }
                })}
              </select> 
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-y-2 gap-x-3 mb-3">
            <div className="flex-1 w-full sm:w-auto">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Weight</label>
              <div className="rounded w-full h-[2.5em] bg-white relative ps-2 pe-5 border border-slate-200">
                <h6 className="absolute top-[0.5em] right-[10px] text-[0.9em]">KG</h6>
                <input min={1} type="number" className="rounded w-full h-full" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="flex-1 w-full sm:w-auto">
            <label className="text-[0.9em] font-bold text-slate-600 mb-1">Silo</label>
            <div className="rounded bg-white h-[2.5em] w-full relative border border-slate-200">
              <div className="w-[1.2em] h-[1.2em] flex justify-center items-center z-10 absolute top-[0.7em] right-[10px]">
              <IoIosArrowDown />
              </div>     
              <select
                value={siloValue}
                onChange={(e) => setSiloValue(e.target.value) }
                className="rounded px-3 h-full w-full">
                <option value="">Select Silo</option>
                {siloList.map((silo) => {
                  if(silo.siloname){
                   return (<option key={silo.siloname} value={silo.token}>{silo.siloname}</option>)
                  }
                })}
              </select> 
            </div>
          </div>
          </div>

          {(weight && siloValue && commodityValue ) && (<div className="rounded bg-blue-200 p-3">
            <div className="flex justify-between items-center">
              <h6 className="font-semibold">No. of Bags (100KG)</h6>  
              {priceLoading ? (<h6 className="font-semibold">...calculating price</h6>) : (<h6 className="font-semibold">{commodityPrice?.bags} bags</h6>)}  
            </div>
            <div className="my-2 w-full h-[1px] bg-slate-400" />
            <div className="flex justify-between items-center">
              <h6 className="font-semibold">Price Per KG</h6>  
              {priceLoading ? (<h6 className="font-semibold">...calculating price</h6>) : (<h6 className="font-semibold">₵ {commodityPrice?.bagsrate}</h6>)}  
            </div>
            <div className="my-2 w-full h-[1px] bg-slate-400" />
            <div className="flex justify-between items-center">
              <h6 className="font-semibold">Total Cost</h6>  
              {priceLoading ? (<h6 className="font-semibold">...calculating price</h6>) : (<h6 className="font-semibold">₵ {commodityPrice?.totalcost}</h6>)}  
            </div>
          </div>)}

          <div className="mt-5">
            {
              connectionStatus && (
              <button
                onClick={handleSubmit}
                className="flex justify-center items-center w-full h-[35px] sm:h-[3em] rounded bg-primary mb-2"
              >
                <h6 className="text-lg font-semibold text-white">Continue</h6>
              </button>)
            }
            {
              !connectionStatus && (
                <OfflinePanel f7router={f7router} />
              )
            }
          </div>
        </div>

        <div className="flex justify-center mb-[5vh]">
          <button onClick={() => setIsPopupOpen(true)} className="sm:h-[2.8em] h-[2em] w-auto sm:px-5 px-3 rounded-full bg-green-300 text-primary flex justify-center items-center">
            <h5 className="font-bold sm:text-base text-[0.9em]">Show Prices</h5>
          </button>    
        </div>

      </div>

      <button
        onClick={() => setIsPopupOpen(false)}
        className={`absolute z-10 h-[50vh] w-screen ${ isPopupOpen? 'top-[0px] opacity-50' : 'top-[-55vh] opacity-0'} bg-black transition-opacity duration-300`}
      />

      <div
        className={`absolute z-20 left-[0px] right-[0px] ${ isPopupOpen? 'top-[20vh]' : 'top-[96vh]' } w-screen h-[85vh] p-3 bg-slate-900 rounded-t-3xl transition-all`}
      >
        <div className="h-[5px] w-full flex justify-center">
          <div className="h-full w-[45px] rounded-full bg-slate-500" />
        </div>
        <div className="relative flex justify-center items-center h-[4em]">
          <h5 className="text-lg font-semibold text-white">Price</h5>
          <button onClick={() => setIsPopupOpen(false)} className="flex justify-center items-center bg-slate-800 w-[30px] h-[30px] rounded-full absolute z-30 right-[5px] top-[13px]">
            <RxCross2 className="text-[22px] text-white" />
          </button>
        </div>
        <div className="px-3 pt-3 pb-[6em] h-full overflow-scroll">
          {(commodityRate?.length === 0) && (<div className="w-full h-full flex just-center mt-5">
            <h6 className="text-center font-bold text-slate-300">There are no price rates to show</h6>  
          </div>)}
          {commodityRate?.map((rate) => {
              if(rate?.name){ 
                return (<div key={rate.commodityId}>  
             <div className="flex justify-between gap-x-1 min-h-[5em] items-center" >
               <div className="h-[2em] w-[2em] sm:h-[3em] sm:w-[3em] rounded-full">
                 <img src={rate.icon} className="h-full w-full" alt="commodity icon" /> 
               </div>
               <div>
                 <h6 className="text-white text-[1em] font-bold">{rate.name}</h6>
                 <p className="text-primary text-[0.9em]">
                   Last updated 
                   {' '}
                  {commodityRate[6]?.last_synced ? <ReactTimeAgo date={new Date(commodityRate[6]?.last_synced)} locale="en-US"/> : 'N/A'}
                 </p>
               </div>
               <div className='flex flex-col gap-y-1'>
                 <h6 className="rounded bg-green-600 px-[5px] sm:py-[1px] text-white sm:text-base text-[0.9em]">₵ {rate.purchaseprice_high}</h6>  
                 <h6 className="rounded bg-red-600 px-[5px] sm:py-[1px] text-white sm:text-base text-[0.9em]">₵ {rate.purchaseprice_low}</h6>
               </div>
             </div>
             <div className="w-full h-[1px] border-b border-slate-700" />  
           </div>)
              }
           })
          }

        </div>
      </div>

      
           

    </div>
 
    
      
      </Page>
  )
}
