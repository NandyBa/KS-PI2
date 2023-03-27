import {  useState } from "react";

import mmFox from "../img/MetaMask_Fox.png";
// import MyVaults from "./MyVaults"
import Delegate from "./Delegate";
import WithdrawNft from "./WithdrawNft";
import Borrow from "./Borrow";
import Repay from "./Repay";

import React, { Component } from 'react';

import { ethers } from "ethers";


class Metamask extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    this.setState({ selectedAddress: accounts[0] })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <button onClick={() => this.connectToMetamask()}>Connect to Metamask  <img src={mmFox} width={20} height={20}></img> </button>
      )
    } else {
      var address = "0x" + this.state.selectedAddress.substring(2, 6) + "..." + this.state.selectedAddress.substring(this.state.selectedAddress.length - 4, this.state.selectedAddress.length)
      return (
        <p>Welcome {address}</p>
      );
    }
  }

  render() {

      return (
        <div>
          {this.renderMetamask()}
          <Home />
        </div>
      )
  }
}

function getHtmlOutput() {
  // This function returns a string with HTML tags
  return Delegate();
}

function Home() {
  
  const [htmlOutput, setHtmlOutput] = useState(false);

  async function handleClick(variable) {
    setHtmlOutput(variable);
  }

  return (
    <div>
      <p>Am I a <button onClick={() => setHtmlOutput(true)}>Delegator</button> or a <button onClick={() => setHtmlOutput(false)}>Borrower</button> ?</p>
      {htmlOutput && <div><h1>Delegation Dashboard</h1> <Delegate /> <h1>Withdraw Nft</h1> <WithdrawNft/> </div> }
      {!htmlOutput && <div><h1>Borrow Dashboard</h1> <Borrow /> <h1>Repay Dashboard</h1> <Repay/> </div>}
    </div>
  );
}

export default Metamask;