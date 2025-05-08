import React from "react";
import { Layout } from "@router/Layout";


export default Layout(
  ({ children }) => {
    return (
      <div style={{ border: '3px solid green', padding: '10px' }}>
        <header> Test Header</header>
        {children}
      </div>
    );
  });