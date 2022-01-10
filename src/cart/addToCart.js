import axios from "axios";

function addToBasket(productName, quantity, price, token) {
    axios
        .put("http://127.0.0.1:8000/cart/", {
            productName: productName,
            quantity: quantity,
            price: price,
            token: token,
        })
        .then((res) => {
            console.log("git");
        })
        .catch((err) => {
            console.log(err);
        });
}

export default addToBasket;