import React from 'react';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
// import phoneProviders from './constants/phoneProviders';
import AutoComplete from './AutoComplete';
import Dropdown from './Dropdown';
import DatePickerWrapper from './DatePickerWrapper';
import './App.css';

const InputWrapper = ({ children, id, label }) => (
  <div>
    <label className="label" htmlFor={id}>
      {label}
    </label>
    {React.cloneElement(children, { id, name: id })}
  </div>
);

class App extends React.Component {
  state = {
    isAuthenticated: false,
    date: moment(),
    restaurantList: [],
    restaurantSelection: {}
  };

  async componentDidMount() {
    const validate = await fetch(`/validate${window.location.search}`);
    // const isAuthenticated = await validate.json();
    const isAuthenticated = true;

    const MOCK_RES_LIST = [
      {
        id: '123',
        venue: 'Lilia',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn Is a super long name',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      },
      {
        id: '345',
        venue: 'Llama Inn',
        city: 'ny',
        url: 'google.com'
      }
    ];

    this.setState({
      isAuthenticated,
      restaurantList: MOCK_RES_LIST
    });
  }

  handleChange = date => {
    this.setState({ date });
  };

  getInputFields = form => {
    const formData = {};
    const inputFields = ['restaurant', 'phone', 'phoneProvider', 'guests'];

    // assign input valules to formData object
    inputFields.forEach(name => {
      const formElementName = form[name];

      if (formElementName) {
        formData[name] = formElementName.value;
      }
    });

    return formData;
  };

  handleSubmit = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const { date } = this.state;
    const formData = this.getInputFields(form);

    try {
      const fetchData = {
        method: 'post',
        body: JSON.stringify({ ...formData }),
        headers: {
          'content-type': 'application/json'
        }
      };

      const response = await fetch(`/authenticate`, fetchData);
      const json = await response.json();
      console.log(json);
    } catch (e) {
      console.log(e);
    }
  };

  handleAuthenticatedSubmit = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const { date } = this.state;
    const formData = this.getInputFields(form);

    try {
      const fetchData = {
        method: 'post',
        body: JSON.stringify({ ...formData, date: date.format() }),
        headers: {
          'content-type': 'application/json'
        }
      };

      const response = await fetch(`/reserve${window.location.search}`, fetchData);
      const json = await response.json();
      console.log(json);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { isAuthenticated, isLoading, restaurantList } = this.state;

    return (
      <div className="App">
        {isAuthenticated ? (
          <form className="App-form" onSubmit={this.handleAuthenticatedSubmit}>
            <div>
              I want a reservation at
              <AutoComplete searchKey="venue" placeholder="Lilia" searchItems={restaurantList} />
              for
              <Dropdown
                items={Array(20)
                  .fill()
                  .map((v, i) => i + 1)}
              >
                {({ handleClick, selection }) => (
                  <button onClick={handleClick} className={`input ${selection ? 'has-value' : ''}`}>
                    {selection || 2}
                  </button>
                )}
              </Dropdown>
              people on
              <DatePickerWrapper
                defaultDate={moment().add(1, 'month')}
                DateInput={({ onClick, hasValue, value }) => (
                  <button onClick={onClick} className={`input ${hasValue ? 'has-value' : ''}`}>
                    {moment(value).format('MMMM Do')}
                  </button>
                )}
              />
            </div>
            <button className="book-it" type="submit">
              Book It
            </button>
          </form>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input name="phone" id="phone" type="tel" placeholder="Phone number" />
            <label className="label" htmlFor="phoneProvider">
              Phone provider
            </label>
            <select name="phoneProvider" id="phoneProvider">
              <option>Phone provider</option>
              {/* {phoneProviders.sort().map((provider, key) => (
                <option key={key}>{provider}</option>
              ))} */}
            </select>
            <button className="book-it" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }
}

export default App;
