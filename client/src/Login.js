import React from 'react';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { USER_POOL } from './config.js';

const MAX_PHONE_LENGTH = 10;
const isLikelyPhoneNumberRegEx = RegExp(/^\d{10}$/);
const FORM_STATES = {
  noAuth: 'NO_AUTH',
  next: 'NEXT',
  confirm: 'CONFIRM'
};

class Login extends React.Component {
  state = {
    phoneNumber: '',
    password: '',
    verification: '',
    formState: FORM_STATES.noAuth,
    validationErrors: []
  };

  isAuthenticated() {
    const { authenticate } = this.props;

    const userPool = new CognitoUserPool({
      UserPoolId: USER_POOL.poolId,
      ClientId: USER_POOL.clientId
    });

    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser !== null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log(err);
          return;
        }

        if (session.isValid()) {
          authenticate(true);
        }
      });
    }
  }

  componentDidMount() {
    this.isAuthenticated();
  }

  // @TODO Refactor this function
  handleChange = e => {
    const { name, value } = e.currentTarget;

    if (name === 'phone') {
      if (!isLikelyPhoneNumberRegEx.test(value) && value.length === MAX_PHONE_LENGTH) {
        // do some validation
        console.log('not a number');
        return;
      }

      return this.setState({ phoneNumber: value });
    }

    if (name === 'password') {
      return this.setState({ password: value });
    }

    if (name === 'verification') {
      return this.setState({ verification: value });
    }
  };

  login = e => {
    e.preventDefault();
    const { authenticate } = this.props;
    const { phoneNumber, password } = this.state;
    const fullNumber = `+1${phoneNumber}`;

    const authenticationDetails = new AuthenticationDetails({
      Username: fullNumber,
      Password: password
    });

    const cognitoUser = new CognitoUser({
      Username: fullNumber,
      Pool: new CognitoUserPool({
        UserPoolId: USER_POOL.poolId,
        ClientId: USER_POOL.clientId
      })
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.idToken.jwtToken;
        console.log(result, accessToken, idToken);
        authenticate(true);
      },

      onFailure: err => {
        console.log(err);
      }
    });
  };

  createUser = e => {
    const { phoneNumber, password } = this.state;
    const fullNumber = `+1${phoneNumber}`;

    e.preventDefault();

    const userPool = new CognitoUserPool({
      UserPoolId: USER_POOL.poolId,
      ClientId: USER_POOL.clientId
    });

    var phoneAttribute = new CognitoUserAttribute({
      Name: 'phone_number',
      Value: fullNumber
    });

    userPool.signUp(fullNumber, password, [phoneAttribute], null, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log('user name is ' + result.user.getUsername());

      this.setState({
        formState: FORM_STATES.confirm
      });
    });
  };

  verifyUser = e => {
    e.preventDefault();
    const { authenticate } = this.props;
    const { phoneNumber, verification } = this.state;
    const fullNumber = `+1${phoneNumber}`;

    const cognitoUser = new CognitoUser({
      Username: fullNumber,
      Pool: new CognitoUserPool({
        UserPoolId: USER_POOL.poolId,
        ClientId: USER_POOL.clientId
      })
    });

    cognitoUser.confirmRegistration(verification, true, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(result);

      authenticate(true);
    });
  };

  render() {
    const { formState, phoneNumber, validationErrors, password, verification } = this.state;
    const phoneIsReady = phoneNumber.length === MAX_PHONE_LENGTH && validationErrors.length === 0;

    return (
      <form className="App-form">
        {formState === FORM_STATES.noAuth && [
          <input
            autoComplete="off"
            className="base-input input"
            maxLength={MAX_PHONE_LENGTH}
            type="tel"
            name="phone"
            placeholder="phone number"
            onChange={this.handleChange}
            value={phoneNumber}
          />,
          <button
            onClick={() => {
              this.setState({ formState: FORM_STATES.next });
            }}
            className={`button ${phoneIsReady ? 'ready' : ''}`}
          >
            Next
          </button>
        ]}

        {formState === FORM_STATES.next && [
          <input
            className="base-input input"
            name="password"
            type="password"
            placeholder="password"
            onChange={this.handleChange}
            value={password}
          />,
          <div className="button-group floating">
            <button onClick={this.login} className="button ready">
              Log In
            </button>
            <button onClick={this.createUser} className="button ready">
              Create Account
            </button>
          </div>
        ]}

        {formState === FORM_STATES.confirm && [
          <input
            className="base-input input"
            name="verification"
            type="num"
            maxLength="6"
            placeholder="verification code"
            onChange={this.handleChange}
            value={verification}
          />,
          <button onClick={this.verifyUser} className="button ready">
            Verify
          </button>
        ]}
      </form>
    );
  }
}

export default Login;
