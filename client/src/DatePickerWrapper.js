import React from 'react';
import DatePicker from 'react-datepicker';

class DatePickerWrapper extends React.Component {
  state = {
    date: '',
    selectedDate: ''
  };

  componentDidMount() {
    this.setState({ date: this.props.defaultDate });
  }

  handleChange = date => {
    this.setState({
      date,
      selectedDate: date
    });
  };

  render() {
    const { date, selectedDate } = this.state;
    const { DateInput } = this.props;
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
