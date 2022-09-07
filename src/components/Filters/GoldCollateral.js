import React from "react";
class GoldCollateral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onGoldCollateralChange = (e) => {
    var SelectedGoldCollateral = document.getElementById("goldchk").checked;
    this.props.onGoldCollateralChange(SelectedGoldCollateral);
    this.props.UpdateFilters(false);
  };

  ClearGoldCollateral = () => {
    document.getElementById("goldchk").checked = !document.getElementById(
      "goldchk"
    ).checked;
    this.props.onGoldCollateralChange("");
    this.props.UpdateFilters(true);
  };

  render() {
    return (
      <label className="mb-1 mt-1" style={{ color: "#000" }}>
        <input
          type="checkbox"
          value="checked"
          name="gold_collateral"
          className="mr-2"
          id="goldchk"
          style={{ verticalAlign: "middle" }}
          checked={this.props.value}
          onChange={(e) => {
            this.onGoldCollateralChange(e);
          }}
        />
        <span className="goldCol mr-1 ml-0">
          <strong>G</strong>
        </span>
        Show Gold Collaterals Only
      </label>
    );
  }
}

export default GoldCollateral;
