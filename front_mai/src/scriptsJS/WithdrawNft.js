import { ethers } from "ethers";
import { useState } from "react";

function WithdrawNft(){

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const delegateAddress = require("./adresses.json").delegate;
    const delegateAbi = require("../ABIS/delegate.json");
    const delegateContract = new ethers.Contract(delegateAddress, delegateAbi, provider);

    const [tokenId, setTokenId] = useState(0); 
    const [vaultName, setName] = useState(""); 

    const handleChampToken = (event)=>{
        setTokenId(event.target.value)
    }

    // a modifier plus tard par un menu déroulant pour sélectionner les différents vault présent sur le network
    const handleChampVault = (event)=>{
        setName(event.target.value)
    }

    async function withdraw(){
        
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const delegate = new ethers.Contract(delegateAddress, delegateAbi, signer);

   
    const tx = await delegate.withdraw_NFT(vaultName, tokenId);
        //console.log("Tx hash : ${tx.hash}"); 
    }

    return(
    <div>
        <text>tokenID : </text>
        <input className="barre" type="number"value={tokenId} onChange={e=>handleChampToken(e)}/>
        
        <br></br>
        <text>Vault : </text>
        <input className="barre" type="text"value={vaultName} onChange={e=>handleChampVault(e)}/>
        <br></br>
        <button onClick={withdraw}>Withdraw my NFT</button>
        
    </div>
    )
}
export default WithdrawNft; 