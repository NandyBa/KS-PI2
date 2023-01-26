import { GelatoOpsSDK, isGelatoOpsSupported, TaskTransaction } from "@gelatonetwork/ops-sdk";
import { Contract } from "ethers";
import Card from "./Card/Card";
import classes from "./Card/Card.css"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import counterAbi from "../abis/CounterTest.json";

function Automate(){


    const[inputs, setInputs] = useState({
        contractAddress : '',
        contractABI : '',
        selectedFunction : '',
    });

    const handleChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    };

    // const handleInput = (event) => {
    //     setContractAddress(event.target.value);
    // }


    async function CreateTask(){
        // const providerUrl = "https://eth-goerli.g.alchemy.com/v2/"
        // let provider = ethers.getDefaultProvider("goerli");

          // Init GelatoOpsSDK
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const networkDetails = await provider.getNetwork();
        const chainId = networkDetails.chainId;

        if (!isGelatoOpsSupported(chainId)) {
            console.log(`Gelato Ops network not supported (${chainId})`);
            return;
        }

        //Counter Address = 0x69C904fed91BFe2a354DbDd1A1078485389Fe6E9;
        //Function = increaseCount(uint256)

        const gelatoOps = new GelatoOpsSDK(chainId, signer);
        const counter = new Contract(inputs.contractAddress, counterAbi, signer);
        const selector = counter.interface.getSighash(inputs.selectedFunction);
        const resolverData = counter.interface.getSighash("checker()");

        // Create task
        console.log("Creating Task...");

        const { taskId, tx } = await gelatoOps.createTask({
            execAddress: counter.address,
            execSelector: selector,
            execAbi: JSON.stringify(counterAbi),
            resolverAddress: counter.address,
            resolverData: resolverData,
            resolverAbi: JSON.stringify(counterAbi),
            name: "Automated counter with resolver",
            dedicatedMsgSender: true,
        });

        await tx.wait();
        console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`);
        console.log(`> https://app.gelato.network/task/${taskId}?chainId=${chainId}`);   
    }

        return(

        <div className="automation">

            <header>
                <div className="logo">Gelato</div>
                    
                <nav className="nav-bar">
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a className="active" href="/automate">Automate</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="background">
                <form>
                    <label htmlFor="ContractAddress">Contract Address</label><br/>
                    <input type="text" id="contractAddress" name="contractAddress" placeholder="0x..." onChange={handleChange}></input><br/><br/>

                    <label htmlFor="ContractAbi">Contract Abi</label><br/>
                    <input type="text" id="contractABI" name="contractAbi" placeholder="[...]" onChange={handleChange}></input><br/><br/>

                    <label htmlFor="Function">Select a function</label><br/>
                    <input type="text" id="selectedFunction" name="selectedFunction" placeholder="function()" onChange={handleChange}></input><br/><br/>
                </form>

                <button onClick={CreateTask}>Create Task</button>
            </div>



            {/* <div>
                <form>
                    <label for="ContractAddress">Contract to Automate</label>
                    <input type="text" value={contractAddress} onChange={e=>handleInput(e)} id="ContractAddress" name="ContractAddress">Contract</input>
                </form>
            </div> */}



            <br/>

        </div>
    );
}

export default Automate;

