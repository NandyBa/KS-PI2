import { GelatoOpsSDK, isGelatoOpsSupported, TaskTransaction } from "@gelatonetwork/ops-sdk";
import { Contract } from "ethers";
import Card from "./Card/Card";
import classes from "./Card/Card.css"
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import counterAbi from "../abis/CounterTest.json";
import ERC20 from "../abis/ERC20.json";

function Automate(){

    const[hasResolver, setHasResolver] = useState(false);
    // var contractABI = {};

    const[inputs, setInputs] = useState({
        contractAddress : '',
        // contractABI : {},
        selectedFunctionWithParameters : '',
        selectedFunction : '',
        selectedInput1 : [],
        selectedInput2 : 0,
        interval_seconds : 0,
    });

    const handleChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    };

    const handleInput = (event) => {
        setHasResolver(true);
    }


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
        const counter = new Contract(inputs.contractAddress, ERC20, signer);
        const selector = counter.interface.getSighash(inputs.selectedFunctionWithParameters);
        const data = counter.interface.encodeFunctionData(inputs.selectedFunction, ["0x77DbD1ddF6d9BfaB2aD5e76986A0628BB09B8Ae9", 1]);
        const interval = inputs.interval_seconds;
        // const resolverData = counter.interface.getSighash("checker()");

        // Create task
        console.log("Creating Task...");

        const { taskId, tx } = await gelatoOps.createTask({
            execAddress: counter.address,
            execSelector: selector,
            execData: data,
            execAbi: JSON.stringify(ERC20),
            // resolverAddress: counter.address,
            // resolverData: resolverData,
            // resolverAbi: JSON.stringify(counterAbi),
            interval : 60,
            name: "Mint One Token",
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
                        <li>
                            <a href="/manage">Manage</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="condition">
                {!hasResolver && <button onClick={handleInput}>Contract with Resolver</button>}
            </div>
            {hasResolver &&
                <div className="background">
                    <form>
                        <label htmlFor="ContractAddress">Contract Address</label><br/>
                        <input type="text" id="contractAddress" name="contractAddress" placeholder="0x..." onChange={handleChange}></input><br/><br/>

                        <label htmlFor="ContractAbi">Contract Abi</label><br/>
                        <input type="text" id="contractABI" name="contractABI" placeholder="[...]" onChange={handleChange}></input><br/><br/>

                        <label htmlFor="Function">Select a function</label><br/>
                        <input type="text" id="selectedFunctionWithParameters" name="selectedFunctionWithParameters" placeholder="function(parameters)" onChange={handleChange}></input><br/><br/>

                        <label htmlFor="Function">Select a function</label><br/>
                        <input type="text" id="selectedFunction" name="selectedFunction" placeholder="function()" onChange={handleChange}></input><br/><br/>

                        <label htmlFor="Interval">Set the inputs</label><br/>
                        <input type="text" id="selectedInput1" name="selectedInput1" placeholder="First Input" onChange={handleChange}></input><br/><br/>

                        <label htmlFor="Interval">Set the inputs</label><br/>
                        <input type="number" id="selectedInput2" name="selectedInput2" placeholder="Second Input" onChange={handleChange}></input><br/><br/>

                        <label htmlFor="Interval">Set an Interval</label><br/>
                        <input type="number" id="interval_seconds" name="interval_seconds" placeholder="Interval (in seconds)" onChange={handleChange}></input><br/><br/>
                    </form>

                    <button onClick={CreateTask}>Create Task</button>
                </div>
            }

            <br/>

        </div>
    );
}

export default Automate;

