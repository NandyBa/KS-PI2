import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom"; 
import Home from "./Home";
import Delegate from "./Delegate";
import WithdrawNft from "./WithdrawNft";
import Borrow from "./Borrow";
import NotFound from "./NotFound";
import Repay from "./Repay";

function Navbar(){
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route index element={<Home />} />
          <Route path="Delegate" element={<Delegate />} />
          <Route path="WithdrawNFT" element={<WithdrawNft />} />
          <Route path="Borrow" element={<Borrow />} />
          <Route path="Repay" element={<Repay />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
      </div>
  );
};

export default Navbar;