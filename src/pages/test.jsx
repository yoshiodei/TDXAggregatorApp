import React, { useState } from "react";
import { Page, Navbar, BlockTitle, List, ListInput, Button, Block } from "framework7-react";
import { Plugins } from "@capacitor/core";

const { SMS } = Plugins;

export default function TestPage() {
    
    const handleSubmit = async () => {
        //const charge = calculateCharge(Number(formData.weight));
       // setCourierCharge(charge);
    
        try {
          const result = await SMS.send({
            numbers: ["+233574940523"], // Replace with tdx's number
            text: 'test message sent !!!',
          });
          console.log("SMS Sent", result);
        } catch (error) {
          console.error("Failed to send SMS:", error);
          // Run the SQLITE here if failed 
        }
      };


  return (
    <Page>
      <Navbar title="Send SMS" />
      <Block strong>
        <p>Click the button below to send an SMS:</p>
        <Button fill onClick={() => handleSubmit()}>
          Send SMS
        </Button>
      </Block>
    </Page>
  )
}
