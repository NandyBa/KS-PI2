import {  useState } from "react";
import { Link, Outlet } from "react-router-dom"; 

import mmFox from "../img/MetaMask_Fox.png";
// import MyVaults from "./MyVaults"
import Navbar from "./Navbar";

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
        <nav className="navMenu">
            <ul>
            <li className="bout Home">
                <Link to="/">Home </Link>
            </li>
            <li className="bout delegate">
                <Link to="/Delegate">Delegate</Link>
            </li>
            <li className="bout Withdraw">
                <Link to="/WithdrawNFT">Withdraw</Link>
            </li>
            <li className="bout Borrow">
                <Link to="/Borrow">Borrow</Link>
            </li>
            <li className="bout Repay">
                <Link to="/Repay">Repay</Link>
            </li>
            </ul>
        </nav>
      
        <div>
        {currentAccount ? handleClick() : connectWalletButton()}
        </div>
        <div>
            {/* < MyVaults 
                currentAccount={connected}
            /> */}
        </div>   
    </div>
  );

 
}

export default Home;