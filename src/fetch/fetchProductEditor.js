import axios from "axios";
export function getAllCategories(productsClass, newValue, category) {
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
            productsClass.state.categoriesOptions.length <
            categoriesOptions.length
          ) {
            productsClass.state.categoriesOptions = categoriesOptions;
            if (newValue) {
              console.log(category);
              productsClass.setState({
                categoryValue:
                  productsClass.state.categoriesOptions
                    .map((e) => {
                      console.log(e.text);
                      return e.text;
                    })
                    .indexOf(category) + 1,
              });
              productsClass.state.subCategoriesOptions = [];
            }
            productsClass.forceUpdate();
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function getSubCategories(
  category,
  productsClass,
  newValue,
  subcategory
) {
  axios
    .get("http://127.0.0.1:8000/getsubcategories/" + category + "/")
    .then((res) => {
      if (!res.data.error) {
        if (res.data.length > 0) {
          var categoriesOptions = [];
          for (var i = 0; i < res.data.length; i++) {
            categoriesOptions[i] = { text: res.data[i].name, value: i + 1 };
          }
          productsClass.state.subCategoriesOptions = categoriesOptions;

          console.log(productsClass.state.subCategory);
          if (productsClass.state.subCategory) {
          } else {
            productsClass.state.subCategoryValue = 1;
            productsClass.state.subCategory =
              productsClass.state.subCategoriesOptions[0].text;
          }
          productsClass.state.changedCategory = productsClass;
          if (newValue) {
            productsClass.setState({
              subCategoryValue:
                productsClass.state.subCategoriesOptions
                  .map((e) => {
                    return e.text;
                  })
                  .indexOf(subcategory) + 1,
            });
            productsClass.setState({
              subCategoryAfterChange: productsClass.state.subCategoryValue,
            });
          }
        } else {
          productsClass.state.subCategoriesOptions = [];
          productsClass.state.subCategory = "";
          productsClass.state.subCategoryValue = 0;
        }
        productsClass.forceUpdate();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function addProduct(
  productsClass,
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
      if (res.data.result.includes("success")) {
        productsClass.state.productAdded = true;
        productsClass.state.productError = false;
      } else {
        productsClass.state.productError = true;
        productsClass.state.productAdded = false;
        productsClass.state.error = res.data.error;
      }
      productsClass.forceUpdate();
    })
    .catch((err) => {
      console.log(err);
    });
}

export function editProduct(
  productsClass,
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
    .post("http://127.0.0.1:8000/editproduct/", formData)
    .then((res) => {
      console.log(res.data);
      if (!res.data.error) {
        productsClass.state.productAdded = true;
        productsClass.state.productError = false;
      } else {
        productsClass.state.productError = true;
        productsClass.state.productAdded = false;
        productsClass.state.error = res.data.error;
      }
      productsClass.forceUpdate();
    })
    .catch((err) => {
      console.log(err);
    });
}

export function collectProductData(productName, productsClass) {
  axios
    .get("http://127.0.0.1:8000/getproduct/" + productName + "/")
    .then((res) => {
      if (!res.data.error) {
        productsClass.setState({ productName: res.data[0].productName });
        productsClass.setState({ description: res.data[0].description });
        productsClass.setState({
          shortDescription: res.data[0].shortDescription,
        });
        productsClass.setState({ price: res.data[0].price });
        productsClass.setState({ quantity: res.data[0].quantity });
        productsClass.setState({ category: res.data[0].category_id });
        productsClass.setState({ subCategory: res.data[0].subcategory_id });
        productsClass.setState({ originalName: res.data[0].productName });
        productsClass.setState({
          imagePath: "http://127.0.0.1:8000/media/" + res.data[0].image,
        });
        productsClass.setState({
          categoryValue:
            productsClass.state.categoriesOptions
              .map((e) => {
                return e.text;
              })
              .indexOf(res.data[0].category_id) + 1,
        });
        getSubCategories(res.data[0].category_id, productsClass);
        productsClass.forceUpdate();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function addCategory(productsClass, category, token) {
  axios
    .put("http://127.0.0.1:8000/addcategory/", {
      category: category,
      token: token,
    })
    .then((res) => {
      if (!res.data.error) {
        productsClass.state.gotCategory = false;
        getAllCategories(productsClass, true, category);
        productsClass.state.category = category;
        productsClass.state.categories = category;
        productsClass.state.catError = "";
      } else {
        productsClass.state.catError = res.data.error;
      }
      productsClass.forceUpdate();
    })
    .catch((err) => {
      console.log(err);
    });
}
export function addSubcategory(productsClass, subCategory, category, token) {
  axios
    .put("http://127.0.0.1:8000/addsubcategory/", {
      subCategory: subCategory,
      category: category,
      token: token,
    })
    .then((res) => {
      if (!res.data.error) {
        getSubCategories(category, productsClass, true, subCategory);
        productsClass.state.subcatError = "";
      } else {
        productsClass.state.subcatError = res.data.error;
      }
      productsClass.forceUpdate();
    })
    .catch((err) => {
      console.log(err);
    });
}
