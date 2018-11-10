import React from 'react';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser
} from 'amazon-cognito-identity-js';
import InputValidation from './InputValidation';
import { USER_POOL } from './config.js';

const MAX_PHONE_LENGTH = 10;
const isLikelyPhoneNumberRegEx = RegExp(/^\d{10}$/);
const FORM_STATES = {
  noAuth: 'NO_AUTH',
  next: 'NEXT',
  confirm: 'CONFIRM'
};

class Login extends React.Component {
  // @TODO clean this up...
  state = {
    phoneNumber: '',
    password: '',
    verification: '',
    formState: FORM_STATES.noAuth,
    validationError: '',
    passwordIsValid: false,
    verificationIsValid: false
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
          // unmount component
          authenticate(true);
        }
      });
    }
  }

  componentDidMount() {
    this.isAuthenticated();
  }

  handleChange = e => {
    const { name, value } = e.currentTarget;

    if (name === 'phoneNumber') {
      if (!isLikelyPhoneNumberRegEx.test(value) && value.length === MAX_PHONE_LENGTH) {
        this.setState({
          validationError: 'This is not a phone number...'
        });
        return;
      }
    }

    this.setState({
      [name]: value,
      validationError: ''
    });
  };

  login = e => {
    e.preventDefault();
    const { authenticate } = this.props;
    const { phoneNumber, password } = this.state;
    const fullNumber = `+1${phoneNumber}`;

    // assume login is valid
    this.setState({ passwordIsValid: true });

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
        // unmount component
        authenticate(true);
      },

      onFailure: err => {
        this.setState({ validationError: err.message, passwordIsValid: false });
      }
    });
  };

  createUser = e => {
    const { phoneNumber, password } = this.state;
    const fullNumber = `+1${phoneNumber}`;

    e.preventDefault();

    // assume login is valid
    this.setState({ passwordIsValid: true });

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
        let validationError = 'Something went wrong... Is your password is at least 6 characters.';

        if (err.name === 'UsernameExistsException') {
          validationError = 'An account with this number already exists.';
        }

        this.setState({ validationError, passwordIsValid: false });
        return;
      }

      console.log('user name is ' + result.user.getUsername());

      this.setState({
        formState: FORM_STATES.confirm,
        validationError: ''
      });
    });
  };

  verifyUser = e => {
    e.preventDefault();
    const { authenticate } = this.props;
    const { phoneNumber, verification } = this.state;
    const fullNumber = `+1${phoneNumber}`;

    // assume verification code is correct
    this.setState({ verificationIsValid: true });

    const cognitoUser = new CognitoUser({
      Username: fullNumber,
      Pool: new CognitoUserPool({
        UserPoolId: USER_POOL.poolId,
        ClientId: USER_POOL.clientId
      })
    });

    cognitoUser.confirmRegistration(verification, true, (err, result) => {
      if (err) {
        this.setState({
          verificationIsValid: false,
          validationError: 'This code is invalid.'
        });
        return;
      }

      // unmount component
      authenticate(true);
    });
  };

  render() {
    const {
      formState,
      phoneNumber,
      validationError,
      password,
      verification,
      passwordIsValid,
      verificationIsValid
    } = this.state;
    const phoneIsReady = phoneNumber.length === MAX_PHONE_LENGTH && !validationError;

    return (
      <form className="App-form">
        {formState === FORM_STATES.noAuth && (
          <div className="input-wrapper">
            <InputValidation isValid={phoneIsReady} message={validationError}>
              {({ isValid }) => (
                <label className={`input-label ${isValid}`} htmlFor="phoneNumber">
                  <input
                    id="phoneNumber"
                    autoComplete="off"
                    className="base-input input"
                    maxLength={MAX_PHONE_LENGTH}
                    type="tel"
                    name="phoneNumber"
                    placeholder="phone number"
                    onChange={this.handleChange}
                    value={phoneNumber}
                  />
                </label>
              )}
            </InputValidation>
            <button
              onClick={e => {
                e.preventDefault();

                if (phoneIsReady) {
                  this.setState({ formState: FORM_STATES.next });
                }
              }}
              className={`button ${phoneIsReady ? 'ready' : ''}`}
            >
              Next
            </button>
          </div>
        )}

        {formState === FORM_STATES.next && (
          <div className="input-wrapper">
            <InputValidation isValid={passwordIsValid} message={validationError}>
              {({ isValid }) => (
                <label className={`input-label ${isValid}`} htmlFor="password">
                  <input
                    className="base-input input"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={this.handleChange}
                    value={password}
                  />
                </label>
              )}
            </InputValidation>
            <div className="button-group">
              <button onClick={this.login} className="button ready">
                Log In
              </button>
              <button onClick={this.createUser} className="button ready">
                Create Account
              </button>
            </div>
          </div>
        )}

        {formState === FORM_STATES.confirm && (
          <div className="input-wrapper">
            <InputValidation isValid={verificationIsValid} message={validationError}>
              {({ isValid }) => (
                <label className={`input-label ${isValid}`} htmlFor="verification">
                  <input
                    className="base-input input"
                    id="verification"
                    name="verification"
                    type="num"
                    maxLength="6"
                    placeholder="verification code"
                    onChange={this.handleChange}
                    value={verification}
                  />
                </label>
              )}
            </InputValidation>
            <button onClick={this.verifyUser} className="button ready">
              Verify
            </button>
          </div>
        )}
      </form>
    );
  }
}

export default Login;
