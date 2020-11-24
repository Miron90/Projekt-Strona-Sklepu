import React from "react";
import { Link } from "react-router-dom";
import { Button, Image, Popup } from "semantic-ui-react";
import axios from "axios";

import "../static/css/index.min.css";
import "../static/css/fontello.css";

function deleteProduct(productName, token, rerenderParentCallback) {
  if (window.confirm("Na pewno chcesz usunąć tyen przedmiot?")) {
    axios
      .post("http://127.0.0.1:8000/deleteproduct/", {
        productName: productName,
        token: token,
      })
      .then((res) => {
        rerenderParentCallback();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
class Product extends React.Component {
  render() {
    const { product, token, rerenderParentCallback } = this.props;
    return (
      <React.Fragment>
        <div className="product-container-flex-row">
          <Image src={product.imagePath} className="product-image"></Image>
          <div className="product-container-flex-column">
            <h1 className="product-name">{product.productName}</h1>
            <div className="product-flex">
              <h4 className="product-quantity">Ilość: {product.quantity}</h4>
              <h4 className="product-price">Cena: {product.price}zł</h4>
            </div>
            <div className="product-shortDescription">
              Opis: {product.shortDescription}
            </div>
          </div>
          <div className="produxct-flex-right">
            <Link
              className="product-edit-link"
              to={{
                pathname: "/product/editor",
                state: { productName: product.productName, token: token },
              }}
            >
              <Popup
                content="Edytuj produkt"
                trigger={
                  <Button className="product-edit" color="green">
                    <i className="icon-doc icon"></i>
                  </Button>
                }
              />
            </Link>
            <Popup
              content="Usuń produkt"
              trigger={
                <Button
                  className="product-delete"
                  color="red"
                  onClick={() =>
                    deleteProduct(
                      product.productName,
                      token,
                      rerenderParentCallback
                    )
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
