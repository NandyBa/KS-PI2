var StableQiVault = artifacts.require("stableQiVault"); 
var Delegate = artifacts.require("delegate"); 

module.exports = (deployer, network, accounts) => {
   deployer.then(async () =>{
    //await deployVault(); 
    await deployDelegate(); 
    await deployRecap(); 
   });
}; 

/*async function deployVault(){
    vault = await StableQiVault.new('0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',120,"vault","VAULT",'0xB3814F67B391B51945cAdD52156970209DD412a4','0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',""); 
}*/

async function deployDelegate(){
    delegate = await Delegate.new('0x8D6CeBD76f18E1558D4DB88138e2DeFB3909fAD6', "0x98eb27E5F24FB83b7D129D789665b08C258b4cCF"); 
}

async function deployRecap() {
	//console.log("Vault " + vault.address)
    console.log("Delegate " + delegate.address)
}

/*
constructor(
        address ethPriceSourceAddress, 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e ethusd on chainlink testnet goerli
        uint256 minimumCollateralPercentage, 120
        string memory name, 
        string memory symbol,
        address _mai, 0xB3814F67B391B51945cAdD52156970209DD412a4
        address _collateral, 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
        string memory baseURI 
    )
*/