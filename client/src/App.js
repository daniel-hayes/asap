import React from 'react';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
// import phoneProviders from './constants/phoneProviders';
import { API_ENDPOINT } from './config.js';
import AutoComplete from './AutoComplete';
import Dropdown from './Dropdown';
import DatePickerWrapper from './DatePickerWrapper';
import './App.css';

class App extends React.Component {
  state = {
    isAuthenticated: false,
    date: moment(),
    venueList: [],
    formInputs: {
      autoComplete: '',
      dropdown: '',
      datePicker: ''
    }
  };

  async componentDidMount() {
    // const validate = await fetch(`/validate${window.location.search}`);
    // const isAuthenticated = await validate.json();
    const isAuthenticated = true;

    const venueList = await this.fetchVenueList('venues');

    this.setState({
      isAuthenticated,
      venueList: venueList
    });
  }

  fetchVenueList = async key => {
    const response = localStorage.getItem(key);

    if (response) {
      return JSON.parse(response);
    }

    const data = await fetch(`${API_ENDPOINT}/fetch_venues`);
    const jsonData = await data.json();
    const venues = jsonData.Items;

    if (jsonData && venues && venues.length) {
      localStorage.setItem(key, JSON.stringify(venues));
    }

    return venues;
  };

  updateFormState(input, updatedState) {
    this.setState({
      formInputs: Object.assign({}, this.state.formInputs, { [input]: updatedState })
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
    const { formInputs, isAuthenticated, isLoading, venueList } = this.state;
    const formIsReady = Object.keys(formInputs).every(input => formInputs[input]);

    return (
      <div className="App">
        {isAuthenticated ? (
          <form className="App-form" onSubmit={this.handleAuthenticatedSubmit}>
            <div>
              I want a reservation at
              <AutoComplete
                inputClassName="input no-padding--right"
                searchKey="venue"
                placeholder="Lilia"
                searchItems={venueList}
                stateCallback={updatedState => {
                  this.updateFormState('autoComplete', updatedState);
                }}
              />
              , for
              <Dropdown
                items={Array(20)
                  .fill()
                  .map((v, i) => i + 1)}
                stateCallback={updatedState => {
                  this.updateFormState('dropdown', updatedState);
                }}
              >
                {({ handleClick, selection }) => (
                  <button onClick={handleClick} className={`input ${selection ? 'has-value' : ''}`}>
                    {selection || 2}
                  </button>
                )}
              </Dropdown>
              people, on
              <DatePickerWrapper
                defaultDate={moment().add(1, 'month')}
                DateInput={({ onClick, hasValue, value }) => (
                  <button
                    onClick={onClick}
                    className={`input no-padding--right ${hasValue ? 'has-value' : ''}`}
                  >
                    {moment(value).format('MMMM Do')}
                  </button>
                )}
                stateCallback={updatedState => {
                  this.updateFormState('datePicker', updatedState);
                }}
              />
              .
            </div>
            <button className={`book-it ${formIsReady ? 'ready' : ''}`} type="submit">
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
            <button className={`book-it ${formIsReady ? 'ready' : ''}`} type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
    );
  }
}

export default App;
