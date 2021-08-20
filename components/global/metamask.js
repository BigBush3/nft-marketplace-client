import Web3 from "web3"

const connectMetaMask = async ()=>{
  let userAddress, web3
  if (window.ethereum) {
    web3 = await new Web3(window.ethereum);
    console.log("connect MetaMask");

    try {
      await window.ethereum.enable().then(async function () {
        // User has allowed account access to DApp...
        console.log("step2");
        if (web3) {
          if (window.ethereum.selectedAddress !== undefined) {
            userAddress = window.ethereum.selectedAddress;
          } else if (web3.givenProvider.MetamaskInpageProvider !== undefined) {
            userAddress = web3.givenProvider.MetamaskInpageProvider;
          } else if (web3.givenProvider.selectedAddress !== undefined) {
            userAddress = web3.givenProvider.selectedAddress;
          }
        }
      })
	  console.log("userAddress: ", userAddress)
      return {userAddress, web3}
    } catch (e) {
      // User has denied account access to DApp...
      console.log(e);
    }
  }
  // Legacy DApp Browsers
  else if (window.web3) {
    web3 = await new Web3(web3.currentProvider);
    console.log(web3);
    console.log("connect MetaMask");
    if (web3) {
      if (window.ethereum.selectedAddress !== undefined) {
        userAddress = window.ethereum.selectedAddress;
      } else if (web3.givenProvider.MetamaskInpageProvider !== undefined) {
        userAddress = web3.givenProvider.MetamaskInpageProvider;
      } else if (web3.givenProvider.selectedAddress !== undefined) {
        userAddress = web3.givenProvider.selectedAddress;
      }
      console.log("userAddress: ", userAddress);
    }
    return {userAddress, web3}
  }
  // Non-DApp Browsers
  else {
    console.log("You have to install MetaMask !");
  }
}

export default connectMetaMask