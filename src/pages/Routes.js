import React from "react";
import { Route, Routes} from "react-router-dom";

import Welcome from "./Welcome.js";
import Automate from "./Automate.js";
import Manage from "./Manage.js";

function AppRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Welcome/>}/>
            <Route path="/automate" element={<Automate/>}/>
            <Route path="/manage" element={<Manage/>}/>
        </Routes>
    );
}

export default AppRoutes;