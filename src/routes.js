import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import Profile from "./containers/Profile";
import Products from "./containers/Products";
import ProduictEditor from "./containers/ProductEditor";
import ProfileEditor from "./containers/ProfileEditor";
import ProductAssortment from "./containers/ProductAssortment";
import Cart from "./containers/Cart";
import Basket from "./containers/Basket"

const BaseRouter = () => (
  <Hoc>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route exact path="/" component={HomepageLayout} />
    <Route exact path="/profile" component={Profile} />
    <Route path="/products" component={Products} />
    <Route path="/product/editor" component={ProduictEditor} />
    <Route exact path="/profile/editor" component={ProfileEditor} />
    <Route path="/product/show" component={ProductAssortment} />
    <Route path="/cart" component={Cart} />
    <Route path="/basket" component={Basket} />
  </Hoc>
);

export default BaseRouter;
