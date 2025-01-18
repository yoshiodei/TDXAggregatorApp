import React, { useEffect, useState } from 'react'
import { AiOutlineFileSync } from "react-icons/ai";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import {
    f7,
    Page
  } from 'framework7-react'
import axios from 'axios';
import store from '../js/store'; 
import useConnection from '../hooks/useConnection';

export default function SyncData({ f7router }) {
  console.log('authorized user', store.state.user);
  const [errorMessage, setErrorMessage] = useState('');
  const [userMilestone, setUserMilestone] = useState({});
  const [commodityList, setCommodityList] = useState({});
  const [communityList, setCommunityList] = useState({});
  const [siloList, setSiloList] = useState({});
  const [loading, setLoading] = useState(false);

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
      if(!errorMessage){
        console.log('silo synced');
        localStorage.setItem('silos', JSON.stringify(siloData));
      }
      setErrorMessage('');
      setSiloList(siloData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.code);
      f7.dialog.alert('Unable to fetch data','');
    }
  }

  const fetchCommunity = async () => {
    // `https://torux.app/api/communities/${store.state.user.token}`,
    try {
      const response = await axios.post(
        `https://torux.app/api/communities`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const communityData = response.data;
      if(!errorMessage){
        console.log('community synced');
        localStorage.setItem('communities', JSON.stringify(communityData));
      }
      setErrorMessage('');
      setCommunityList(communityData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.code);
      // f7.dialog.alert('Unable to fetch data','');
    }
}

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
      if(!errorMessage){
        console.log('commodity synced');
        localStorage.setItem('commodities', JSON.stringify(commodityData));
      }
      setErrorMessage('');
      setCommodityList(commodityData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.code);
      // f7.dialog.alert('Unable to fetch data','');
    }
}

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
      console.log('mile stone data', milestoneData);
      setUserMilestone(milestoneData);
      if(!errorMessage){
        saveDataToDevice(milestoneData);
      }
      setErrorMessage('');
      // setCommodityList(commodityData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.code);
      // f7.dialog.alert('Unable to fetch data','');
    }
}

const findUserByToken = (users, token) => {
  return users.find((user) => user.token === token) || null;
};

const saveDataToDevice = (milestone) => {
  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  const matchedUser = findUserByToken(existingUsers, store.state.user.token);
  const updatedUser = {...matchedUser, ...milestone};
  console.log('updated user', updatedUser);
  const newUsers = existingUsers.map((user) => (
    (user.token === updatedUser.token) ? updatedUser : user
  ));

  console.log('saved users', newUsers);

  localStorage.setItem('users', JSON.stringify(newUsers));
  // localStorage.setItem('commodities', JSON.stringify(commodityList));
  // localStorage.setItem('silos', JSON.stringify(siloList));
};

const syncData = async () => {
  setLoading(true);
  await fetchCommodity();
  await fetchCommunity();
  await fetchSilo();
  await fetchUserBalance();
  setLoading(false);
}

useEffect(() => {
  syncData();
}, []);


if(loading){
  return (
    <Page name="sync">
        <div className="w-full h-screen bg-slate-100 flex flex-col justify-center items-center p-5">
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center h-[150px] w-[150px] bg-white rounded-full">
            <AiOutlineFileSync className="text-[5em] text-slate-400" />    
            </div>
            <p className="text-lg font-bold mt-2 text-slate-400">...Syncing Data</p>
        </div>
        </div>
    </Page>    
   )  
}

const {connectionStatus} = useConnection();
  
if(!connectionStatus){
  return (
    <Page name="sync">
      <div className="w-full h-screen bg-slate-100 flex flex-col justify-center items-center p-5">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center h-[150px] w-[150px] bg-white rounded-full">
            <IoCloudOfflineOutline className="text-[5em] text-slate-400" />    
          </div>
          <p className="text-lg font-bold mt-2 text-slate-400">There is no internet connection</p>
        </div>
        <div className="flex flex-col gap-y-2 mt-12">
          <button onClick={() => f7router.navigate('/login-pin/')} className="rounded w-[250px] h-[2.5em] px-5 bg-slate-300">
            <h6 className="font-semibold text-lg text-slate-500">
              Continue Offline
            </h6>    
          </button>
          <button className="rounded w-[250px] h-[2.5em] px-5 border-2 border-slate-300">
            <h6 className="text-slate-500 font-semibold text-lg">
              Reload
            </h6>    
          </button>
        </div>
      </div>
    </Page>    
  )
}


  return (
    <Page name="sync">
      <div className="w-full h-screen bg-green-100 flex flex-col justify-center items-center p-5">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center h-[150px] w-[150px] bg-white rounded-full relative">
            <div className="w-[40px] h-[40px] rounded-full absolute bg-green-400 right-[0px] bottom-[0px] flex justify-center items-center">
              <FaCheck className="text-white" />
            </div>
            <AiOutlineFileSync className="text-[5em] text-green-400" />    
          </div>
          <p className="text-lg font-bold mt-2 text-primary">Syncing Complete</p>
        </div>
        
        <button onClick={() => f7router.navigate('/dashboard/')} className="rounded w-auto h-[30px] sm:h-[2.5em] px-5 bg-primary mt-12">
          <h6 className="text-white font-semibold sm:text-lg text-[0.95em]">
            Continue to Login
          </h6>    
        </button>
      </div>
    </Page>    
  )
}
