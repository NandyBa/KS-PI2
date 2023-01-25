// Dans cette Selection, L'utilisateur voit en direct la santé des vaults dont il a déposé le nft sur notre contrat
import { ethers } from "ethers";
import { useEffect, useState } from "react";

async function MyVaults(){
    // const [isConnected, setIsConnected] = useState(false);

    // useEffect(() => {
    //   async function checkConnection() {
    //     if (window.ethereum) {
    //       const provider = new ethers.providers.Web3Provider(window.ethereum);
    //       try {
    //         await provider.getNetwork();
    //         setIsConnected(true);
    //       } catch (error) {
    //         setIsConnected(false);
    //       }
    //     } else {
    //       setIsConnected(false);
    //     }
    //   }
    //   checkConnection();
    // }, []);
  return (
    <div>
      <p>MetaMask Connected: {isConnected ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default MyVaults;