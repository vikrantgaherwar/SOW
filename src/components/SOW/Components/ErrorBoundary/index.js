import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { resetAll } from "../../Redux/Actions/ResetAll";
import ErrorComponent from "../ErrorComponent";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /* handle home route */
  handlePrevious = (e) => {
    e.preventDefault();
    this.props.resetAll();
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorComponent />;
    }

    return this.props.children;
  }
}

export default connect(null, { resetAll })(ErrorBoundary);
