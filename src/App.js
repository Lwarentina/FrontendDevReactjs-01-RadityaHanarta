// App.js or index.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Detail from "./pages/detail";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Dashboard} />
        <Route path="/detail/:id" component={Detail} />
      </Routes>
    </Router>
  );
};

export default App;