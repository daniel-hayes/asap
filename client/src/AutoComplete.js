import React from 'react';

const DEFAULT_INPUT_WIDTH = 67;

class AutoComplete extends React.Component {
  state = {
    autoComplete: [],
    inputValue: '',
    selectedVenue: {},
    width: DEFAULT_INPUT_WIDTH
  };

  handleChange = e => {
    const { restaurantList } = this.props;
    const inputValue = e.currentTarget.value;
    const hasInputValue = inputValue.length > 0;

    const autoComplete = hasInputValue
      ? restaurantList
          .slice(0, 10)
          .filter(({ venue }) => venue.toLowerCase().indexOf(inputValue.toLowerCase()) === 0)
      : [];

    // poplate selected value if string is a match and they do not click
    if (autoComplete.length === 1 && inputValue.length === autoComplete[0].venue.length) {
      const possibleVenue = autoComplete[0];

      this.setState(
        {
          inputValue: possibleVenue.venue,
          selectedVenue: possibleVenue
        },
        this.setWidth
      );
    } else {
      this.setState(
        {
          inputValue,
          autoComplete,
          selectedVenue: {}
        },
        this.setWidth
      );
    }
  };

  handleClick = e => {
    const index = e.currentTarget.value;
    const selection = this.state.autoComplete[index];

    if (selection) {
      this.setState(
        {
          inputValue: selection.venue,
          selectedVenue: selection
        },
        this.setWidth
      );
    }
  };

  setWidth = () => {
    const { inputValue } = this.state;
    const width =
      inputValue === '' ? DEFAULT_INPUT_WIDTH : document.getElementById('hiddenText').offsetWidth;
    this.setState({ width });
  };

  render() {
    const { autoComplete, selectedVenue, inputValue, width } = this.state;
    const { id } = this.props;

    return (
      <div className="AutoComplete">
        <input
          placeholder="Lilia"
          className={`input ${selectedVenue.venue ? 'has-value' : ''}`}
          autoComplete="off"
          onChange={this.handleChange}
          name={id}
          id={id}
          style={{ width }}
          value={inputValue}
        />

        <span id="hiddenText">{inputValue}</span>

        {autoComplete.length > 0 &&
          !selectedVenue.venue && (
            // flip these class names
            <div className="AutoComplete-list">
              <ul className="AutoComplete-list_wrapper">
                {autoComplete.map(({ venue }, key) => (
                  <li
                    className="AutoComplete-list_item"
                    key={key}
                    value={key}
                    onClick={this.handleClick}
                  >
                    {venue}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    );
  }
}

export default AutoComplete;
