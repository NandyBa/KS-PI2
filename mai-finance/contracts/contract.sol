// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2; // regarder la version sur les contracts de qidao 0.5.5 demander à Nandy quel est le mieux 

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract delegate {


    event Authorized(address indexed owner, address indexed borrower, uint amount); 
    
    mapping(address => bool) admin;

    constructor() public {
        admin[msg.sender] = true;
        vaultAddress["WETH"] = address(0x98eb27E5F24FB83b7D129D789665b08C258b4cCF); // WETH vault address on ethereum
    }


    // mapping to find to who the owner has delegated and how much
    // delegator=>borrower=>amount delegated  
    mapping(address=> mapping(address=>uint)) public hasDelegated; 

    //keep track of the orignil owner adress of the nft vault
    // original_owner=> nft_id
    mapping(address=>uint256[]) public isOwner;


    mapping(string => address) vaultAddress;

    mapping(string => address) tokenAddress;

    

    // ERC721 deposit
    function erc721_deposit(string _vault, uint256 _erc721_Id, uint256 _maxAmountToBorrow) public{ // ATTENTION vérifier si le erc 721 est bien défini comme un nft de mai finance
        // check that the msg sender is the owner of the nft
        require(tokenAddress[_vault].ownerOf(_erc721_Id)==msg.sender, "You must be the owner of the token");
        // call safeTransferFrom in the vault contract
        tokenAddress[_vault].safeTransferFrom(msg.sender, address(this), _erc721_Id); // ????? fonctionne ?????
        // check if our contract received the nft
        require(tokenAddress[_vault].ownerOf(_erc721_Id)==address(this), "the ERC721 is not in our contract");
        // add the nft to the mapping isOwner
        isOwner[msg.sender].push(_erc721_Id);
        // emit event
        emit Deposited(msg.sender, _erc721_Id);

        // try to borrow the max amount to borrow
        uint256 initialBalance = tokenAddress[_vault].balanceOf(address(this));
        // comment vérifier le montant max à emprunter ?
        // borrow the amount from Qidao
        tokenAddress[_vault].borrowToken(vaultID, _maxAmountToBorrow, _front);
        // check the amount of _vault in our contract
        uint256 finalBalance = tokenAddress[_vault].balanceOf(address(this));
        // check that the amount borrowed is equal or superior to the amount of _vault in our contract
        require(finalBalance-initialBalance>=_maxAmountToBorrow, "the amount borrowed hasn't been received");
        // 

    }


    // fonction pour approuver la délagation
    // voir comment remplacer les owner par msg.sender sur remix 
    function approveDelegation(address _owner, address _borrower, uint _amount) public { // ATTENTION : si on reduit la quantité que l'emprunteur peut emprunter, il peut y avoir une sorte de dette négative
    }



    // borrow
    function borrow(uint _amount, address _delegator, string _vault) public {
    }    


    // repay
    function repayToMaiFinance(uint _amount, address _delegator, string _vault) public {

    }
    


    // admin functions

    function addAdmin(address _admin) public {
        require(admin[msg.sender], "You are not an admin");
        admin[_admin] = true;
    }

    function isAdmin(address _admin) public view returns(bool) {
        return admin[_admin];
    }

    //comment retirer un admin ?
    function edit_VaultAdress(string memory crypto, address _vault) public {
        require(admin[msg.sender], "You are not an admin");
        vaultAddress[crypto] = _vault;
    }

    function edit_tokenAdress(string memory crypto, address _token) public {
        require(admin[msg.sender], "You are not an admin");
        tokenAddress[crypto] = _token;
    }

}

