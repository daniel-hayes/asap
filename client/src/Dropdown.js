import React from 'react';

class Dropdown extends React.Component {
  state = {
    defaultValue: 2,
    showDropdown: false,
    buttonValue: ''
  };

  toggleDropdown() {
    return !this.state.showDropdown;
  }

  handleClick = () => {
    this.setState({ showDropdown: this.toggleDropdown() });
  };

  handleItemSelect = e => {
    this.setState({
      buttonValue: e.currentTarget.innerHTML,
      showDropdown: this.toggleDropdown()
    });
  };

  render() {
    const { buttonValue, defaultValue, showDropdown } = this.state;

    return (
      <div className="Dropdown">
        <button onClick={this.handleClick} className={`input ${buttonValue ? 'has-value' : ''}`}>
          {buttonValue || defaultValue}
        </button>
        {showDropdown && (
          <div className="Dropdown-list_wrapper">
            <ul className="Dropdown-list">
              {Array(20)
                .fill()
                .map((v, i) => (
                  <li onClick={this.handleItemSelect} className="Dropdown-list_item" key={i}>
                    {i + 1}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
