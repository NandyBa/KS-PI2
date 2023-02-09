import { ethers } from "ethers";
import { useState } from "react";



function Delegate(){


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const delegateAddress = require("./adresses.json").delegate;
    const delegateAbi = require("../ABIS/delegate.json");
    const delegateContract = new ethers.Contract(delegateAddress, delegateAbi, provider);

    const WethAddress = require("./adresses.json").Weth_Vault;
    const WethAbi = require("../ABIS/WethVault.json").abi;
    const WethContract = new ethers.Contract(WethAddress, WethAbi, provider);


    const [parameters, setParameters] = useState({
                                                    tokenId:undefined,
                                                    vaultName:undefined,
                                                    owner:undefined,
                                                    borrower:undefined,
                                                    amount:undefined
                                                });
    const [text, setText] = useState("Approve");

    // a modifier plus tard par un menu déroulant pour sélectionner les différents vault présent sur le network
    const handleInput = (field) => (event) => {
        setParameters({
            ...parameters,
            [field]: event.target.value
        });
    };

    const handleClick = async () => {
        
        await approveERC721();
        setText('deposit ERC721'); 
        await depositERC721();
        setText("approve delegation"); 
        await approveDelegation();
      };

    async function approveERC721(){

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const WethContract = new ethers.Contract(WethAddress, WethAbi, signer);

        const tx = await WethContract.approve(delegateAddress, parameters.tokenId); 
        console.log("Tx hash : ${tx.hash}"); 
    }

     async function depositERC721(){

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const delegateContract = new ethers.Contract(delegateAddress, delegateAbi, provider, signer);
        const tx = await delegateContract.depositERC721(parameters.tokenId, parameters.vaultName); 
        console.log("Tx hash : ${tx.hash}"); 

    }

    async function approveDelegation(){
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const delegateContract = new ethers.Contract(delegateAddress, delegateAbi, provider, signer);
        const tx = await delegateContract.approveDelegation(parameters.owner, parameters.borrower, parameters.vaultName, parameters.tokenId, parameters.amount);
        console.log("Tx hash : ${tx.hash}"); 

    }
    return(
        <div>
            <text>tokenID : </text>
            <input className="barre" type="number"value={parameters.tokenId} onChange={handleInput("tokenId")}/>
            
            <br></br>
            <text>Vault : </text>
            <input className="barre" type="text"value={parameters.vaultName} onChange={handleInput("vaultName")}/>
            <br></br>
            <text>Lender address : </text>
            <input className="barre" type="text"value={parameters.owner} onChange={handleInput("owner")}/>
            <br></br>
            <text>Borrower address : </text>
            <input className="barre" type="text"value={parameters.borrower} onChange={handleInput("borrower")}/>
            <br></br>
            <text>Amount : </text>
            <input className="barre" type="text"value={parameters.amount} onChange={handleInput("amount")}/>
            <div>
            <button onClick={handleClick}>{text}</button>
            
            </div>
        </div>
    )
    }
export default Delegate; 