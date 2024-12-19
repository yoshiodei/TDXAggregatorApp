// import React, { useState } from "react";
// import { Page, Navbar, BlockTitle, List, ListInput, Button, Block } from "framework7-react";
// import { SmsSender } from 'capacitor-sms-sender'

// export default function TestPage() {
    
//   let opts = {
//       id: 1,
//       sim: 0,
//       phone: '+233574940523',
//       text: 'Hi There from TDX'
//   }

//   const handleSubmit = async () => {
//     SmsSender.send(opts)
//       .then(res => {
//         console.log(res);
//       });
  
//     SmsSender.addListener('smsSenderDelivered', res => {
//       console.log(res)
//     })
//   }


//   return (
//     <Page>
//       <Navbar title="Send SMS" />
//       <Block strong>
//         <p>Click the button below to send an SMS:</p>
//         <Button fill onClick={() => handleSubmit()}>
//           Send SMS
//         </Button>
//       </Block>
//     </Page>
//   )
// }
