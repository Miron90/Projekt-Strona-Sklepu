import React from "react";
import { Link } from "react-router-dom";
import { Button, Image, Popup, Icon } from "semantic-ui-react";
import axios from "axios";
import PayWithPayPal from "../components/PayWithPayPal";
import "../static/css/index.min.css";
import "../static/css/fontello.css";
import "../static/css/ProductAssortment.min.css";
import { useState } from "react";
import addToBasket from "../cart/addToCart";
/*
function deleteProduct(productName, token, rerenderParentCallback) {
  if (window.confirm("Na pewno chcesz usunąć tyen przedmiot?")) {
    axios
      .delete("http://127.0.0.1:8000/deleteproduct/", {
        data: {
          productName: productName,
          token: token,
        },
      })
      .then((res) => {
        rerenderParentCallback();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
*/

class Product extends React.Component {
  state = {
    total: 0.0,
    checkoutList: [],
    isCheckout: false,
    status: false,
    howmany: 0,
    howmanydeleted: 0,
    buttonclicked: false,
  };

  onAdd = (name, value) => {
    this.setState({
      checkoutList: [...this.state.checkoutList, { name, value }],
      total: this.state.total + value,
    });
  };
  rerenderParentCallback = (e) => {
    console.log(e);
    this.setState({ status: false });
    if (e == undefined) {
      this.props.renderAfterPayment();
    }
    this.setState({ howmany: "" });
    console.log(this.state.howmanydeleted);
  };
  handleChange = (e) => {
    if (e.target.value >= this.props.product.quantity) {
      this.setState({ status: false });
    }
    if (e.target.value < 1) {
      this.setState({ status: false });
    }
    this.setState({ howmany: e.target.value });
  };
  handleAddToCart = (e) => {
    console.log(this);
    this.state.buttonclicked = true;
    if (this.props.product.quantity > 0) {
      addToBasket(
        this.props.product.productName,
        this.state.howmany,
        this.props.product.price,
        this.props.token
      );
    }
    this.forceUpdate();
  };
  render() {
    const {
      product,
      token,
      rerenderParentCallback,
      renderAfterPayment,
      page,
      howmany,
      total,
      checkoutList,
      isCheckout,
    } = this.props;
    // if (isCheckout) {
    //   return (
    //     <PayWithPayPal
    //       total={total}
    //       items={checkoutList}
    //     />
    //   )
    // }
    console.log(this.state.howmanydeleted);
    console.log(product.quantity);
    return (
      <React.Fragment>
        <div className="product-container-flex-row">
          <Image src={product.imagePath} className="product-image"></Image>
          <div className="product-container-flex-column">
            <h1 className="product-name">{product.productName}</h1>
            <div className="product-flex">
              <h4 className="product-quantity">
                {product.quantity > 0
                  ? "Ilość:" + (product.quantity - this.state.howmanydeleted)
                  : "Brak w magazynie"}
              </h4>
              <h4 className="product-price">Cena: {product.price}zł</h4>
            </div>
            <div className="product-shortDescription">
              {product.shortDescription}
            </div>
          </div>
          <div className="produxct-flex-right">
            <input
              className="inputclass"
              type="number"
              min="1"
              onChange={this.handleChange}
            ></input>

            <Button className="checkout-button" onClick={this.handleAddToCart}>
              Dodaj do koszyka
            </Button>
          </div>
          {product.quantity < 1 && this.state.buttonclicked ? (
            <h6 className="errorBasket">Brak w magazynie</h6>
          ) : (
            <div></div>
          )}
        </div>
        {/* <Home
          onAdd={this.onAdd}
        /> */}
      </React.Fragment>
    );
  }
}

export default Product;
