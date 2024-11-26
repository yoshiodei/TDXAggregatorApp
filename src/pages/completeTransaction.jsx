import { f7, Page } from 'framework7-react';
import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar';
import store from '../js/store';
import axios from 'axios';
import { mobileNetworks } from '../config/constant';
import { detectNetwork } from '../config/util';

export default function CompleteTransaction({ f7route, f7router }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMomo, setIsLoadingMomo] = useState(false);
  const {id} = f7route.params;
  const [transaction, setTransaction] = useState({});
  const [commodityPrice, setCommodityPrice] = useState({});
  const [communityValue, setCommunityValue] = useState({});
  const [momoNumber, setMomoNumber] = useState({ message: '', number: '' });
  const [siloValue, setSiloValue] = useState({});

  const findTransaction = () => {
    console.log('user state at fetching transaction:', store.state?.user?.pendingTransactions);
    console.log('the id', id);
    return store.state?.user?.pendingTransactions?.find((transaction) => transaction.id === id) || null;
  };

  const getTransactionById = async() => {
    const transactionData = findTransaction();
    console.log('transaction data', transactionData);
    if(!transactionData?.id){ f7.dialog.alert('Transaction data not found',''); }
    else { 
      await calculatePrice(transactionData.commodity.split(', ')[0], transactionData.quantity);  
      setTransaction(transactionData); 
      getSiloValue(transactionData.siloid);
      getCommunityValue(transactionData.community_id);
    };
  }

  const getSiloValue = (siloid) => {
    const siloData = JSON.parse(localStorage.getItem('silos')) || [];
    if(!siloData?.length){ f7.dialog.alert('Unable to fetch silo data','') }
    else{
      const data = siloData.find((silo) => silo.token === siloid) || null;
      setSiloValue(data.siloname);
    }
  };

  const getCommunityValue = async(communityid) => {
    const communityData = JSON.parse(localStorage.getItem('communities')) || [];
    if(!communityData?.length){ f7.dialog.alert('Unable to fetch community data','') }
    else{
      const data = communityData.find((community) => community.id === communityid) || null;
      setCommunityValue(data.name);
    }
  };

  const calculatePrice = async (commodity, quantity) => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/pricecheck/${store.state.user.token}`,
        { 
            commodity,
            quantity
         }, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const priceData = response.data;
      console.log('pending error check 003: response on calcPrice,', priceData);
    //   setErrorMessage('');
      setCommodityPrice(priceData);
    } catch (error) {
      console.error('Error fetching data:', error);
    //   setErrorMessage(error.code);
      f7.dialog.alert('Unable to fetch price data','');
    }
}

const verifyMomoNumber = async (mobile) => {
    console.log('pending error check: mobile param on verify momo,', mobile);
    try {
      const response = await axios.post(
        `https://torux.app/api/user/momonamelookup/${store.state.user.token}`,
        { 
          network: detectNetwork(mobile, mobileNetworks),
          number: mobile,
         }, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const momoData = response.data;
      console.log('pending error check: verify momo response,', momoData);
      if(momoData.error){
        console.log('mobile number', mobile);
        console.log('fff', detectNetwork(mobile, mobileNetworks));
        f7.dialog.alert('This number was not found','');
      }
      else{
        setMomoNumber({ message:momoData.message, number:momoData.number });
      }
      //   setErrorMessage('');
      // setCommodityPrice(priceData);
    } catch (error) {
      console.error('Error fetching data:', error);
    //   setErrorMessage(error.code);
      f7.dialog.alert('Unable to fetch data','');
    }
  }

  const handleSearch = async () => {
    if(transaction.mobile.length !== 10){
      f7.dialog.alert('Phone number is no up to 10 digits.','')
    }
    else{
      setIsLoadingMomo(true);
      await verifyMomoNumber(transaction.mobile);
      setIsLoadingMomo(false);
    }
  };

  const findUserByNumber = (users, mobile) => {
    return users.find((user) => user.mobile === mobile) || null;
  };

  const handleDelete = () => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if(!existingUsers?.length){
      f7.dialog.alert('Unable to find saved users','');
    }else{
      const userData = findUserByNumber(existingUsers, store.state.user.mobile);  
      const newTransactions = userData.pendingTransactions.filter((transactionObj) => (
        (transactionObj.id !== transaction.id)
      ));
      
      const updatedLocalUserData = { ...userData, pendingTransactions: newTransactions }
      const newExistingUsers = existingUsers.map((user) => (
        (user.mobile === store.state.user.mobile ? updatedLocalUserData : user)
      ))
      localStorage.setItem('users', JSON.stringify(newExistingUsers));

      const updatedUserState = { ...store.state.user, pendingTransactions: newTransactions };
      store.dispatch('setUser', updatedUserState);

      f7router.navigate('/pending-transactions/');
    }
  };

  const removeTransactionDetail = () => {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if(!existingUsers?.length){
      f7.dialog.alert('Unable to find saved users','');
    } else {
      const userData = findUserByNumber(existingUsers, store.state.user.mobile);  
      const newTransactions = userData.pendingTransactions.filter((transactionObj) => (
        (transactionObj.id !== transaction.id)
      ));

      const updatedLocalUserData = { ...userData, pendingTransactions: newTransactions }
      const newExistingUsers = existingUsers.map((user) => (
        (user.mobile === store.state.user.mobile ? updatedLocalUserData : user)
      ))
      localStorage.setItem('users', JSON.stringify(newExistingUsers));

      const updatedUserState = { ...store.state.user, pendingTransactions: newTransactions };
      store.dispatch('setUser', updatedUserState);
    }
  };

  const handleCancelTransaction = () => {
    f7.dialog.confirm(
        'Are you sure you want delete this transaction?',
        'Confirm Delete',
        () => {
          handleDelete();
        },
        () => {
          f7.toast.show({
            text: 'Transaction Deleted',
            position: 'top',
            closeTimeout: 2000,
          });
        }
      );
  };

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
        f7.dialog.alert(orderData.message,'');
      }
      else {
        removeTransactionDetail();
        f7router.navigate('/sale-complete/');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      f7.dialog.alert('Unable to submit order. Please try again.','');
    }
  }

  const handleSubmit = async() => {
    const payto = 'Mainnumber';
    // if(momoNumber.number === farmer.mobile){
    //   payto = 'Mainnumber';
    // } 
    // if(momoNumber.number === farmer.altrnumber){
    //   payto = 'altnumber';
    // }

    const farmerData = {
      farmer: '',
      payto,
      mobile: momoNumber.number,
      fname: momoNumber.message,
      network: detectNetwork(momoNumber.number, mobileNetworks),
      commodity: transaction.commodity.split(", ")[0],
      community_id: transaction.community_id,
      siloid: transaction.siloid,
      quantity: commodityPrice.weight,
      bags: commodityPrice.bags,
      unit_price: commodityPrice.bagsrate,
      commodity_qc: '',
    };
    
    setIsLoading(true);
    console.log('pending transaction data', farmerData);
    await completeOrder(farmerData);
    setIsLoading(false);
  }

  useEffect(() => {
    getTransactionById()
  }, []);

  return (
    <Page name="home"> 
      <div className="flex flex-col min-h-[100vh] w-[100vw] bg-background-primary relative">
        <Navbar f7router={f7router} goBack={true} title="Pending Transaction" menu={true} />
        <div className="bg-slate-900 flex justify-between items-center h-[6em] px-3 sm:px-5">
        <div className="flex gap-x-3">
          <div className="sm:block hidden w-[40px] h-[40px] bg-slate-800 rounded-full" />
          <div>
            <h6 className="font-bold text-white sm:text-base text-[0.9em]">{transaction?.commodity?.split(', ')[1]}</h6>  
            <h6 className="text-primary font-semibold sm:text-base text-[0.9em]">{`${commodityPrice.bags} bags, ${commodityPrice.weight} KG`}</h6>  
          </div>
        </div>
        <div>
          <h6 className="font-bold text-white sm:text-base text-[0.9em]">{`₵ ${commodityPrice.totalcost}`}</h6>    
        </div>
      </div>
        <div className="flex-1 sm:p-5 p-2">

          <div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
            <div className="w-full">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Community</label>
              <div className="rounded w-full h-[2.5em] bg-slate-200 relative ps-2 pe-5 border border-slate-200">
                <input readOnly={true} value={communityValue} className="rounded w-full h-full bg-slate-200 font-semibold text-slate-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
            <div className="w-full">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Silo</label>
              <div className="rounded w-full h-[2.5em] bg-slate-200 relative ps-2 pe-5 border border-slate-200">
                <input readOnly={true} value={siloValue} className="rounded w-full h-full bg-slate-200 font-semibold text-slate-600" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
            <div className="w-full">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Phone</label>
              <div className="rounded w-full h-[2.5em] bg-slate-200 relative ps-2 pe-5 border border-slate-200">
                <input readOnly={true} value={transaction.mobile} className="rounded w-full h-full bg-slate-200 font-semibold text-slate-600" />
              </div>
            </div>
          </div>

          {(!!momoNumber.message) && (<div className="flex flex-col items-center gap-3 mb-3 mt-30 w-full">
            <div className="w-full">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Name</label>
                <div className="rounded w-full h-[2.5em] bg-slate-200 relative ps-2 pe-5 border border-slate-200">
                  <input readOnly={true} value={momoNumber.message} min={0} placeholder="Enter full name" className="rounded w-full h-full bg-slate-200 font-semibold text-slate-600" />
                </div>
            </div>
          </div>)}

          {(!momoNumber.message && !momoNumber.number) ? (<div className="mt-5">
            <button onClick={() => handleSearch()} className="flex justify-center items-center w-full sm:h-[3em] h-[35px]  rounded bg-primary">
              <h6 className="sm:text-lg text-base font-semibold text-white">{isLoadingMomo ? '...loading' : 'Search Number'}</h6>
            </button>
          </div>) :
          (<div className="mt-5">
            <button onClick={() => handleSubmit()} className="flex justify-center items-center w-full sm:h-[3em] h-[35px]  rounded bg-primary">
              <h6 className="sm:text-lg text-base font-semibold text-white">{isLoading ? '...loading' : 'Continue'}</h6>
            </button>
            <div className="mt-2 flex justify-center">
              <button onClick={() => handleCancelTransaction()}><h6 className="text-center text-[0.9em] text-red-300 underline">Cancel and Delete Transaction</h6></button>
            </div>
          </div>)
          }

        </div>
      </div>
    </Page>      
  )
}
