import React, { useEffect, useState } from 'react';
import { MdOutlineRefresh } from "react-icons/md";
import {
  Page, f7,
} from 'framework7-react';
import Navbar from '../components/navbar';
import axios from 'axios';
import store from '../js/store';
import TimeAgo from 'javascript-time-ago';
import ReactTimeAgo from 'react-time-ago'; 
import en from 'javascript-time-ago/locale/en'
import bagIcon from '../assets/bag-icon.png'
import scaleIcon from '../assets/scale-icon.png'
import farmerIcon from '../assets/farmer-icon.png'

const Dashboard = ({ f7router }) => {
  TimeAgo.addLocale(en);
  const [userBalance, setUserBalance] = useState({});
  const [time, setTime] = useState('');

  const fetchUserBalance = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/milestones/${store.state.user.token}`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const milestoneData = response.data;
      setUserBalance(milestoneData)
      // setErrorMessage('');
      // setCommodityList(commodityData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // setErrorMessage(error.code);
      f7.dialog.alert('Unable to fetch data','');
    }
 }

 useEffect(() => {
   fetchUserBalance();
 }, [time]);

  return (
  <Page name="home">
    <div className="w-full flex flex-col min-h-full">

      <Navbar  title="Dashboard" goBack={false} f7router={f7router} menu={true}/>

      <div className="flex-1 w-full sm:p-5 p-3 flex flex-col gap-y-5 bg-background-primary">
        <div>
          <h1 className="font-bold mb-2">Hello, {store.state.user.firstname}</h1>
          <div className="p-3 rounded-lg bg-primary text-white">
            {(userBalance.last_synced) && (<p className="text-[0.9em] text-right mb-1">
              Last updated 
              {' '}
              <ReactTimeAgo date={new Date(userBalance?.last_synced)} locale="en-US"/>
            </p>)}
            <h2 className="text-[1.5em] sm:text-[2em] font-bold leading-tight">{`Ghc ${userBalance?.account_balance || 'N/A'}`}</h2>
            <h5 className="text-[0.95em] sm:text-[1.1em] font-semi-bold leading-tight">Available Balance</h5>
            <div className="flex justify-end">
              <button onClick={() => setTime(new Date().getMilliseconds())} className="flex justify-center items-center rounded-full bg-green-600 w-[1.6em] h-[1.6em]">
                <MdOutlineRefresh className="text-[1.45em]" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-y-14">
          <div className="flex flex-col gap-y-3">

            <div className="h-[60px] rounded bg-white p-[5px] flex justify-between gap-x-2">
              <div className="w-[50px] h-[50px] p-[8px] rounded bg-slate-300 flex justify-center items-center">
              <img src={farmerIcon} alt='bag icon' className='w-full h-full' />
              </div>  
              <div className="flex-1 flex items-center">
                <div>
                  <h6 className="text-[0.85em] font-semibold">Total farmers onboarded</h6>
                  <h4 className="font-semibold">{userBalance.total_users}</h4>
                </div>  
              </div>  
              <div className="flex items-center">
                {/* <button className="bg-primary rounded-full text-white py-[1px] px-3 text-[0.85em] font-semibold">
                  View
                </button> */}
              </div>  
            </div>  

            <div className="h-[60px] rounded bg-white p-[5px] flex justify-between gap-x-2">
              <div className="w-[50px] h-[50px] p-[12px] rounded bg-slate-300 flex justify-center items-center">
                <img src={bagIcon} alt='bag icon' className='w-full h-full' />
              </div>  
              <div className="flex-1 flex items-center">
                <div>
                  <h6 className="text-[0.85em] font-semibold">Total cash transaction</h6>
                  <h4 className="font-semibold">{userBalance.total_cost}</h4>
                </div>  
              </div>  
              <div className="flex items-center">
                {/* <button className="bg-primary rounded-full text-white py-[1px] px-3 text-[0.85em] font-semibold">
                  View
                </button> */}
              </div>  
            </div>

            <div className="h-[60px] rounded bg-white p-[5px] flex justify-between gap-x-2">
              <div className="w-[50px] p-[12px] h-[50px] rounded bg-slate-300 flex justify-center items-center">
                <img src={scaleIcon} alt='bag icon' className='w-full h-full' />
              </div>  
              <div className="flex-1 flex items-center">
                <div>
                  <h6 className="text-[0.85em] font-semibold">Total quantities sold</h6>
                  <h4 className="font-semibold">{userBalance.total_quantity}</h4>
                </div>  
              </div>  
              <div className="flex items-center">
                {/* <button className="bg-primary rounded-full text-white py-[1px] px-3 text-[0.85em] font-semibold">
                  View
                </button> */}
              </div>  
            </div>
              
          </div>

          <div className="flex flex-col gap-y-2 mb-3">
            <button onClick={() => f7router.navigate('/sell-to-tdx/')} className="rounded bg-primary h-[30px] sm:h-[3.5em] flex justify-center items-center">
              <h6 className="text-white font-bold">Sell to TDX</h6>
            </button>
            {/* <button className="rounded border-2 border-primary h-[3.5em] flex justify-center items-center">
              <h6 className="font-bold">Place Order</h6>
            </button> */}
          </div>

        </div>

      </div>
    </div>
  </Page>
  );
}

export default Dashboard;