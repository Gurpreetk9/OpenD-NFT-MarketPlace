import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./Item";
import Minter from "./Minter";
import { Principal } from "../../../../node_modules/@dfinity/candid/lib/cjs/idl";

function App() {

  // const canisterId = "cinef-v4aaa-aaaaa-qaalq-cai";


  return (
    <div className="App">
      <Header />
      {/* <Minter />
      <Item id={canisterId} /> */}
      <Footer />
    </div>
  );
}

export default App;
