import React from "react";
import { withRouter, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import {
  Button,
  Form,
  Dropdown,
  Image,
  Message,
  Popup,
  Grid,
  Header,
  Label,
  Input,
} from "semantic-ui-react";
import {
  collectProductData,
  editProduct,
  addProduct,
  getSubCategories,
  getAllCategories,
  addCategory,
  addSubcategory,
} from "../fetch/fetchProductEditor";

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
    newCategory: "",
    newSubcategory: "",
    catError: "",
    subcatError: "",
  };
  linkSomewhereElse() {
    console.log(this.props);
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
    getSubCategories(this.state.category, this);
  };
  handleSubmit = (e) => {
    if (this.state.subCategoriesOptions.length > 0) {
      if (this.state.hasData) {
        editProduct(
          this,
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
        addProduct(
          this,
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
    } else {
      window.alert("Podkategoria jest wymagana");
    }
  };
  handleSubcategoryDropdown = (e, { value }) => {
    this.state.subCategoryValue = value;
    this.state.subCategory = this.state.subCategoriesOptions[value - 1].text;
    this.state.subCategoryAfterChange = value;
    this.forceUpdate();
  };
  handleImageChange = (e) => {
    this.state.imagePath = URL.createObjectURL(e.target.files[0]);
    this.state.image = e.target.files[0];
    this.forceUpdate();
  };

  getSubCategoryForProductEdit(subCategory) {
    this.setState({
      subCategoryValue:
        this.state.subCategoriesOptions
          .map((e) => {
            return e.text;
          })
          .indexOf(subCategory) + 1,
    });
    this.state.subCategoryAfterChange = this.state.subCategoryValue;
    this.forceUpdate();
  }

  handleRedirect = () => {
    if (this.props.location.state !== undefined) {
      this.props.history.push("/products", {
        page: this.props.location.state.page,
        howmany: this.props.location.state.howmany,
      });
    } else {
      this.props.history.push("/products", {});
    }
  };
  handleAddSubcategory = () => {
    console.log(this.state.newSubcategory);
    this.state.catError = "";
    addSubcategory(
      this,
      this.state.newSubcategory,
      this.state.category,
      this.state.token
    );
    this.state.newSubcategory = "";
  };
  handleAddCategory = () => {
    console.log(this.state.newCategory);
    this.state.catError = "";
    addCategory(this, this.state.newCategory, this.state.token);
    this.state.newCategory = "";
  };
  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    var { authenticated, hasPerm, token } = this.props;
    hasPerm = localStorage.getItem("admin");
    authenticated = localStorage.getItem("admin");
    this.state.token = token;
    if (authenticated && hasPerm) {
      var data = this.props.location.state;

      if (data && !this.state.gotEditProduct && this.state.gotCategory) {
        this.state.hasData = true;
        collectProductData(data.productName, this);
        this.state.gotEditProduct = true;
      }
      if (!this.state.gotCategory) {
        getAllCategories(this);
        this.state.gotCategory = true;
      }
      if (
        data &&
        this.state.subCategoriesOptions.length > 0 &&
        this.state.subCategoryValue == 0
      ) {
        this.getSubCategoryForProductEdit(this.state.subCategory, this);
      }
      if (!this.state.productAdded) {
        return (
          <React.Fragment>
            <div className="main-container-top">
              <div className="second-container-top">
                <div>
                  <Button
                    color="green"
                    className="product-editor-back"
                    onClick={this.handleRedirect}
                  >
                    Back
                  </Button>
                  {this.state.hasData ? (
                    <h1 className="product-editor-header">Edycja produktu</h1>
                  ) : (
                    <h1 className="product-editor-header">
                      Dodawanie produktu
                    </h1>
                  )}
                </div>
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
                      <React.Fragment>
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
                          className="product-editor-dropdown-left"
                        />
                        <Popup
                          trigger={
                            <Label
                              color="green"
                              role=""
                              className="product-editor-btn"
                            >
                              +
                            </Label>
                          }
                          flowing
                          hoverable
                        >
                          <Grid centered divided columns={1}>
                            <Grid.Column textAlign="center">
                              <Header as="h4">Category</Header>
                              <Input
                                onChange={this.handleInput}
                                value={this.state.newCategory}
                                name="newCategory"
                                id="newCategory"
                              ></Input>
                              <Button
                                color="green"
                                onClick={this.handleAddCategory}
                              >
                                Dodaj
                              </Button>
                              {this.state.catError && (
                                <Message>{this.state.catError}</Message>
                              )}
                            </Grid.Column>
                          </Grid>
                        </Popup>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Dropdown
                          id="category"
                          name="category"
                          required={true}
                          onChange={this.handleCategoryDropdown}
                          options={this.state.categoriesOptions}
                          value={
                            this.state.categoryValue > 0
                              ? this.state.categoryValue
                              : null
                          }
                          fluid
                          placeholder="Wybierz kategorie"
                          selection
                          label="Wybierz kategorie"
                          className="product-editor-dropdown-left"
                        />
                        <Popup
                          trigger={
                            <Label
                              color="green"
                              role=""
                              className="product-editor-btn"
                            >
                              +
                            </Label>
                          }
                          flowing
                          hoverable
                        >
                          <Grid centered divided columns={1}>
                            <Grid.Column textAlign="center">
                              <Header as="h4">Category</Header>
                              <Input
                                onChange={this.handleInput}
                                value={this.state.newCategory}
                                name="newCategory"
                                id="newCategory"
                              ></Input>
                              <Button
                                color="green"
                                onClick={this.handleAddCategory}
                              >
                                Dodaj
                              </Button>
                              {this.state.catError && (
                                <Message>{this.state.catError}</Message>
                              )}
                            </Grid.Column>
                          </Grid>
                        </Popup>
                      </React.Fragment>
                    )}
                    {this.state.hasData &&
                    this.state.category.length > 0 &&
                    !this.state.changedCategory ? (
                      <React.Fragment>
                        <Dropdown
                          id="subCategory"
                          name="subCategory"
                          onChange={this.handleSubcategoryDropdown}
                          options={this.state.subCategoriesOptions}
                          value={this.state.subCategoryValue}
                          disabled={false}
                          fluid
                          label="Wybierz podkategorie"
                          placeholder="Wybierz podkategorie"
                          selection
                        />
                        <Popup
                          trigger={
                            <Label
                              color="green"
                              role=""
                              className="product-editor-btn product-editor-dropdown-right"
                            >
                              +
                            </Label>
                          }
                          flowing
                          hoverable
                        >
                          <Grid centered divided columns={1}>
                            <Grid.Column textAlign="center">
                              <Header as="h4">Subcategory</Header>
                              <Input
                                onChange={this.handleInput}
                                value={this.state.newSubcategory}
                                name="newSubcategory"
                                id="newSubcategory"
                              ></Input>
                              <Button
                                color="green"
                                onClick={this.handleAddSubcategory}
                              >
                                Dodaj
                              </Button>
                              {this.state.subcatError && (
                                <Message>{this.state.subcatError}</Message>
                              )}
                            </Grid.Column>
                          </Grid>
                        </Popup>
                      </React.Fragment>
                    ) : this.state.category.length > 0 &&
                      this.state.subCategoriesOptions.length > 0 ? (
                      <React.Fragment>
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
                          disabled={false}
                          fluid
                          label="Wybierz podkategorie"
                          placeholder="Wybierz podkategorie"
                          selection
                        />
                        <Popup
                          trigger={
                            <Label
                              color="green"
                              role=""
                              className="product-editor-btn product-editor-dropdown-right"
                            >
                              +
                            </Label>
                          }
                          flowing
                          hoverable
                        >
                          <Grid centered divided columns={1}>
                            <Grid.Column textAlign="center">
                              <Header as="h4">Subcategory</Header>
                              <Input
                                onChange={this.handleInput}
                                value={this.state.newSubcategory}
                                name="newSubcategory"
                                id="newSubcategory"
                              ></Input>
                              <Button
                                color="green"
                                onClick={this.handleAddSubcategory}
                              >
                                Dodaj
                              </Button>
                              {this.state.subcatError && (
                                <Message>{this.state.subcatError}</Message>
                              )}
                            </Grid.Column>
                          </Grid>
                        </Popup>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Dropdown
                          id="subCategory"
                          onChange={this.handleSubcategoryDropdown}
                          options={[]}
                          className="product-editor-disabled"
                          disabled={true}
                          fluid
                          placeholder="Najpierw wybierz kategorie lud dodaj podkategorie"
                          selection
                        />
                        <Popup
                          trigger={
                            <Label
                              color="green"
                              role=""
                              className="product-editor-btn product-editor-dropdown-right"
                            >
                              +
                            </Label>
                          }
                          flowing
                          hoverable
                        >
                          <Grid centered divided columns={1}>
                            <Grid.Column textAlign="center">
                              <Header as="h4">Subcategory</Header>
                              <Input
                                onChange={this.handleInput}
                                value={this.state.newSubcategory}
                                name="newSubcategory"
                                id="newSubcategory"
                              ></Input>
                              <Button
                                color="green"
                                onClick={this.handleAddSubcategory}
                              >
                                Dodaj
                              </Button>
                              {this.state.subcatError && (
                                <Message>{this.state.subcatError}</Message>
                              )}
                            </Grid.Column>
                          </Grid>
                        </Popup>
                      </React.Fragment>
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
