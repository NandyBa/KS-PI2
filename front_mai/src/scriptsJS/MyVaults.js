// Dans cette Selection, L'utilisateur voit en direct la santé des vaults dont il a déposé le nft sur notre contrat
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const delegateAddress = require("./adresses.json").delegate;
const delegateAbi = require("../ABIS/delegate.json").abi;
const delegateContract = new ethers.Contract(delegateAddress, delegateAbi);

const WethAddress = require("./adresses.json").Weth_Vault;
const WethAbi = require("../ABIS/WethVault.json").abi;
const WethContract = new ethers.Contract(WethAddress, WethAbi);

async function getNftOwned(vault){
  return await delegateContract.getNftByOwner(vault);
}

async function test(){
  return await WethContract._minimumCollateralPercentage();
}

async function GetHealthFactor(vault){
  // get the nft ids by calling the function getNftByOwner
  var ids = await getNftOwned(vault);
  console.log("ids",ids);
  var idsArray = ids.split(",");
  console.log("idsArray",idsArray);
    // get the health factor of each nft in the array
  var healthFactorArray = [];
  for (var i = 0; i < idsArray.length; i++) {
    var healthFactor = await WethContract.getHealthFactor(idsArray[i]); // faie un switchcase pour recupere le contrat correspondant au bon vault
    healthFactorArray.push(healthFactor);
  }
  return healthFactorArray;
}

async function TestV(){
  var idsArray = test(); //GetHealthFactor("WETH");
  const vault = "WETH";
  //test
  const [data, setData] = useState(null);
  useEffect(() => {
    test().then((x) => {
        setData(x);
      });
  }, []); //rien dans les [] car on veut que ça se lance qu'une seule fois
  console.log("data",data);
}


function MyVaults(connected){
  
  // check if metamask is connected

  const noConnect = () => {
    return (<div>Please connect your Wallet first</div>)
  };

  const connectContent = () => {
    // Ici on doit récuperer les ids de tous les nfts que l'on a déposé 
    // sur notre contrat et afficher le health factor de chaque vault
    return(<div>Ici s'affichent les stats </div>)
  };
  TestV();

  return (
    <div>
      MetaMask Connected: {connected? connectContent() : noConnect()}
    </div>
  );
}

export default MyVaults;

// const [nftIds, setnftIds] = useState(null);
// useEffect(() => {
//   getNftOwned(vault).then((ids) => {
//     nftIds = ids.split(",");});
// }, []); //rien dans les [] car on veut que ça se lance qu'une seule fois    
// return nftIds; 