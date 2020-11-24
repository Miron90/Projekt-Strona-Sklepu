import React from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Input, Dropdown, Pagination } from "semantic-ui-react";
import Product from "../components/ProductComponent";
import axios from "axios";

import "../static/css/index.min.css";
import "../static/css/products.min.css";

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
      this.search(
        this.state.search,
        this.state.page,
        options[this.state.value - 1].text
      );
      this.forceUpdate();
    } else {
      this.state.page = activePage;
      this.state.gotProducts = false;
      this.forceUpdate();
    }
  };

  rerenderParentCallback() {
    console.log("in callback");
    this.state.gotProducts = false;
    this.forceUpdate();
    console.log("after callback");
  }
  search(search, page, howManyPerPage) {
    axios
      .get(
        "http://127.0.0.1:8000/searchproducts/" +
          search +
          "/" +
          page +
          "/" +
          howManyPerPage +
          "/"
      )
      .then((res) => {
        if (!res.data.error) {
          var products = [];
          console.log(res.data);
          if (res.data.query.length > 0) {
            this.state.allProducts = res.data.allProducts;
            for (var i = 0; i < res.data.query.length; i++) {
              products[i] = {
                imagePath:
                  "http://127.0.0.1:8000/media/" + res.data.query[i].image,
                productName: res.data.query[i].productName,
                price: res.data.query[i].price,
                quantity: res.data.query[i].quantity,
                shortDescription: res.data.query[i].shortDescription,
              };
            }
          }
          this.state.products = products;
          this.forceUpdate();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleSearch = () => {
    if (this.state.search.length > 0) {
      this.state.gotProducts = false;
      this.search(
        this.state.search,
        this.state.page,
        options[this.state.value - 1].text
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

  getx2Products(page, howManyPerPage) {
    console.log(howManyPerPage);
    axios
      .get(
        "http://127.0.0.1:8000/getproducts/" + page + "/" + howManyPerPage + "/"
      )
      .then((res) => {
        if (!res.data.error) {
          this.state.gotProducts = true;
          var products = [];
          if (res.data.query.length > 0) {
            this.state.allProducts = res.data.allProducts;
            for (var i = 0; i < res.data.query.length; i++) {
              products[i] = {
                imagePath:
                  "http://127.0.0.1:8000/media/" + res.data.query[i].image,
                productName: res.data.query[i].productName,
                price: res.data.query[i].price,
                quantity: res.data.query[i].quantity,
                shortDescription: res.data.query[i].shortDescription,
              };
            }
          }
          this.state.products = products;
          this.forceUpdate();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    const { authenticated, hasPerm, token } = this.props;
    if (authenticated && hasPerm) {
      if (!this.state.gotProducts && !this.state.searched) {
        this.getx2Products(this.state.page, options[this.state.value - 1].text);
      }

      if (
        this.state.searched &&
        !(this.state.search.length > 0) &&
        !this.state.gotProducts
      ) {
        this.getx2Products(this.state.page, options[this.state.value - 1].text);
      }
      const { value } = this.state;
      const prod = [
        {
          productName: "xddd",
          quantity: 0,
          price: 1,
          shortDescription: "no neizle",
          imagePath: "notfound",
        },
      ];
      return (
        <React.Fragment>
          <div className="main-container-top">
            <div className="second-container-top">
              <div className="row products-position-flex">
                <div className="products-search ">
                  <Input
                    id="search"
                    name="search"
                    className="large"
                    icon="search"
                    value={this.state.search}
                    onChange={this.handleInputChange}
                    placeholder="Nazwa produktu"
                  />
                  <Button
                    color="teal"
                    htmlFor="search"
                    className="products-size-large"
                    onClick={this.handleSearch}
                  >
                    Szukaj
                  </Button>
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
                <div className="products-add">
                  <Link to="/product/editor">
                    <Button primary className="products-add">
                      Dodaj produkt
                    </Button>
                  </Link>
                </div>
              </div>
              <h1 style={{ textAlign: "center" }}>
                Wybierz produkt do edycji bądź usunięcia
              </h1>
              {this.state.products.map((item) => {
                return (
                  <Product
                    key={item.productName}
                    token={token}
                    product={item}
                    rerenderParentCallback={this.rerenderParentCallback}
                  ></Product>
                );
              })}

              {this.state.products.length > 0 && (
                <Pagination
                  defaultActivePage={1}
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
