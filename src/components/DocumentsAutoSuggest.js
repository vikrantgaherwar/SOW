import React from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import URLConfig from "./URLConfig";
import https from "https";

const getSuggestionValue = (suggestion) => suggestion.term;
const renderSuggestion = (suggestion) => <div>{suggestion.term}</div>;
class DocumentAutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      suggestions: [],
      showSuggestions: true,
    };
  }

  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    if (inputLength > 3) {
      axios
        .get(URLConfig.getURL_Suggestions(value), {
          httpsAgent: agent,
          withCredentials: true,
          auth: {
            username: "readuser",
            password: "readuser",
          },
        })
        .then((res) => {
          if (res.data.suggest.mySuggester[value] !== undefined) {
            this.setState({
              suggestions: res.data.suggest.mySuggester[value].suggestions,
            });
          }
        });
    } else {
      this.setState({
        suggestions: [],
      });
    }
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      showSuggestions: true,
    });
    const { onSearchValueChange } = this.props;
    onSearchValueChange(newValue);
  };

  onKeyUp = (event) => {
    if (event.key === "Enter") {
      const { fireSearch } = this.props;
      this.setState({ showSuggestions: false });
      fireSearch(this.state.value);
    }
  };

  onKeyDown = (event) => {
    this.setState({ showSuggestions: true });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    const { fireSearch } = this.props;
    fireSearch(suggestionValue);
  };

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 2 && this.state.showSuggestions;
  };

  render() {
    const { suggestions } = this.state;
    const { value } = this.props;
    const inputProps = {
      placeholder: "Hi, What are you looking for?",
      value,
      onChange: this.onChange,
      onKeyUp: this.onKeyUp,
      onKeyDown: this.onKeyDown,
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
      />
    );
  }
}
export default DocumentAutoSuggest;
