import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Detail from "./pages/detail";
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/detail/:id" element={<Detail />} />
    </Routes>
  );
};

export default App;
