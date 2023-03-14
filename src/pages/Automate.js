import { GelatoOpsSDK, isGelatoOpsSupported, TaskTransaction } from "@gelatonetwork/ops-sdk";
import { use } from "chai";
import { Contract } from "ethers";
import { ethers } from "ethers";
import { useState } from "react";
import ERC20 from "../abis/ERC20.json";
import { WithResolver } from "./Components/WithResolver";

function Automate(){
    const[hasResolver, setHasResolver] = useState(0);
    const[functionInputs, setFunctionInputs] = useState(["0x77DbD1ddF6d9BfaB2aD5e76986A0628BB09B8Ae9", 1]);
    const[contractABI, setContractABI] = useState([])
    const[inputs, setInputs] = useState({
        contractAddress : '',
        selectedFunctionWithParameters : '',
        selectedFunction : '',
        interval_seconds : 0,
    });


    const handleChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    };

    const handleInput = (event) => {
        setHasResolver(true);
    }

    const handleFunctionInput = (e) => {
        setFunctionInputs(functionInputs => [...functionInputs, e.target.value]);
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
        //ERC20 Address = 0xA44476875de44128103379D705822f45708868b5
        //Function = increaseCount(uint256)


        const gelatoOps = new GelatoOpsSDK(chainId, signer);
        const counter = new Contract(inputs.contractAddress, inputs.contractABI , signer);
        const selector = counter.interface.getSighash(inputs.selectedFunctionWithParameters);
        // ["0x77DbD1ddF6d9BfaB2aD5e76986A0628BB09B8Ae9", 1]
        const data = counter.interface.encodeFunctionData(inputs.selectedFunction, functionInputs);
        const interval_input = inputs.interval_seconds;
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
            interval : interval_input,
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
                {hasResolver === 0 && 
                    <div className="background">
                        <button onClick={() => setHasResolver(1)}>Contract without Resolver</button><br/><br/>
                        <button onClick={() => setHasResolver(2)}>Contract with Resolver</button>
                    </div>
                  }
            </div>
            {hasResolver === 1 &&
                <div className="background">
                    <form>
                        <h2>Contract without Resolver</h2>
                        <div class="txt_field">
                            <input type="text" id="contractAddress" name="contractAddress" required="required" onChange={handleChange}></input>
                            <span></span>
                            <label htmlFor="ContractAddress">Contract Address 0x...</label>
                        </div>
                        <div class="txt_field">
                            <input type="text" id="contractABI" name="contractABI" required="required" onChange={handleChange}></input>
                            <span></span>
                            <label htmlFor="ContractAbi">Contract Abi [...]</label>
                        </div>
                        <div class="txt_field">
                            <input type="text" id="selectedFunctionWithParameters" name="selectedFunctionWithParameters" required="required" maxLength="100000" onChange={handleChange}></input>
                            <span></span>
                            <label htmlFor="Function">Select a function with parameter types</label>
                        </div>
                        <div class="txt_field">
                            <input type="text" id="selectedFunction" name="selectedFunction" required="required" onChange={handleChange}></input>
                            <span></span>
                            <label htmlFor="Function">Select a function (name)</label>
                        </div>
                        <div class="txt_field">
                            <input type="text" id="selectedInput1" name="selectedInput1" required="required" onChange={handleFunctionInput}></input>
                            <span></span>
                            <label htmlFor="Interval">Set the inputs [parameter1, parameter2, ...]</label>
                        </div>
                        {/* <div class="txt_field">
                            <input type="number" id="selectedInput2" name="selectedInput2" placeholder="Second Input" onChange={handleFunctionInput}></input>
                            <span></span>
                            <label htmlFor="Interval">Set the inputs</label>
                        </div> */}
                        <div class="txt_field">
                            <input type="number" id="interval_seconds" name="interval_seconds" required="required" onChange={handleChange}></input>
                            <span></span>
                            <label htmlFor="Interval">Set an Interval (in seconds)</label>
                        </div>
                    </form>


                    <button onClick={CreateTask}>Create Task</button>
                </div>
            }

            <br/>

        </div>
    );
}

export default Automate;

