import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element="Hello" />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
};

export default App;
