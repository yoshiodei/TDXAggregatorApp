import React, { useEffect, useState } from 'react'
import store from '../js/store';
import OfflineNavbar from '../components/offlineNavbar';
import { Page } from 'framework7-react';
import commodityImage from '../assets/maize-white.png'

export default function offlinePendingTransactions({ f7router }) {
    const [pendingTransactionsList, setPendingTransactionsList] = useState([]);  
  
    useEffect(() => {
      setPendingTransactionsList(store.state?.user?.pendingTransactions || []);
    }, []);  
  
    if(pendingTransactionsList?.length === 0){
      return(
        <Page name="home"> 
          <div className="h-[100vh] w-[100vw] bg-background-primary relative">
            <OfflineNavbar f7router={f7router} title="Pending Transactions" menu={true} />
            <h6 className="mt-8 text-[1.2em] font-bold text-slate-400 text-center p-2 sm:p-5">There are no pending transaction</h6>    
          </div>
        </Page>  
      )
    }
  
    return (
      <Page name="home"> 
          <div className="min-h-[100vh] w-[100vw] bg-background-primary relative">
            <OfflineNavbar f7router={f7router} title="Pending Transactions" menu={true} />
            <div className="flex flex-col gap-y-3 items-center p-2 sm:p-5">  
              {
                  pendingTransactionsList.map((transaction) => (
                  <button onClick={() => f7router.navigate(`/pending-transaction/${transaction?.id}`) } key={transaction.id} className="flex flex-col rounded bg-white sm:p-3 p-2 h-auto border border-slate-200">
                    <div className="flex gap-x-2 items-center">
                      <div className="rounded h-[1.8em] w-[1.8em] bg-slate-400 flex justify-center items-center">
                        <img src={commodityImage} alt="commodity" className="h-[1.5em]"  />
                      </div>
                      <h6 className="flex-1 text-[1.2em] font-bold text-slate-500">{transaction.commodity.split(", ")[1]}</h6>  
                    </div>            
                    <div className="h-[1px] bg-slate-200 w-full my-2" />
                    <div className="flex gap-x-2 items-center">
                      <h6 className="w-[80px] text-[1.2em] text-left font-semibold text-slate-600">Phone:</h6>
                      <h6 className="flex-1 text-[0.95em] font-semibold text-slate-600">{transaction.mobile}</h6>  
                    </div>            
                    <div className="flex gap-x-2 items-center">
                      <h6 className="w-[80px] text-[1.2em] text-left font-semibold text-slate-600">Weight:</h6>
                      <h6 className="flex-1 text-[0.95em] font-semibold text-slate-600">{`${transaction.quantity} KG`}</h6>  
                    </div>            
                  </button>
                  ))
              } 
            </div> 
          </div>
        </Page>
    )
  }
  