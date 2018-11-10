import React from 'react';

const DEFAULT_INPUT_WIDTH = 92;

class AutoComplete extends React.Component {
  state = {
    autoComplete: [],
    inputValue: '',
    selected: {},
    width: DEFAULT_INPUT_WIDTH
  };

  handleChange = e => {
    const { searchItems, searchKey, stateCallback } = this.props;
    const inputValue = e.currentTarget.value;
    const hasInputValue = inputValue.length > 0;

    const autoComplete = hasInputValue
      ? searchItems
          .filter(item => item[searchKey].toLowerCase().indexOf(inputValue.toLowerCase()) === 0)
          .slice(0, 10)
      : [];

    // poplate selected value if string is a match and they do not click
    if (autoComplete.length === 1 && inputValue.length === autoComplete[0][searchKey].length) {
      const possibleMatch = autoComplete[0];

      this.setState(
        {
          inputValue: possibleMatch[searchKey],
          selected: possibleMatch
        },
        () => {
          this.setWidth();
          if (stateCallback) {
            stateCallback(possibleMatch[searchKey]);
          }
        }
      );
    } else {
      this.setState(
        {
          inputValue,
          autoComplete,
          selected: {}
        },
        () => {
          this.setWidth();
          if (stateCallback) {
            stateCallback('');
          }
        }
      );
    }
  };

  handleClick = e => {
    const { searchKey, stateCallback } = this.props;
    const index = e.currentTarget.value;
    const selection = this.state.autoComplete[index];

    if (selection) {
      this.setState(
        {
          inputValue: selection[searchKey],
          selected: selection
        },
        () => {
          this.setWidth();
          if (stateCallback) {
            stateCallback(selection[searchKey]);
          }
        }
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
    const { autoComplete, selected, inputValue, width } = this.state;
    const { inputClassName, placeholder, searchKey } = this.props;

    return (
      <div className="AutoComplete">
        <input
          placeholder={placeholder}
          className={`${inputClassName} ${selected[searchKey] ? 'has-value' : ''}`}
          autoComplete="off"
          onChange={this.handleChange}
          style={{ width }}
          value={inputValue}
        />

        <span id="hiddenText">{inputValue}</span>

        {autoComplete.length > 0 && !selected[searchKey] && (
          // @TODO flip these class names
          <div className="AutoComplete-list">
            <ul className="AutoComplete-list_wrapper">
              {autoComplete.map((item, key) => (
                <li
                  className="AutoComplete-list_item"
                  key={key}
                  value={key}
                  onClick={this.handleClick}
                >
                  {item[searchKey]}
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
