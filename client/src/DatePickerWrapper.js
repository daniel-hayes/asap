import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const DateInput = ({ onClick, hasValue, value }) => {
  return (
    <button onClick={onClick} className={`input ${hasValue ? 'has-value' : ''}`}>
      {moment(value).format('MMMM Do')}
    </button>
  );
};

class DatePickerWrapper extends React.Component {
  state = {
    date: moment().add(1, 'month'),
    selectedDate: ''
  };

  handleChange = date => {
    this.setState({
      date,
      selectedDate: date
    });
  };

  render() {
    const { date, selectedDate } = this.state;
    return (
      <div className="DatePickerWrapper">
        <DatePicker
          customInput={<DateInput hasValue={selectedDate} />}
          selected={date}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default DatePickerWrapper;
