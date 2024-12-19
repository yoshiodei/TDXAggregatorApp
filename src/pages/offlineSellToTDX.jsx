import React, { useEffect, useState } from 'react'
import OfflineNavbar from '../components/offlineNavbar'
import { f7, Page } from 'framework7-react'
import { IoIosArrowDown } from "react-icons/io";
import { MdCloudOff } from 'react-icons/md'
import { nanoid } from 'nanoid'
import store from '../js/store'

export default function OfflineSellToTDX({ f7router }) {
  const [commodityList, setCommodityList] = useState([]);
  const [siloList, setSiloList] = useState([]);
  const [commodityValue, setCommodityValue] = useState('');
  const [siloValue, setSiloValue] = useState('');
  const [farmerNumber, setFarmerNumber] = useState('');
  const [weight, setWeight] = useState('');
  
  useEffect(() => {
    const silosArray = JSON.parse(localStorage.getItem('silos'));
    const commoditiesArray = JSON.parse(localStorage.getItem('commodities'));
    
    if(!silosArray?.length || !commoditiesArray?.length){
      f7.dialog.alert('Data not available','');
    } else {
      setCommodityList(commoditiesArray);
      setSiloList(silosArray);
    }
  }, []);

  const findUserByNumber = (users, mobile) => {
    return users.find((user) => user.mobile === mobile) || null;
  };

  const handleSubmit = () => {
    if(!commodityValue || !siloValue || !weight || !weight){
      f7.dialog.alert('Fields cannot be left empty','');
      return;    
    }
    if(farmerNumber.length !== 10){
      f7.dialog.alert('Farmer number is less than 10 digits','');
      return;
    } else {  
      const id = nanoid();
      const existingUsers = JSON.parse(localStorage.getItem('users'));
      const transactionData = {
        id,
        mobile: farmerNumber,
        commodity: commodityValue,
        community_id: store.state.offlineUser.community_id,
        siloid: siloValue,
        quantity: weight,
      };

      const matchedUser = findUserByNumber(existingUsers, store.state.offlineUser.mobile);
      console.log('This offline mobile', store.state.offlineUser.mobile);
      console.log('This offline matched user:', matchedUser);
      if (!matchedUser?.pendingTransactions){
       const newMatch = { ...matchedUser, pendingTransactions:[transactionData]};

        const updatedUserList = existingUsers.map((user) => (
            (user.mobile === newMatch.mobile) ? newMatch : user
         )
        )

        console.log('updated user list', updatedUserList);
        if(!updatedUserList?.length){
          f7.dialog.alert('Upate user error.','');
          return;
        }

        localStorage.setItem('users', JSON.stringify(updatedUserList));
        f7router.navigate('/offline-sale-complete/');
        return;
      }

      else {
        const updatedUser = { ...matchedUser, pendingTransactions: [ ...matchedUser?.pendingTransactions, transactionData ] };
        console.log('user update', updatedUser);  
        const updatedUserList = existingUsers.map((user) => (
            (user.mobile === updatedUser.mobile) ? updatedUser : user
         )
        )

        console.log('updated user list', updatedUserList);
        if(!updatedUserList?.length){
          f7.dialog.alert('Upate user error.','');
          return;
        }

        localStorage.setItem('users', JSON.stringify(updatedUserList));
        f7router.navigate('/offline-sale-complete/');
        return;
      }
    }
  };

  return (
    <Page name="home">
      <div className="relative w-full flex flex-col min-h-screen overflow-hidden">
        <div className="bg-red-500 text-white flex items-center justify-center p-1 text-[0.9em] gap-x-1">
          <MdCloudOff  />
          <p className=" text-semibold">You are offline</p>
        </div>
        <OfflineNavbar  title="Sell to TDX" goBack={true} f7router={f7router} />
        <div className="flex-1 w-full sm:p-5 p-3 flex flex-col justify-between gap-y-5 bg-background-primary">
          <div>
            <div className="sm:mb-3 mb-2">
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
            <div className="sm:mb-3 mb-2">
                <label className="text-[0.9em] font-bold text-slate-600 mb-1">Silo</label>
                <div className="rounded bg-white h-[2.5em] w-full relative border border-slate-200">
                <div className="w-[1.2em] h-[1.2em] flex justify-center items-center z-10 absolute top-[0.7em] right-[10px]">
                  <IoIosArrowDown />
                </div>     
                <select className="rounded px-3 h-full w-full" value={siloValue} onChange={(e) => setSiloValue(e.target.value) }>
                  <option value="">Select Silo</option>
                  {siloList.map((silo) => {
                    if(silo.siloname){
                      return (<option key={silo.siloname} value={silo.token}>{silo.siloname}</option>)
                    }
                    })}
                </select> 
                </div>
            </div>
            <div className="w-full sm:mb-3 mb-2">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Weight</label>
              <div className="rounded w-full h-[2.5em] bg-white relative ps-2 pe-5 border border-slate-200">
                <h6 className="absolute top-[0.5em] right-[10px] text-[0.9em]">KG</h6>
                <input min={1} type="number" className="rounded w-full h-full" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
            </div>
            <div className="w-full mb-8">
              <label className="text-[0.9em] font-bold text-slate-600 mb-1">Farmer Number</label>
              <div className="rounded w-full h-[2.5em] bg-white relative px-2 border border-slate-200">
                <input placeholder='Please enter farmer number' min={1} type="number" className="rounded w-full h-full" value={farmerNumber} onChange={(e) => setFarmerNumber(e.target.value)} />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="flex justify-center items-center w-full h-[35px] sm:h-[3em] rounded bg-primary mb-2">
              <h6 className="text-lg font-semibold text-white">Submit</h6>
            </button>
          </div>
        </div>  
      </div>
    </Page>
  )
}
