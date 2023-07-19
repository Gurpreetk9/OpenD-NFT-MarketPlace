import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { opend_backend } from "../../../declarations/opend_backend";
import CANISTER_USER_ID from "../index"



function Header() {

  const [userOwnedGallery, setOwnedGallery] = useState();
  const [listedGallery, setListedGallery] = useState();
  async function fetchIds() {
    const userNFTIds = await opend_backend.getOwnedIds(CANISTER_USER_ID);
    const listedIds = await opend_backend.getListedIds();

    setOwnedGallery(<Gallery title="My NFTs" ids={userNFTIds} role="collection" />)

    setListedGallery(<Gallery title="Discover" ids={listedIds} role="discover" />)
  }

  useEffect(() => {
    fetchIds();
  }, []);
  return (
    <BrowserRouter forceRefresh={true} >
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link reloadDocument to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link reloadDocument to="/discover">
                Discover
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link reloadDocument to="/minter">
                Minter
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link reloadDocument to="/collections">
                My NFTs
              </Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>

        <Route path="/" element={<img className="bottom-space" src={homeImage} />} />
        <Route path="/discover" element={listedGallery} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collections" element={userOwnedGallery} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
