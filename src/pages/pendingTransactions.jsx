import React, { useEffect, useState } from 'react'
import store from '../js/store';
import Navbar from '../components/navbar';
import { Page } from 'framework7-react';

export default function PendingTransactions() {
  const [pendingTransactionsList, setPendingTransactionsList] = useState([]);  
  
  useEffect(() => {
    setPendingTransactionsList(store.state?.user?.pendingTransactions || []);
  }, []);  

  if(pendingTransactionsList?.length === 0){
    return(
      <Page name="home"> 
        <div className="h-[100vh] w-[100vw] bg-background-primary p-2 sm:p-5 relative">
          <Navbar title="Pending Transactions" menu={true} />
          <h6 className="mt-8 text-[1.2em] font-bold text-slate-400 text-center">There are no pending transaction</h6>    
        </div>
      </Page>  
    )
  }

  return (
    <Page name="home"> 
        <div className="h-[100vh] w-[100vw] bg-background-primary relative">
          <Navbar title="Pending Transactions" menu={true} />
          <div className="flex flex-col gap-y-3 items-center p-2 sm:p-5 h-full">  
            {
                pendingTransactionsList.map((transaction) => (
                <button key={transaction.id} className="flex flex-col gap-y-2 rounded bg-white sm:p-3 p-2 h-auto">
                    <h6 className="">{transaction.commodity.split(", ")[1]}</h6>
                    <div className="bg-slate-300 h-[1px] w-full" />
                    <div className="flex gap-x-2">
                    <h6 className="w-[80px] text-[0.95em] font-semibold text-slate-600">Phone:</h6>
                    <h6 className="flex-1 text-[0.95em] font-semibold text-slate-600">{transaction.mobile}</h6>  
                    </div>            
                    <div className="flex gap-x-2">
                    <h6 className="w-[80px] text-[0.95em] font-semibold text-slate-600">Weight:</h6>
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
