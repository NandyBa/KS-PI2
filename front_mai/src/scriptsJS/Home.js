import {  useState } from "react";
import mmFox from "../img/MetaMask_Fox.png";
import MyVaults from "./MyVaults"

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);


  const connectWalletHandler = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setCurrentAccount(accounts[0]);
    // check if metamask is connected to goerli testnet
    // const chainId = await ethereum.request({ method: "eth_chainId" });
    // if (chainId !== "0x58E") {
    //   alert("Please connect to polygon zk evm Testnet");
    // };
  };

  const connectWalletButton = () => {
    return (
      <div className="mm-button">
        <button onClick={connectWalletHandler} className="button-4">
          <img src={mmFox} width={20} height={20}></img>
          Connect Wallet
        </button>
      </div>
    );
  };

  const handleClick = () => { 
    const firstSix = currentAccount.substring(2, 6).toUpperCase();
    const lastFour = currentAccount.substring(currentAccount.length - 4).toUpperCase();
    const account = "0x" +firstSix + "..." + lastFour; // affiche l'addresse proprement

    return (
      <div>
        {account}
      </div>
    );
  };

  var connected = false;
  if(currentAccount){
    connected = true;
  }

  return (
    <div>
        <nav>
            <li>Home</li>
            <li>{currentAccount ? handleClick() : connectWalletButton()}</li>
        </nav>
        <div>
            < MyVaults 
                currentAccount={connected}
            />
        </div>   
    </div>
  );
}

export default Home;