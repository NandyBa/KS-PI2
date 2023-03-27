import logo from './logo.svg';
import './App.css';
import Home from "./scriptsJS/Home.js";
import Delegate from './scriptsJS/Delegate';
import WithdrawNft from './scriptsJS/WithdrawNft';
import Borrow from './scriptsJS/Borrow';
import Repay from './scriptsJS/Repay';
import Navbar from './scriptsJS/Navbar';
function App() {
  return (
    <div className="App">
      <h1>Delegate</h1>
      <Delegate />
      <h1>Borrow</h1>
      <Borrow />
      <h1>Repay</h1>
      <Repay />
      <h1>Withdraw</h1>
      <WithdrawNft />
      
    </div>
  );
}

export default App;
