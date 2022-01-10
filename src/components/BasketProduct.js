import React from "react";
import { Link } from "react-router-dom";
import { Button, Image, Popup } from "semantic-ui-react";
import axios from "axios";
import { deleteProductFromBasket } from "../paid/deleteBasket";
import "../static/css/index.min.css";
import "../static/css/fontello.css";

class Product extends React.Component {
  render() {
    const { product, token } = this.props;
    return (
      <React.Fragment>
        <div className="product-container-flex-row">
          <Image src={product.imagePath} className="product-image"></Image>
          <div className="product-container-flex-column">
            <h1 className="product-name">{product.productName}</h1>
            <div className="product-flex">
              <h4 className="product-quantity">Ilość: {product.quantity}</h4>
              <h4 className="product-price">
                Cena: {Math.round(product.price * product.quantity * 100) / 100}
                zł
              </h4>
            </div>
            <div className="product-shortDescription">
              {product.shortDescription}
            </div>
          </div>
          <div className="produxct-flex-right">
            <Popup
              content="Usuń produkt"
              trigger={
                <Button
                  className="product-edit"
                  color="red"
                  onClick={() =>
                    deleteProductFromBasket(product.productName, token)
                  }
                >
                  <i className="icon-trash icon"></i>
                </Button>
              }
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Product;
