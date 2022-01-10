import axios from "axios";
import { Redirect } from "react-router-dom";
export function getbasket(productsClass, token) {
    console.log(token)
    axios
        .get("http://127.0.0.1:8000/basket/" + token + '/')
        .then((res) => {
            console.log(res.data.result)
            var temp = []
            var fullprice = 0
            for (var i = 0; i < res.data.result.length; i++) {
                temp[i] = {
                    quantity: res.data.result[i].quantity,
                    imagePath: res.data.result[i].product.imagePath,
                    price: res.data.result[i].product.price,
                    productName: res.data.result[i].product.productName,

                }
                fullprice = fullprice + res.data.result[i].product.price * res.data.result[i].quantity

            }







            productsClass.state.products = temp
            productsClass.state.fullprice = Math.round(fullprice * 100) / 100



            productsClass.forceUpdate()
            // productsClass.state.
            // if (!res.data.error) {
            //     if (res.data.length > 0) {
            //         var categoriesOptions = [];
            //         for (var i = 0; i < res.data.length; i++) {
            //             categoriesOptions[i] = { text: res.data[i].name, value: i + 1 };
            //         }
            //         if (
            //             productsClass.state.categoriesOptions.length <
            //             categoriesOptions.length
            //         ) {
            //             productsClass.state.categoriesOptions = categoriesOptions;
            //             if (newValue) {
            //                 console.log(category);
            //                 productsClass.setState({
            //                     categoryValue:
            //                         productsClass.state.categoriesOptions
            //                             .map((e) => {
            //                                 console.log(e.text);
            //                                 return e.text;
            //                             })
            //                             .indexOf(category) + 1,
            //                 });
            //                 productsClass.state.subCategoriesOptions = [];
            //             }
            //             productsClass.forceUpdate();
            //         }
            //     }
            // }
        })
        .catch((err) => {
            console.log(err);
        });
}