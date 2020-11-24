import React from "react";
import { withRouter, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { Button, Form, Dropdown, Image, Message } from "semantic-ui-react";

import axios from "axios";

import "../static/css/index.min.css";
import "../static/css/productEditor.min.css";

class ProductEditor extends React.PureComponent {
  state = {
    productName: "",
    description: "",
    shortDescription: "",
    price: 0,
    quantity: 0,
    productAdded: "",
    productError: "",
    error: "",
    image: "",
    imagePath: "",
    category: "",
    categoriesOptions: [],
    subCategoriesOptions: [],
    categories: "",
    subCategory: "",
    gotCategory: false,
    categoryValue: 0,
    subCategoryValue: 0,
    gotEditProduct: false,
    hasData: false,
    originalName: "",
    changedCategory: false,
    subCategoryAfterChange: 1,
    token: null,
  };
  getAllCategories() {
    axios
      .get("http://127.0.0.1:8000/getallcategories/", {})
      .then((res) => {
        if (!res.data.error) {
          if (res.data.length > 0) {
            var categoriesOptions = [];
            for (var i = 0; i < res.data.length; i++) {
              categoriesOptions[i] = { text: res.data[i].name, value: i + 1 };
            }
            if (
              this.state.categoriesOptions.length < categoriesOptions.length
            ) {
              this.state.categoriesOptions = categoriesOptions;
              this.forceUpdate();
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getSubCategories(category) {
    console.log(category);
    axios
      .get("http://127.0.0.1:8000/getsubcategories/" + category + "/")
      .then((res) => {
        if (!res.data.error) {
          console.log(res.data);
          if (res.data.length > 0) {
            var categoriesOptions = [];
            for (var i = 0; i < res.data.length; i++) {
              categoriesOptions[i] = { text: res.data[i].name, value: i + 1 };
            }
            this.state.subCategoriesOptions = categoriesOptions;
            this.forceUpdate();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  addProduct(
    productName,
    description,
    shortDescription,
    price,
    quantity,
    image,
    category,
    subcategory,
    token
  ) {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("shortDescription", shortDescription);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("image", image);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("token", token);
    axios
      .put("http://127.0.0.1:8000/addproduct/", formData)
      .then((res) => {
        console.log(res);
        if (res.data.result.includes("success")) {
          this.state.productAdded = true;
          this.state.productError = false;
        } else {
          this.state.productError = true;
          this.state.productAdded = false;
          this.state.error = res.data.error;
        }
        this.forceUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  editProduct(
    productName,
    description,
    shortDescription,
    price,
    quantity,
    image,
    category,
    subcategory,
    originalName,
    token
  ) {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("shortDescription", shortDescription);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("image", image);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("originalName", originalName);
    formData.append("token", token);
    axios
      .put("http://127.0.0.1:8000/editproduct/", formData)
      .then((res) => {
        console.log(res);
        if (res.data.result.includes("success")) {
          this.state.productAdded = true;
          this.state.productError = false;
        } else {
          this.state.productError = true;
          this.state.productAdded = false;
          this.state.error = res.data.error;
        }
        this.forceUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  linkSomewhereElse() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      this.props.history.push("/products");
    }, 3000);
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleCategoryDropdown = (e, { value }) => {
    this.state.categoryValue = value;
    this.state.category = this.state.categoriesOptions[value - 1].text;
    this.getSubCategories(this.state.category);
    this.state.subCategoryValue = 1;
    this.state.subCategory = this.state.subCategoriesOptions[0].text;
    this.state.changedCategory = true;
    this.forceUpdate();
  };
  handleSubmit = (e) => {
    if (this.state.hasData) {
      this.editProduct(
        this.state.productName,
        this.state.description,
        this.state.shortDescription,
        this.state.price,
        this.state.quantity,
        this.state.image,
        this.state.category,
        this.state.subCategory,
        this.state.originalName,
        this.state.token
      );
    } else {
      this.addProduct(
        this.state.productName,
        this.state.description,
        this.state.shortDescription,
        this.state.price,
        this.state.quantity,
        this.state.image,
        this.state.category,
        this.state.subCategory,
        this.state.token
      );
    }
  };
  handleSubcategoryDropdown = (e, { value }) => {
    console.log(value);
    this.state.subCategoryValue = value;
    this.state.subCategory = this.state.subCategoriesOptions[value - 1].text;
    this.state.subCategoryAfterChange = value;
    this.forceUpdate();
  };
  handleImageChange = (e) => {
    console.log(e);
    this.state.imagePath = URL.createObjectURL(e.target.files[0]);
    this.state.image = e.target.files[0];
    this.forceUpdate();
  };
  collectProductData(productName) {
    axios
      .get("http://127.0.0.1:8000/getproduct/" + productName + "/")
      .then((res) => {
        if (!res.data.error) {
          console.log(res.data);
          console.log(res.data[0]);
          console.log(res.data[0].productName);
          this.setState({ productName: res.data[0].productName });
          this.setState({ description: res.data[0].description });
          this.setState({ shortDescription: res.data[0].shortDescription });
          this.setState({ price: res.data[0].price });
          this.setState({ quantity: res.data[0].quantity });
          this.setState({ category: res.data[0].category_id });
          this.setState({ subCategory: res.data[0].subcategory_id });
          this.setState({ originalName: res.data[0].productName });
          this.setState({
            imagePath: "http://127.0.0.1:8000/media/" + res.data[0].image,
          });
          this.setState({
            categoryValue:
              this.state.categoriesOptions
                .map((e) => {
                  console.log(e.text);
                  console.log(res.data[0].category_id);
                  return e.text;
                })
                .indexOf(res.data[0].category_id) + 1,
          });
          this.getSubCategories(res.data[0].category_id);
          this.forceUpdate();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  getSubCategoryForProductEdit(subCategory) {
    console.log("getSub");
    this.setState({
      subCategoryValue:
        this.state.subCategoriesOptions
          .map((e) => {
            return e.text;
          })
          .indexOf(subCategory) + 1,
    });
  }

  render() {
    const { authenticated, hasPerm, token } = this.props;
    this.state.token = token;
    if (authenticated && hasPerm) {
      var data = this.props.location.state;
      if (!this.state.gotCategory) {
        this.getAllCategories();
        this.state.gotCategory = true;
      }
      if (data && !this.state.gotEditProduct && this.state.gotCategory) {
        this.state.hasData = true;
        this.collectProductData(data.productName);
        this.state.gotEditProduct = true;
      }
      if (
        data &&
        this.state.subCategoriesOptions.length > 0 &&
        this.state.subCategoryValue == 0
      ) {
        this.getSubCategoryForProductEdit(this.state.subCategory);
      }
      if (!this.state.productAdded) {
        return (
          <React.Fragment>
            <div className="main-container-top">
              <div className="second-container-top">
                {this.state.hasData ? (
                  <h1 className="product-editor-header">Edycja produktu</h1>
                ) : (
                  <h1 className="product-editor-header">Dodawanie produktu</h1>
                )}
                {this.state.imagePath.length > 0 ? (
                  <Image
                    id="image"
                    src={this.state.imagePath}
                    size="medium"
                    centered
                  />
                ) : (
                  <Image
                    id="image"
                    src={"http://127.0.0.1:8000/media/placeholder.png"}
                    size="medium"
                    centered
                  />
                )}
                <label htmlFor="image" className="center">
                  podgląd obrazu
                </label>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Field required={true}>
                    <label className="product-editor-bigg">
                      Nazwa Produktu
                    </label>
                    <input
                      id="productName"
                      name="productName"
                      value={this.state.productName}
                      required={true}
                      placeholder="Nazwa produktu"
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.TextArea
                    label="Opis"
                    className="product-editor-big"
                    name="description"
                    id="description"
                    value={this.state.description}
                    required={true}
                    placeholder="Opisz produkt"
                    onChange={this.handleChange}
                  ></Form.TextArea>
                  <Form.TextArea
                    label="Krótki opis produktu"
                    id="shortDescription"
                    value={this.state.shortDescription}
                    name="shortDescription"
                    required={true}
                    className="product-editor-big"
                    placeholder="Opisz krótko produkt"
                    onChange={this.handleChange}
                  ></Form.TextArea>
                  <Form.Group>
                    <Form.Field
                      width={2}
                      label="Cena"
                      value={this.state.price}
                      id="price"
                      name="price"
                      required={true}
                      control="input"
                      type="number"
                      className="product-editor-bigger-size product-editor-big"
                      onChange={this.handleChange}
                      min="0"
                      step="0.01"
                    />
                    <Form.Field
                      width={2}
                      label="Ilość"
                      required={true}
                      value={this.state.quantity}
                      control="input"
                      id="quantity"
                      name="quantity"
                      className="product-editor-bigger-size product-editor-big"
                      onChange={this.handleChange}
                      type="number"
                      min="1"
                      step="1"
                    />
                    {this.state.hasData ? (
                      <Form.Field
                        width={12}
                        label="Zdjęcie rozszerzenia .jpg/.png"
                        id="image"
                        name="image"
                        onChange={this.handleImageChange}
                        control="input"
                        type="file"
                        className="product-editor-wrap-content product-editor-big"
                      />
                    ) : (
                      <Form.Field
                        width={12}
                        label="Zdjęcie rozszerzenia .jpg/.png"
                        id="image"
                        name="image"
                        required={true}
                        onChange={this.handleImageChange}
                        control="input"
                        type="file"
                        className="product-editor-wrap-content product-editor-big"
                      />
                    )}
                  </Form.Group>
                  <Form.Group>
                    {this.state.hasData ? (
                      <Dropdown
                        id="category"
                        name="category"
                        required={true}
                        onChange={this.handleCategoryDropdown}
                        options={this.state.categoriesOptions}
                        value={this.state.categoryValue}
                        fluid
                        placeholder="Wybierz kategorie ii"
                        selection
                        label="Wybierz kategorie"
                      />
                    ) : (
                      <Dropdown
                        id="category"
                        name="category"
                        required={true}
                        onChange={this.handleCategoryDropdown}
                        options={this.state.categoriesOptions}
                        fluid
                        placeholder="Wybierz kategorie"
                        selection
                        label="Wybierz kategorie"
                      />
                    )}

                    {this.state.hasData &&
                    this.state.category.length > 0 &&
                    !this.state.changedCategory ? (
                      <Dropdown
                        id="subCategory"
                        name="subCategory"
                        onChange={this.handleSubcategoryDropdown}
                        options={this.state.subCategoriesOptions}
                        value={this.state.subCategoryValue}
                        required={true}
                        disabled={false}
                        fluid
                        label="Wybierz podkategorie"
                        placeholder="Wybierz podkategorie"
                        selection
                      />
                    ) : this.state.category.length > 0 ? (
                      <Dropdown
                        id="subCategory"
                        name="subCategory"
                        onChange={this.handleSubcategoryDropdown}
                        options={this.state.subCategoriesOptions}
                        value={
                          this.state.subCategoryAfterChange == 1
                            ? 1
                            : this.state.subCategoryValue
                        }
                        required={true}
                        disabled={false}
                        fluid
                        label="Wybierz podkategorie"
                        placeholder="Wybierz podkategorie"
                        selection
                      />
                    ) : (
                      <Dropdown
                        id="subCategory"
                        onChange={this.handleSubcategoryDropdown}
                        options={[]}
                        className="product-editor-disabled"
                        disabled={true}
                        fluid
                        placeholder="Najpierw wybierz kategorie"
                        selection
                      />
                    )}
                  </Form.Group>
                  {this.state.hasData ? (
                    <Button primary fluid type="submit">
                      Edytuj produkt
                    </Button>
                  ) : (
                    <Button primary fluid type="submit">
                      Dodaj produkt
                    </Button>
                  )}
                </Form>
                {this.state.productError && (
                  <Message
                    error
                    large
                    header={
                      "Nie udało się dodać przedmiotu " + this.state.error
                    }
                    content="Jest to problem z połączeniem albo taki przedmiot już istnieje"
                  />
                )}
              </div>
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <div className="main-container">
              <div className="second-container">
                {this.state.hasData && this.state.productAdded ? (
                  <Message
                    success
                    large
                    header="Udało się zedytować produkt"
                    content="Za chwilę zostanie przekierowany do przeglądu produktów"
                  />
                ) : (
                  <Message
                    success
                    large
                    header="Udało się dodać produkt"
                    content="Za chwilę zostanie przekierowany do przeglądu produktów"
                  />
                )}

                {this.state.productAdded && this.linkSomewhereElse()}
              </div>
            </div>
          </React.Fragment>
        );
      }
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

export default withRouter(connect(mapStateToProps)(ProductEditor));
