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
import Product from "../components/ProductAssortmentComponent";
import Dictaphone from "../components/Dictaphone";
import { search, getx2Products } from "../fetch/fetchProducts";

import "../static/css/index.min.css";
import "../static/css/ProductAssortment.min.css";

const options = [
  { key: 1, text: "3", value: 1 },
  { key: 2, text: "6", value: 2 },
  { key: 3, text: "9", value: 3 },
];

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  state = {
    value: 1,
    products: [],
    allProducts: 0,
    page: 1,
    gotProducts: false,
    searched: false,
    search: "",
  };
  handleChange = (e, { value }) => {
    this.setState({ value });
    this.state.page = 1;
    this.state.gotProducts = false;
    this.forceUpdate();
  };
  handlePaginationChange = (e, { activePage }) => {
    if (this.state.search) {
      this.state.page = activePage;
      search(
        this.state.search,
        this.state.page,
        options[this.state.value - 1].text,
        this
      );
      this.forceUpdate();
    } else {
      this.state.page = activePage;
      this.state.gotProducts = false;
      this.forceUpdate();
    }
  };

  rerenderParentCallback() {
    this.state.gotProducts = false;
    this.forceUpdate();
  }
  renderAfterPayment() {
    window.location.reload();
  }

  handleSearch = () => {
    if (this.state.search.length > 0) {
      this.state.gotProducts = false;
      search(
        this.state.search,
        this.state.page,
        options[this.state.value - 1].text,
        this
      );
      this.state.searched = true;
    } else {
      window.alert("wpisz coś");
    }
  };
  handleInputChange = (e) => {
    this.state.page = 1;
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSearchChange(text) {
    this.state.search = text;
    this.forceUpdate();
  }
  render() {
    var { authenticated, hasPerm, token } = this.props;
    hasPerm = localStorage.getItem("admin");
    authenticated = localStorage.getItem("admin");
    if (this.props.location.state !== undefined) {
      if ("page" in this.props.location.state) {
        const { page, howmany } = this.props.location.state;
        if (page) {
          console.log(howmany);
          this.state.page = page;
          this.state.value = howmany;
          this.props.location.state = undefined;
        }
      }
    }
    if (authenticated && hasPerm) {
      if (!this.state.gotProducts && !this.state.searched) {
        getx2Products(
          this.state.page,
          options[this.state.value - 1].text,
          this
        );
      }

      if (
        this.state.searched &&
        !(this.state.search.length > 0) &&
        !this.state.gotProducts
      ) {
        getx2Products(
          this.state.page,
          options[this.state.value - 1].text,
          this
        );
      }
      const { value } = this.state;
      return (
        <React.Fragment>
          <div className="main-container-top">
            <div className="second-container-top">
              <div className="row products-position-flex">
                <div className="products-search ">
                  <Form>
                    <Input
                      id="search"
                      name="search"
                      className="large products-search-input"
                      icon="search"
                      value={this.state.search}
                      onChange={this.handleInputChange}
                      placeholder="Nazwa produktu"
                    />

                    <Button
                      color="blue"
                      htmlFor="search"
                      className="products-size-large products-search"
                      onClick={this.handleSearch}
                    >
                      Szukaj
                    </Button>
                    <Dictaphone parent={this}></Dictaphone>
                  </Form>
                </div>
                <div className="products-see">
                  <Dropdown
                    id="howmany"
                    onChange={this.handleChange}
                    options={options}
                    selection
                    className="large products-button"
                    value={value}
                  />
                  <label htmlFor="howmany" className="products-tooltip large">
                    Wyświetl
                  </label>
                </div>
              </div>
              <h1 style={{ textAlign: "center" }}>Wybierz produkt do zakupu</h1>
              {this.state.products.length > 0 ? (
                this.state.products.map((item) => {
                  return (
                    <Product
                      key={item.productName}
                      token={token}
                      product={item}
                      rerenderParentCallback={this.rerenderParentCallback}
                      renderAfterPayment={this.renderAfterPayment}
                      page={this.state.page}
                      howmany={this.state.value}
                    ></Product>
                  );
                })
              ) : (
                <Message color="red">Nie znaleziono produktów</Message>
              )}

              {this.state.products.length > 0 && (
                <Pagination
                  onPageChange={this.handlePaginationChange}
                  totalPages={Math.ceil(
                    this.state.allProducts / options[this.state.value - 1].text
                  )}
                  activePage={this.state.page}
                  className="products-center"
                />
              )}
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

export default withRouter(connect(mapStateToProps)(Products));
