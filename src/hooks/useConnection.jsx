import {useEffect, useState} from 'react';
import { Network } from '@capacitor/network';

export default function useConnection() {
    const [connectionStatus, setConnectionStatus] = useState(true);

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      setConnectionStatus(status?.connected);
      console.log('Network status:', status);
    };
  
    useEffect(() => {
      
  
      logCurrentNetworkStatus();
  
      Network.addListener('networkStatusChange', status => {
        console.log('Network status changed', status);
        setConnectionStatus(status?.connected);
      });
    }, [connectionStatus]);

    return {connectionStatus};
}
