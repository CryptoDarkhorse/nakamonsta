import React from "react";
import ReactDOM from "react-dom/client";
// import { Router, Routes, Route } from "react-router";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { DrizzleProvider } from "@drizzle/react-plugin";

// Layouts
import App from "./App";
import Home from "./layouts/home/Home";
import Dashboard from "./layouts/user/Dashboard";
import SignUp from "./layouts/user/SignUp";
import Profile from "./layouts/user/Profile";
import NakamonstaDetail from "./layouts/nakamonsta/NakamonstaDetail";
import Reproduction from "./layouts/nakamonsta/Reproduction";
import MarketPlace from "./layouts/market/MarketPlace";

import LoadingContainer from "./components/LoadingContainer";
import TopBar from "./components/TopBar";

// Store
import { history, store } from "./store";
import drizzleOptions from "./drizzleOptions";
import { UserIsNotAuthenticated } from "./util/wrappers";

// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

// const Wrapper = () => {
//   return <>{UserIsNotAuthenticated((SignUp))}</>
// }
const Wrapper = (props => UserIsNotAuthenticated(props.children));
root.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <Provider store={store}>
      <LoadingContainer>
        <Router history={history} element={<App />}>
          <TopBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/dashboard/" element={<Dashboard />} />
            <Route exact path="/signup/" element={<SignUp />} />
            <Route exact path="/profile/" element={<Profile />} />
            <Route
              exact
              path={"/nakamonsta/:id/"}
              element={<NakamonstaDetail />}
            />
            <Route exact path={"/market/"} element={<MarketPlace />} />
            <Route
              exact
              path={"/reproduction/:motherId/"}
              element={<Reproduction />}
            />
            <Route
              exact
              path={"/reproduction/:motherId/:fatherId/"}
              element={<Reproduction />}
            />
          </Routes>
        </Router>
      </LoadingContainer>
    </Provider>
  </DrizzleProvider>
);

// reportWebVitals();
