// min des fcts a faire :
// ownerOf
// safeTransferFrom
// balanceOf
// borrowToken
// depositCollateral

// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2; // regarder la version sur les contracts de qidao 0.5.5 demander à Nandy quel est le mieux 

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract fakeMaiVault{

    mapping (address => bool) public admin; // nous
    mapping (uint256 => address) private owners; // directement copié du vault wbtc
    mapping(address => uint256) private _balances; // directement copié du vault wbtc. 

    function ownerOf(uint256 tokenId) public view virtual returns (address) { // directement copié du vault wbtc
        address owner = owners[tokenId];
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    // safeTransferFrom
    function _exists(uint256 tokenId) internal view virtual returns (bool) { 
        return owners[tokenId] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual { // directement copié du vault wbtc
        require(_isApprovedOrOwner(msg.sender(), tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal virtual { 
        owners[tokenId] = to;
    }

    //balanceOf
        function balanceOf(address account) public view virtual returns (uint256) { // directement copié du vault wbtc
        return _balances[account];
    }

    // borrowToken
    function borrowToken(uint256 amount) public { // directement copié du vault wbtc
        require(_balances[msg.sender] >= amount, "not enough balance");
        _balances[msg.sender] -= amount;
    }

    //utile pour nous : 
    function setAdmin(address _admin) public {
        require(admin[msg.sender], "not admin");
        admin[_admin] = true;
    }

    function editbalanceOf(address account, uint256 amount) public {
        require(admin[msg.sender], "not admin");
        _balances[account] = amount;
    }
    
}
