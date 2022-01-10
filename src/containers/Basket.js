import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Button,
  Input,
  Dropdown,
  Pagination,
  Form,
  Message,
  Icon,
} from "semantic-ui-react";
import Product from "../components/BasketProduct";
import { search, getx2Products } from "../fetch/fetchProducts";
import PayWithPayPal from "../components/PayWithPayPal";
import "../static/css/index.min.css";
import "../static/css/products.min.css";
import { getbasket } from "../fetch/fetchBasket";

class Basket extends React.Component {
  constructor(props) {
    super(props);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  state = {
    value: 1,
    products: [],
    allProducts: 0,
    gotBasket: false,
    fullprice: 0,
  };

  rerenderParentCallback() {
    console.log("in callback");
    this.state.gotProducts = false;
    window.location.reload();
    this.forceUpdate();
    console.log("after callback");
  }

  getBasket(token) {
    getbasket(this, token);
    this.state.gotBasket = true;

    this.forceUpdate();
  }
  handlePayment = () => {
    console.log(this.state.howmany);
    if (this.state.fullprice > 0) {
      this.setState({ isCheckout: true });
      this.setState({ status: true });
      console.log(this.state.status);
    } else {
      this.setState({ status: false });
    }
  };

  render() {
    console.log(this.state);
    var { authenticated, hasPerm, token } = this.props;
    authenticated = localStorage.getItem("admin");
    token = localStorage.getItem("token");
    console.log(this.state.products);
    if (!this.state.gotBasket) {
      console.log(token);
      this.getBasket(token);
    }
    if (authenticated) {
      console.log(this.state.fullprice);
      const { value } = this.state;
      return (
        <React.Fragment>
          <div className="main-container-top">
            <div className="second-container-top">
              <div className="row products-position-flex"></div>
              <h1 style={{ textAlign: "center" }}>Twoj koszyk</h1>
              {this.state.products.length > 0 ? (
                this.state.products.map((item) => {
                  console.log(item);
                  return (
                    <Product
                      key={item.productName}
                      token={token}
                      product={item}
                      rerenderParentCallback={this.rerenderParentCallback}
                      page={this.state.page}
                      howmany={this.state.value}
                    ></Product>
                  );
                })
              ) : (
                <Message color="red">Brak produktów w koszyku</Message>
              )}
              <h3 class="ui center aligned header">Dane do wysyłki</h3>
              <Form onSubmit={this.handlePayment}>
                <Form.Group>
                  <Form.Input
                    label="Imię"
                    placeholder="Imię"
                    width={4}
                    required={true}
                  />
                  <Form.Input
                    label="Nazwisko"
                    placeholder="Nazwisko"
                    width={4}
                    required={true}
                  />
                  <Form.Input
                    label="Numer telefonu"
                    placeholder="xxx-xxx-xxx"
                    width={8}
                    required={true}
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Input
                    label="Kod pocztowy"
                    placeholder="xx-xxx"
                    width={4}
                    required={true}
                    pattern="[0-9]{2}-[0-9]{3}"
                  />
                  <Form.Input
                    label="Adres"
                    placeholder="Adres"
                    width={8}
                    required={true}
                  />
                  <Form.Input
                    label="Miejscowość"
                    placeholder="Miejscowość"
                    width={4}
                    required={true}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="checkout-button checkout-button_basket"
                >
                  Zapłać {this.state.fullprice}zł
                  <i class="paypal icon"></i>
                </Button>

                {this.state.status ? (
                  <PayWithPayPal
                    products={this.state.products}
                    token={token}
                    total={this.state.fullprice}
                    rerenderParentCallback={this.rerenderParentCallback}
                    e={this}
                  ></PayWithPayPal>
                ) : (
                  <div></div>
                )}
              </Form>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    token: state.auth.token,
    hasPerm: state.auth.admin,
  };
};

export default withRouter(connect(mapStateToProps)(Basket));
