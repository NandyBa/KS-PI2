import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
//import AppRoutes from "../../Routes";
import Web3 from "web3";
import Login from "./Login/Login";
import ChainInfo from "./ChainInfo";

export const Main = (props) => {

  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const onLogin = async (provider) => {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0){
      console.log("Please connect to Metamask")
    }

    else{
      setCurrentAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const onLogout = () => {
    setIsConnected(false);
  };


  return (
    <div>
    <header>
      <div className="logo">Gelato</div>

      <nav className="nav-bar">
        <ul>
          <li>
            <a className="active" href="/">Home</a>
          </li>
          <li>
            <a href="/automate">Automate</a>
          </li>
        </ul>
      </nav>
    </header>


    <div className="login">
      {!isConnected && <Login onLogin={onLogin} onLogout={onLogout}/>}
      {isConnected && <ChainInfo currentAccount={currentAccount} />}
    </div> 


    </div>
  );
}

export default Main;
