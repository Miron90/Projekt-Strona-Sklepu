import axios from "axios";
export function getx2Products(page, howManyPerPage, productsClass) {
  axios
    .get(
      "http://127.0.0.1:8000/getproducts/" + page + "/" + howManyPerPage + "/"
    )
    .then((res) => {
      if (!res.data.error) {
        productsClass.state.gotProducts = true;
        var products = [];
        if (res.data.query.length > 0) {
          productsClass.state.allProducts = res.data.allProducts;
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
        productsClass.state.products = products;
        productsClass.forceUpdate();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export function search(search, page, howManyPerPage, productsClass) {
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
          productsClass.state.allProducts = res.data.allProducts;
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
        productsClass.state.products = products;
        productsClass.forceUpdate();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
