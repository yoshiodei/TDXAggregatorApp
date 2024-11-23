import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import {
  f7,
    Page,
  } from 'framework7-react';
import store from '../js/store';
import axios from 'axios';
import { detectNetwork } from '../config/util';
import { mobileNetworks } from '../config/constant';

export default function FarmerDetails({ f7router }) {
  const [commodityPrice, setCommodityPrice] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [momoNumber, setMomoNumber] = useState({ message: '', number: '' });
  const [farmer, setFarmer] = useState({});

  const calculatePrice = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/pricecheck/${store.state.user.token}`,
        { 
          quantity: store.state.saleData.quantity,
          commodity: store.state.saleData.commodity.split(", ")[0],
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
      setErrorMessage('');
      setCommodityPrice(priceData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.code);
      f7.dialog.alert('Unable to fetch data');
    }
}

const verifyMomoNumber = async () => {
  try {
    const response = await axios.post(
      `https://torux.app/api/user/momonamelookup/${store.state.user.token}`,
      { 
        network: detectNetwork(phone, mobileNetworks),
        number: phone,
       }, // This is the request body, currently empty
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.state.user.access_token}`,
        },
      }
    );
    const momoData = response.data;
    console.log('momo data', momoData);
    if(momoData.error){
      f7.dialog.alert('This number was not found');
    }
    else{
      setMomoNumber({ message:momoData.message, number:momoData.number });
    }
    setErrorMessage('');
    // setCommodityPrice(priceData);
  } catch (error) {
    console.error('Error fetching data:', error);
    setErrorMessage(error.code);
    f7.dialog.alert('Unable to fetch data');
  }
}

const fetchFarmer = async () => {
  try {
    const response = await axios.post(
      `https://torux.app/api/user/findfarmer/${store.state.user.token}`,
      {find: phone}, // This is the request body, currently empty
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.state.user.access_token}`,
        },
      }
    );
    const farmerData = response.data;
    console.log('farmer data', farmerData);
    if(farmerData.error == 'No user found'){
      f7.dialog.alert('No user found');
    }
    setFarmer(farmerData);
  } catch (error) {
    console.error('Error fetching data:', error);
    f7.dialog.alert('Unable to fetch data');
  }
}

const completeOrder = async (farmerDataObj) => {
  try {
    const response = await axios.post(
      `https://torux.app/api/user/order/${store.state.user.token}`,
      {...farmerDataObj}, // This is the request body, currently empty
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.state.user.access_token}`,
        },
      }
    );
    const orderData = response.data;
    console.log('order data', orderData);
    if(orderData.error){
      f7.dialog.alert(orderData.message);
    }
    else {
    f7router.navigate('/sale-complete/');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    f7.dialog.alert('Unable to submit order. Please try again.');
  }
}

  useEffect(() => {
    calculatePrice();
    fetchFarmer();
  }, []);

  const handleSearch = () => {
    if(phone.trim().length !== 10){
      f7.dialog.alert('Phone number is no up to 10 digits.')
    }
    else{
      verifyMomoNumber();
    }
  };

  const handleSubmit = async () => {
    let payto = 'Mainnumber';
    if(phone === farmer.mobile){
      payto = 'Mainnumber';
    } 
    if(phone === farmer.altrnumber){
      payto = 'altnumber';
    }

    const farmerData = {
      farmer: farmer?.token,
      payto,
      mobile: momoNumber.number,
      fname: momoNumber.message,
      network: detectNetwork(phone, mobileNetworks),
      commodity: store.state.saleData.commodity.split(", ")[0],
      community_id: store.state.user.community_id,
      siloid: store.state.saleData.siloid,
      quantity: commodityPrice.weight,
      bags: commodityPrice.bags,
      unit_price: commodityPrice.bagsrate,
      commodity_qc: '',
    };

    completeOrder(farmerData);
  }

  return (
    <Page name="home">
    <div className="relative w-full flex flex-col h-screen overflow-hidden">

      <Navbar  title="Sell to TDX" goBack={true} f7router={f7router}/>

      <div className="bg-slate-900 flex justify-between items-center h-[6em] px-3 sm:px-5">
        <div className="flex gap-x-3">
          <div className="sm:block hidden w-[40px] h-[40px] bg-slate-800 rounded-full" />
          <div>
            <h6 className="font-bold text-white sm:text-base text-[0.9em]">{store.state.saleData.commodity.split(", ")[1]}</h6>  
            <h6 className="text-primary font-semibold sm:text-base text-[0.9em]">{`${commodityPrice.bags} bags, ${commodityPrice.weight} KG`}</h6>  
          </div>
        </div>
        <div>
          <h6 className="font-bold text-white sm:text-base text-[0.9em]">{`₵ ${commodityPrice.totalcost}`}</h6>    
        </div>
      </div>

      <div className="flex-1 w-full p-3 sm:p-5 flex flex-col justify-between gap-y-5 bg-background-primary">
        <div>
          <div>
            <h6 className="font-bold text-lg">Enter Farmer Details</h6>
          </div>

          {
          (!momoNumber.message && !momoNumber.number) ?
          (<div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
            <div className="w-full">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone Number</label>
              <div className="rounded w-full h-[2.5em] bg-white relative ps-2 pe-5 border border-slate-200">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} min={0} placeholder="Enter phone number" className="rounded w-full h-full" />
              </div>
            </div>
          </div>)
          :
          (<div>
            <div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
              <div className="w-full">
                <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone Number</label>
                <div className="rounded w-full h-[2.5em] bg-slate-200 relative ps-2 pe-5 border border-slate-200">
                  <input readOnly={true} value={momoNumber.number} placeholder="Enter full name" className="rounded w-full h-full bg-slate-200 font-semibold text-slate-600" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
              <div className="w-full">
                <label className="text-[0.9em] font-bold text-slate-600 mb-1">Name</label>
                <div className="rounded w-full h-[2.5em] bg-slate-200 relative ps-2 pe-5 border border-slate-200">
                  <input readOnly={true} value={momoNumber.message} min={0} placeholder="Enter full name" className="rounded w-full h-full bg-slate-200 font-semibold text-slate-600" />
                </div>
              </div>
            </div>
          </div>)
          }

          {(!momoNumber.message && !momoNumber.number) ? (<div className="mt-5">
            <button onClick={() => handleSearch()} className="flex justify-center items-center w-full sm:h-[3em] h-[35px]  rounded bg-primary">
              <h6 className="sm:text-lg text-base font-semibold text-white">Search Number</h6>
            </button>
          </div>) :
          (<div className="mt-5">
            <button onClick={() => handleSubmit()} className="flex justify-center items-center w-full sm:h-[3em] h-[35px]  rounded bg-primary">
              <h6 className="sm:text-lg text-base font-semibold text-white">Continue</h6>
            </button>
            <div className="mt-2 flex justify-center">
              <button onClick={() => setMomoNumber({message: '', number: ''})}><h6 className="text-center text-[0.9em] text-primary underline">Edit number</h6></button>
            </div>
          </div>)
          }
        </div>

      </div>

    </div>
    </Page>
  )
}
