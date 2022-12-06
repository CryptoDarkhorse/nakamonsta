import { drizzleConnect } from "@drizzle/react-plugin";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Checkbox, FormControlLabel } from "@material-ui/core";

class BuyAuctionButton extends Component {
  constructor(props, context) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.NakamonstaAuction = context.drizzle.contracts.NakamonstaAuction;
    this.drizzle = context.drizzle;
    this.state = {
      buying: undefined,
    };
  }

  handleSubmit() {
    this.setState((state) => {
      return {
        ...state,
        buying: true,
      };
    });
    this.stackId = this.NakamonstaAuction.methods.bidOnAuction.cacheSend(
      this.props.nakamonstaId,
      {
        value: this.props.price,
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

  render() {
    const { user } = this.props;

    return (
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
        <FormControlLabel
          control={<Checkbox disabled={user?.point <= 0} />}
          style={{ marginTop: 8, marginLeft: 8 }}
          label="Use Points for Auction"
        />
      </div>
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
