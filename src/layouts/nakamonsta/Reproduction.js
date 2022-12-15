import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import { useParams } from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { FormControlLabel, Checkbox, TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import { utils } from "web3";
import NakamonstaCard from "../../components/nakamonstas/NakamonstaCard";
import NakamonstaPicker from "../../components/nakamonstas/NakamonstaPicker";

export const USER_UPDATED = "USER_UPDATED";

class Reproduction extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.NakamonstaAuction = context.drizzle.contracts.NakamonstaAuction;
    this.drizzle = context.drizzle;
    this.motherId = this.props.params.motherId;
    this.fatherId = this.props.params.fatherId;
    this.state = {
      fatherId: undefined,
      babyId: undefined,
      mating: false,
      point_use: 0,
      flag: false,
    };
  }

  onClick(event, n) {
    this.setState({ fatherId: n });
    event.preventDefault();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCheckboxChange(e) {
    this.setState({ [e.target.name]: e.target.checked });
  }

  handleSubmit() {
    // TODO: Check inputs
    this.setState((state) => {
      return {
        ...state,
        mating: true,
      };
    });

    const matingPrice = utils.toWei("0.01", "ether");

    const max_point = this.props.user?.point || 0;
    const pointFactor = this.props.user?.pointFactor || 0;

    let point = Math.min(max_point, parseInt(this.state.point_use));
    let profit = new utils.BN(pointFactor).mul(new utils.BN(point));

    if (!this.state.flag) {
      point = 0;
      profit = new utils.BN(0);
    }

    // console.log(matingPrice);
    // console.log(profit);
    // console.log(matingPrice.sub(profit));
    this.stackId = this.NakamonstaAuction.methods.mate.cacheSend(
      this.motherId,
      this.fatherId,
      point,
      {
        value: matingPrice - point * pointFactor,
      }
    );
  }

  fatherOrPicker() {
    this.fatherId = this.state.fatherId ? this.state.fatherId : this.fatherId;
    if (this.fatherId === undefined) {
      return (
        <Grid item>
          Father:
          <NakamonstaPicker
            onClick={this.onClick.bind(this)}
            pickerCallback={this.nakamonstaPicked}
          />
        </Grid>
      );
    }
    return (
      <Grid item>
        Father:
        <NakamonstaCard nakamonstaId={this.fatherId} />
      </Grid>
    );
  }

  checkTransactionStatus() {
    const state = this.drizzle.store.getState();
    const txHash = state.transactionStack[this.stackId];
    if (txHash) {
      // TODO: if transaction is rejected/error reset the state
      if (
        state.transactions[txHash].receipt &&
        "NakamonstaBirth" in state.transactions[txHash].receipt.events
      ) {
        const babyId =
          state.transactions[txHash].receipt.events.NakamonstaBirth
            .returnValues[0];
        this.setState((state) => {
          return { ...state, babyId: babyId };
        });
      }
    }
  }

  UNSAFE_componentWillReceiveProps() {
    this.checkTransactionStatus();
  }

  displayActionButtonOrBaby() {
    const { user } = this.props;
    if (this.state.babyId === undefined) {
      return (
        <>
          <Button
            variant="contained"
            color="primary"
            size="large"
            margin="normal"
            style={{ marginTop: "40px" }}
            disabled={
              this.fatherId === undefined || this.motherId === undefined
            }
            onClick={this.handleSubmit.bind(this)}
          >
            Give them some privacy (brrr)!
          </Button>
          <div>
            <TextField
              name="point_use"
              value={this.state.point_use}
              onChange={this.handleChange.bind(this)}
              disabled={!this.state.flag}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="flag"
                  disabled={user?.point <= 0}
                  checked={this.state.flag}
                  onClick={this.handleCheckboxChange.bind(this)}
                />
              }
              style={{ marginTop: 8, marginLeft: 8 }}
              label="Use Points for Auction"
            />
          </div>
        </>
      );
    }
    return (
      <Grid style={{ marginTop: "40px" }} container spacing={10}>
        <Grid item>
          A new baby is born, let them rest.
          <NakamonstaCard nakamonstaId={this.state.babyId} />
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <div className="content">
        <h1>Reproduction</h1>
        <Grid container spacing={10}>
          <Grid item>
            Mother:
            <NakamonstaCard nakamonstaId={this.motherId} />
          </Grid>
          {this.fatherOrPicker()}
        </Grid>

        {this.displayActionButtonOrBaby()}
      </div>
    );
  }
}

Reproduction.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    NakamonstaAuction: state.contracts.NakamonstaAuction,
    accounts: state.accounts,
    user: state.user,
  };
};

// export default drizzleConnect(Reproduction, mapStateToProps);

const Page = (props) => <Reproduction {...props} params={useParams()} />;

export default drizzleConnect(Page, mapStateToProps);
