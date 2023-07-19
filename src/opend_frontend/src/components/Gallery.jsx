import React, { useEffect, useState } from "react";
import { Principal } from "../../../../node_modules/@dfinity/principal/lib/cjs/index";
import Item from "./Item";


function Gallery(props) {

  const [items, setItems] = useState();
  async function fetchNFTs() {
    if (props.ids != undefined) {
      setItems(
        props.ids.map((NFTid) => (
          <Item id={NFTid} key={NFTid.toText()} role={props.role} />
        ))
      )
    }
  }

  useEffect(() => {
    fetchNFTs();
  }, [])
  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Gallery;
