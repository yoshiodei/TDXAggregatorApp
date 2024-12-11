export const detectNetwork = (number, mobileNetworks) => {
    const prefix = number.slice(0, 3);
  
    for (let network in mobileNetworks) {
      
      if (mobileNetworks[network].includes(prefix)) {
        return network;
      }
    }
  
    return '';
  }

  export const formatPrice = (num) => {
    const number = Number(num);
    if (typeof number !== "number" || isNaN(number)) {
      return null; // Return null if input is not a valid number
    }
    
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }