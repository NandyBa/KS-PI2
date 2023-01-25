import { GelatoOpsSDK, isGelatoOpsSupported, TaskTransaction } from "@gelatonetwork/ops-sdk";
import { Contract } from "ethers";
import Card from "./Card/Card";
import classes from "./Card/Card.css"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import counterAbi from "../abis/CounterTest.json";

function Automate(){

    const[contractAddress, setContractAddress] = useState();

    const handleInput = (event) => {
        setContractAddress(event.target.value)
    }



    async function CreateTask(){
        // const providerUrl = "https://eth-goerli.g.alchemy.com/v2/"
        // let provider = ethers.getDefaultProvider("goerli");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const networkDetails = await provider.getNetwork();
        const chainId = networkDetails.chainId;

        // let signer = provider.getSigner();

        if (!isGelatoOpsSupported(chainId)) {
            console.log(`Gelato Ops network not supported (${chainId})`);
            return;
        }

        const gelatoOps = new GelatoOpsSDK(chainId, signer);
        const counter = new Contract("0x69C904fed91BFe2a354DbDd1A1078485389Fe6E9", counterAbi, signer);
        const selector = counter.interface.getSighash("increaseCount(uint256)");
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
                    
                <nav class="nav-bar">
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
                    <label for="ContractAddress">Contract's Address:</label><br/><br/>
                    <input type="text" id="username" name="ContractAddress"></input><br/>
                    <button onClick={CreateTask}>Create Task</button>
                </form>
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

