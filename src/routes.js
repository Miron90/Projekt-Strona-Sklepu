import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import Profile from "./containers/Profile";
import Products from "./containers/Products";
import ProduictEditor from "./containers/ProductEditor";

const BaseRouter = () => (
  <Hoc>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route exact path="/" component={HomepageLayout} />
    <Route path="/profile" component={Profile} />
    <Route path="/products" component={Products} />
    <Route path="/product/editor" component={ProduictEditor} />
  </Hoc>
);

export default BaseRouter;
