import axios from "axios";

export function deletePayment(products, token) {
  axios
    .post("http://127.0.0.1:8000/payment/", {
      products: products,
      token: token,
    })
    .then((res) => {
      console.log("git");
    })
    .catch((err) => {
      console.log(err);
    });
}

export function deleteProductFromBasket(productName, token) {
  axios
    .post("http://127.0.0.1:8000/deletefrombasket/", {
      productName: productName,
      token: token,
    })
    .then((res) => {
      console.log("git");
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
