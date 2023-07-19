import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button"
import { opend_backend } from "../../../declarations/opend_backend";

import CANISTER_USER_ID from "../index"
import PriceLabel from "./PriceLabel";
import CURRENT_USER_ID from "../index";


function Item(props) {

  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const id = props.id;

  const localHost = "http://localhost:8080";
  const agent = new HttpAgent({ host: localHost });

  agent.fetchRootKey();
  var nftActor;

  async function loadNFT() {
    nftActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    });

    const name = await nftActor.getName();
    setName(name);

    const owner = await nftActor.getOwner();
    setOwner(owner.toText());

    const imageData = await nftActor.getImage();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
    setImage(image);

    if (props.role == "collection") {
      const nftIsListed = await opend_backend.isListed(props.id);
      if (nftIsListed) {
        setBlur({ filter: "blur(4px)" });
        setOwner("OpenD");
        setSellStatus("Listed");
      }
      else {
        setButton(<Button handleClick={handleSell} text={"Sell"} />);
      }
    }
    else if (props.role == "discover") {
      const originalOwner = await opend_backend.getOriginalOwner(props.id);
      if (originalOwner.toText() != CANISTER_USER_ID.toText()) {
        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend_backend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />);
    }
  }



  let price;
  function handleSell() {
    setPriceInput(<input
      placeholder="Price in DMON"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => {
        price = e.target.value;
      }}
    />);


    setButton(<Button handleClick={sellItem} text={"Confirm"} />)
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    const listingResult = await opend_backend.listItems(props.id, Number(price));
    console.log(listingResult);
    if (listingResult == "Success") {
      const opendId = await opend_backend.getOpenDCanisterId();
      const transferResult = await nftActor.transferOwnership(opendId);
      console.log(transferResult);
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD");
        setSellStatus("Listed");
      }
    }
  }

  useEffect(() => {
    loadNFT();
  }, [])

  async function handleBuy() {
    console.log("Buy clicked");
    setLoaderHidden(false);
    const tokenActor = Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("a3shf-5eaaa-aaaaa-qaafa-cai")
    });

    const sellerId = await opend_backend.getOriginalOwner(props.id);
    const itemPrice = await opend_backend.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    if (result == "Success") {
      const transferResult = await opend_backend.completePurchase(props.id, sellerId, CURRENT_USER_ID);

      console.log(transferResult);
      setLoaderHidden(true);
      setDisplay(false);
    }
  }
  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
