import { GelatoOpsSDK, isGelatoOpsSupported, TaskTransaction } from "@gelatonetwork/ops-sdk";
import { Contract } from "ethers";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import counterAbi from "../abis/CounterTest.json";
import ChainInfo from "./ChainInfo";

function Manage(){

    const [activeClick, setActiveClick] = useState(false);
    const [activeTasks, setActiveTasks] = useState("Loading...");

    useEffect(()=>{
        ActiveTasks();
    },[])

    async function ActiveTasks(){


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const networkDetails = await provider.getNetwork();
        const chainId = networkDetails.chainId;

        const gelatoOps = new GelatoOpsSDK(chainId, signer);

        const activeTasks = await gelatoOps.getActiveTasks();
        activeTasks.forEach((task) => {
            console.log(`- ${task.name} (${task.taskId})`);
            setActiveTasks(`- ${task.name} (${task.taskId})`);
        });
    }

    async function CancelTask(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const networkDetails = await provider.getNetwork();
        const chainId = networkDetails.chainId;

        const gelatoOps = new GelatoOpsSDK(chainId, signer);

        const activeTasks = await gelatoOps.getActiveTasks();
        const task = activeTasks[0];
        await gelatoOps.cancelTask(task.taskId);
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
                            <a href="/automate">Automate</a>
                        </li>
                        <li>
                            <a className="active" href="/manage">Manage</a>
                        </li>
                    </ul>
                </nav>
            </header>

            <div className="background">
                <h4>Active Tasks : {activeTasks}</h4>
            </div>

            <div className="background">
                <button onClick={CancelTask}>Cancel Task</button>
            </div>

        </div>
    );
}

export default Manage;

