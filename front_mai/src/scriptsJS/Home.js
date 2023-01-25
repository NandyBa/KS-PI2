import { ethers } from "ethers";
import { useEffect, useState } from "react";
import mmFox from "../img/MetaMask_Fox.png";
import MyVaults from "./MyVaults"

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);


  const connectWalletHandler = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setCurrentAccount(accounts[0]);
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
    const account = "0x" +firstSix + "..." + lastFour;

    return (
      <div>
        <p>{account}</p>
      </div>
    );
  };

  return (
    <div>
        <nav>
            <lu>
                <li>Home</li>
                <li>{currentAccount ? handleClick() : connectWalletButton()}</li>
            </lu>
        </nav>
        <div>
            < MyVaults />
        </div>   
    </div>
  );
}

export default Home;