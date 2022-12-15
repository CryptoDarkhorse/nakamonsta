import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import React, { Component, useEffect } from "react";
import SignUpOrProfileButton from "./SignUpOrProfileButton";
import { Typography } from "@material-ui/core";
import { drizzleConnect } from "@drizzle/react-plugin";
// import { BACKEND_URL } from "../util/config";
import PropTypes from "prop-types";
// import axios from "axios";

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  grow: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
});

class TopBar extends Component {
  constructor(props, context) {
    super(props);
    this.drizzle = context.drizzle;
    this.contracts = context.drizzle.contracts;
    // console.log("Getting point");
    this.dataKey = this.contracts.NakamonstaAuction.methods.getPoint.cacheCall();
    this.dataKeyFactor = this.contracts.NakamonstaAuction.methods.getPointFactor.cacheCall();
  }
  render() {
    const { classes, user } = this.props;
    // useEffect(() => {
    //   const address = this.drizzle.store.getState().accounts[0];
    //   console.log(address);
    // }, []);
    // BACKEND_URL;
    return (
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <span className={classes.grow} />
          <Typography>Earned Points: {user?.point || 0}</Typography>
          <Button color="inherit" component={Link} to="/market/">
            Market Place
          </Button>
          <Button color="inherit" component={Link} to="/dashboard/">
            Your Nakamonstas
          </Button>
          <SignUpOrProfileButton />
        </Toolbar>
      </AppBar>
    );
  }

  componentDidUpdate() {
    const { user } = this.props;

    if (this.dataKey in this.props.NakamonstaAuction.getPoint) {
      var point = this.props.NakamonstaAuction.getPoint[this.dataKey].value;

      if (user?.point != point) {
        this.props.store.dispatch({
          type: "USER_SET_POINT",
          payload: point,
        });
      }
    }
    if (this.dataKeyFactor in this.props.NakamonstaAuction.getPointFactor) {
      var pointFactor = this.props.NakamonstaAuction.getPointFactor[
        this.dataKeyFactor
      ].value;
      if (user?.pointFactor != pointFactor) {
        this.props.store.dispatch({
          type: "USER_SET_POINT_FACTOR",
          payload: pointFactor,
        });
      }
    }
  }
}

TopBar.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    NakamonstaAuction: state.contracts.NakamonstaAuction,
  };
};

export default withStyles(styles)(drizzleConnect(TopBar, mapStateToProps));
