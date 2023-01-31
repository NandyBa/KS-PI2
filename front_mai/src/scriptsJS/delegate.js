import { ethers } from "ethers";
import { useEffect, useState } from "react";



function Delegate(){


    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const delegateAddress = require("./adresses.json").delegate;
    const delegateAbi = require("../ABIS/delegate.json");
    const delegateContract = new ethers.Contract(delegateAddress, delegateAbi, provider);

    const WethAddress = require("./adresses.json").Weth_Vault;
    const WethAbi = require("../ABIS/WethVault.json").abi;
    const WethContract = new ethers.Contract(WethAddress, WethAbi, provider);

    const [tokenId, setTokenId] = useState(null); 
    const [vaultName, setName] = useState(""); 
    const [owner, setOwnerAddress] = useState(""); 
    const [borrower, setBorrowerAddress] = useState(""); 
    const [amount, setAmount] = useState(0); 

    const handleChampToken = (event)=>{
        setTokenId(event.target.value)
    }

    // a modifier plus tard par un menu déroulant pour sélectionner les différents vault présent sur le network
    const handleChampVault = (event)=>{
        setName(event.target.value)
    }

    const handleChampOwner = (event)=>{
        setOwnerAddress(event.target.value)
    } 
    const handleChampBorrower = (event)=>{
        setBorrowerAddress(event.target.value)
    } 
    const handleChampAmount = (event)=>{
        setAmount(event.target.value)
    }

    async function approveERC721(){
    await WethContract.approve(delegateAddress,tokenId ); 
    }

    async function depositERC721(){
        await delegateContract.depositERC721(tokenId, vaultName); 
    }

    async function approveDelegation(){
        await delegateContract.approveDelegation(owner, borrower, vaultName, tokenId, amount); 
    }
    return(
        <div>
            <text>tokenID : </text>
            <input className="barre" type="number"value={tokenId} onChange={e=>handleChampToken(e)}/>
            
            <br></br>
            <text>Vault : </text>
            <input className="barre" type="text"value={vaultName} onChange={e=>handleChampVault(e)}/>
            <br></br>
            <text>Lender address : </text>
            <input className="barre" type="text"value={owner} onChange={e=>handleChampOwner(e)}/>
            <br></br>
            <text>Borrower address : </text>
            <input className="barre" type="text"value={borrower} onChange={e=>handleChampBorrower(e)}/>
            <br></br>
            <text>Amount : </text>
            <input className="barre" type="text"value={amount} onChange={e=>handleChampAmount(e)}/>
        </div>
    )
    }
export default Delegate; 