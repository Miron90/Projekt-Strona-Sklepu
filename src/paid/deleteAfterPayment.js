import axios from "axios";

function deletePayment(productName, quantity) {
  axios
    .put("http://127.0.0.1:8000/payment/", {
      productName: productName,
      quantity: quantity,
    })
    .then((res) => {
      console.log("git");
    })
    .catch((err) => {
      console.log(err);
    });
}

export default deletePayment;
