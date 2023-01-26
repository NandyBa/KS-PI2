const delegate = artifacts.require("delegate");
const fakeMai = artifacts.require("fakeMai"); 
const FakeVault = artifacts.require("FakeVault"); 
let tryCatch = require("./exceptions.js").tryCatch;
let errTypes = require("./exceptions.js").errTypes;

contract("delegate", accounts => {
    
    const borrower = accounts[0]; 
    const delegator = accounts[1]; 

    async function deployMai(){
        const mai = await fakeMai.new("mai","MAI"); 
    }
    async function deployVault(){
        
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" );
    }
    async function deployDelegate(){
        const _delegate = await delegate.new(mai.address, vault.address); 
    }

    it("should deploy the contract", async () => {
        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed");  
 
    });

    it("should not deposit ERC721 token to the delegate contract, user doesn't call approve", async () => {
        await deployMai();
        deployVault();  
        
        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        await tryCatch(_delegate.depositErc721(0,"test", {from: accounts[0]}), errTypes.revert);

    });
 
    it("should deposit ERC721 token to the delegate contract, user call approve", async () => {
        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 
        

        
        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 
    });

    it("should revert the delegation, msg.sender != owner", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        await tryCatch(_delegate.approveDelegation(accounts[0],accounts[1], "test",0,100, {from: accounts[1]}), errTypes.revert);
    });

    it("should revert the delegation, amount <=0", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        await tryCatch(_delegate.approveDelegation(accounts[0],accounts[1], "test",0,0, {from: accounts[0]}), errTypes.revert);
    });

    it("should revert the delegation, owner = borrower", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        await tryCatch(_delegate.approveDelegation(accounts[0],accounts[0], "test",0,100, {from: accounts[0]}), errTypes.revert);
    });
    
    it("should revert the delegation, address(0)", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        await tryCatch(_delegate.approveDelegation(accounts[0],'0x0000000000000000000000000000000000000000', "test",0,100, {from: accounts[0]}), errTypes.revert);
    });

    it("should revert the delegation, not owner of the nft ", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        await tryCatch(_delegate.approveDelegation(accounts[1],accounts[0], "test",0,100, {from: accounts[1]}), errTypes.revert);
    });


     
    it("should approve the delegation ", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        const delegation = await _delegate.approveDelegation(accounts[0],accounts[1], "test",0,100, {from: accounts[0]});
        assert.isTrue(delegation.receipt.status, "approve delagation failed"); 
    });

    it("user should not borrow mai, msg.sender != borrower ", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        const delegation = await _delegate.approveDelegation(accounts[0],accounts[1], "test",0,100, {from: accounts[0]});
        assert.isTrue(delegation.receipt.status, "approve delagation failed"); 

        await tryCatch(_delegate.userBorrowMai(accounts[0],accounts[1], "test",0, {from: accounts[0]}), errTypes.revert);

    });

    it("user should borrow mai", async ()=>{

        const mai = await fakeMai.new("mai","MAI"); 
        assert.isTrue(mai != null, "Mai deployement failed");
        const vault = await FakeVault.new(mai.address, "vault", "VAULT" ); 
        assert.isTrue(vault != null, "Vault deployement failed"); 
        const _delegate = await delegate.new(mai.address, vault.address); 
        assert.isTrue(_delegate!=null, "Delegate deployment failed"); 

        const tokenId = await vault.createVault({from : accounts[0]}); 
        const balance = await vault.balanceOf.call( accounts[0]); 
        assert.isTrue(balance.gt(0), "token mint failed");  

        const depo = await vault.depositCollateral(0,100, {from:accounts[0]}); 
        let b = await web3.eth.getBalance(vault.address);
        let a = await web3.eth.getBalance(accounts[0]); 
        console.log(a); 
        console.log(b); 
        const approved = await vault.approve(_delegate.address, 0, {from : accounts[0]}).valueOf();
        assert.isTrue(approved.receipt.status, "approved failed"); 
        const deposit = await _delegate.depositErc721(0,"test", {from: accounts[0]}); 
        assert.isTrue(deposit.receipt.status, "deposit failed"); 
        const contract_balance = await vault.balanceOf.call(_delegate.address); 
        assert.isTrue(contract_balance.gt(0), "deposit failed"); 

        const delegation = await _delegate.approveDelegation(accounts[0],accounts[1], "test",0,100, {from: accounts[0]});
        assert.isTrue(delegation.receipt.status, "approve delagation failed"); 

        const borrow = await _delegate.userBorrowMai(accounts[0],accounts[1], "test",0, {from: accounts[1]});
        console.log(borrow); 
        assert.isTrue(borrow.receipt.status, "borrowing failed"); 
        const user_balance = await mai.balanceOf.call(accounts[1]); 
        //assert.isTrue(user_balance.eq(100), "borrowing failed"); 

    });
    
    
    
});