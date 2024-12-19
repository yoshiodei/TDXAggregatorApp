import React, { useState, useEffect } from 'react'
import store from '../js/store'
import farmerImage from '../assets/farmer-icon.png'
import {
    Page, f7,
  } from 'framework7-react'
import Navbar from '../components/navbar'
import axios from 'axios'


export default function SubmittedTransactions({ f7router }) {
  const [submittedTransactionList, setSubmittedTransactionList] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.post(
        `https://torux.app/api/user/orderlist/${store.state.user.token}`,
        {}, // This is the request body, currently empty
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.state.user.access_token}`,
          },
        }
      );
      const transactionData = response.data;
      console.log('transaction Data', transactionData);
      setSubmittedTransactionList(transactionData);
    } catch (error) {
      console.error('Error fetching data:', error);
      f7.dialog.alert('Unable to fetch data','');
    }
}

  useEffect(() => {
    fetchTransactions();
  }, []);

  if(submittedTransactionList?.length === 0){
    return(
      <Page name="home"> 
        <div className="h-[100vh] w-[100vw] bg-background-primary relative">
          <Navbar f7router={f7router} title="Submitted Transactions" menu={true} />
          <h6 className="mt-8 text-[1.2em] font-bold text-slate-400 text-center p-2 sm:p-5">There are no submitted transactions</h6>    
        </div>
      </Page>  
    )
  }

  return (
    <Page name="home"> 
      <div className="h-[100vh] w-[100vw] bg-background-primary relative">
        <Navbar f7router={f7router} title="Submitted Transactions" menu={true} />
        <div className="h-[4em] flex justify-center items-center bg-white border-t border-slate-400">
          <h4 className="font-bold text-[1.4em] text-slate-400">{`Total Transactions: ${submittedTransactionList.length-1}`}</h4>
        </div>
        <div className="flex flex-col gap-y-3 items-center p-2 sm:p-5">
          {
            submittedTransactionList.map((transaction, index) => {
              if(transaction.farmer){
                return (
                  <div className="flex flex-col p-2 rounded bg-white border border-slate-200 h-auto w-full" key={transaction.order_tnx}>
                    <div className="flex gap-x-2 items-center">
                      <div className="rounded h-[1.8em] w-[1.8em] bg-slate-300 flex justify-center items-center">
                        <img src={farmerImage} alt="commodity" className="h-[1.5em]"  />
                      </div>
                      <h6 className="flex-1 text-[1.1em] font-bold text-slate-500">{`${index+1}. ${transaction.farmer}`}</h6>  
                    </div>            
                    <div className="h-[1px] bg-slate-200 w-full my-2" />
                    <div className="flex gap-x-2 items-center">
                      <h6 className="w-[100px] text-[1.2em] text-left font-semibold text-slate-600">Status:</h6>
                      <h6 className="flex-1 text-[1.05em] font-semibold text-slate-600">{transaction.paymentstatus}</h6>  
                    </div>            
                    <div className="flex gap-x-2 items-center">
                      <h6 className="w-[100px] text-[1.2em] text-left font-semibold text-slate-600">Weight:</h6>
                      <h6 className="flex-1 text-[1.05em] font-semibold text-slate-600">{`${transaction.quantity} KG`}</h6>  
                    </div>    
                    <div className="flex gap-x-2 items-center">
                      <h6 className="w-[100px] text-[1.2em] text-left font-semibold text-slate-600">Total Cost:</h6>
                      <h6 className="flex-1 text-[1.05em] font-semibold text-slate-600">{`₵ ${transaction.total_cost}`}</h6>  
                    </div>    
                    <div className="flex gap-x-2 items-center">
                      <h6 className="w-[100px] text-[1.2em] text-left font-semibold text-slate-600">Time:</h6>
                      <h6 className="flex-1 text-[1.05em] font-semibold text-slate-600">{transaction.created_at}</h6>  
                    </div>    
                  </div>
                )
              }
            })
          }  
        </div> 
      </div>
    </Page> 
  )
}
