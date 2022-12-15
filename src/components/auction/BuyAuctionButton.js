import { drizzleConnect } from "@drizzle/react-plugin";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
// import axios from "axios";
// import { BACKEND_URL } from "../../util/config";
// import { Buffer } from "buffer";
import { utils } from "web3";

window.Buffer = window.Buffer || require("buffer").Buffer;

class BuyAuctionButton extends Component {
  constructor(props, context) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.NakamonstaAuction = context.drizzle.contracts.NakamonstaAuction;
    this.drizzle = context.drizzle;
    this.state = {
      buying: undefined,
      point_use: 0,
      flag: false,
    };
  }

  handleSubmit() {
    // this.setState((state) => {
    //   return {
    //     ...state,
    //     buying: true,
    //   };
    // });
    const max_point = this.props.user?.point || 0;
    const pointFactor = this.props.user?.pointFactor || 0;

    const point = Math.min(max_point, parseInt(this.state.point_use));
    let profit = new utils.BN(pointFactor).mul(new utils.BN(point));

    if (!this.state.flag) {
      profit = new utils.BN(0);
    }

    this.stackId = this.NakamonstaAuction.methods.bidOnAuction.cacheSend(
      this.props.nakamonstaId,
      point,
      {
        value: this.props.price.sub(profit),
      }
    );
  }

  checkTransactionStatus() {
    const state = this.drizzle.store.getState();
    const txHash = state.transactionStack[this.stackId];
    if (txHash) {
      if (state.transactions[txHash].status == "success") {
        this.setState({ buying: false });
      }
    }
  }

  UNSAFE_componentWillReceiveProps() {
    this.checkTransactionStatus();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCheckboxChange(e) {
    this.setState({ [e.target.name]: e.target.checked });
  }

  render() {
    const { user } = this.props;

    return (
      <>
        <div>
          <TextField
            name="point_use"
            value={this.state.point_use}
            onChange={this.handleChange.bind(this)}
            disabled={!this.state.flag}
          />
          <FormControlLabel
            control={<Checkbox disabled={user?.point <= 0} />}
            name="flag"
            onChange={this.handleCheckboxChange.bind(this)}
            style={{ marginTop: 8, marginLeft: 8 }}
            label="Use Points for Auction"
          />
        </div>
        <div>
          <Button
            style={{ marginTop: 8 }}
            variant="contained"
            color="primary"
            size="large"
            onClick={this.handleSubmit}
          >
            Buy Now!
          </Button>
          {this.state.buying ? (
            <CircularProgress variant="indeterminate" color="secondary" />
          ) : null}
        </div>
      </>
    );
  }
}

BuyAuctionButton.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    contracts: state.contracts,
    user: state.user,
  };
};

export default drizzleConnect(BuyAuctionButton, mapStateToProps);
