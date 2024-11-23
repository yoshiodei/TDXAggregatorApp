export const detectNetwork = (number, mobileNetworks) => {
    const prefix = number.slice(0, 3);
  
    for (let network in mobileNetworks) {
      
      if (mobileNetworks[network].includes(prefix)) {
        return network;
      }
    }
  
    return '';
  }