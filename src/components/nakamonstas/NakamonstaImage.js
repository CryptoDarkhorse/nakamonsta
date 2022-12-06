import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import * as genetics from "../../util/genetics";

const styles = () => ({
  container: {
    width: "200px",
    height: "200px",
    position: "relative",
    zIndex: 0
  },
  bodyPart: {
    width: "200px",
    height: "200px",
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    right: 0
  }
});

class NakamonstaImage extends Component {
  getBodyImage(genes) {
    return "/assets/body" + genetics.getBodyType(genes) + ".png";
  }

  getEyesImage(genes) {
    return "/assets/eyes" + genetics.getEyesType(genes) + ".png";
  }

  getMouthImage(genes) {
    return "/assets/mouth" + genetics.getMouthType(genes) + ".png";
  }

  getEarsImage(genes) {
    return "/assets/ears" + genetics.getEarsType(genes) + ".png";
  }

  render() {
    const { classes, genes } = this.props;

    let returnable;
    try{
      returnable = (<div className={classes.container}>
        <img className={classes.bodyPart} alt="" src={require("../../../assets/ground.png").default} />
        <img className={classes.bodyPart} alt="" src={require("/assets/body" + genetics.getBodyType(genes) + ".png").default} />
        <img className={classes.bodyPart} alt="" src={require("/assets/eyes" + genetics.getEyesType(genes) + ".png").default} />
        <img className={classes.bodyPart} alt="" src={require("/assets/mouth" + genetics.getMouthType(genes) + ".png").default} />
        <img className={classes.bodyPart} alt="" src={require("/assets/ears" + genetics.getEarsType(genes) + ".png").default} />
      </div>);
    } catch(e) {
      returnable = (<div className={classes.container}>
        <img className={classes.bodyPart} alt="" />
        <img className={classes.bodyPart} alt="" />
        <img className={classes.bodyPart} alt="" />
        <img className={classes.bodyPart} alt="" />
        {/* <img className={classes.bodyPart} alt="" src={require("../../../assets/ground.png").default} /> */}
      </div>)
    }
    return returnable;
  }
}

export default withStyles(styles)(NakamonstaImage);
