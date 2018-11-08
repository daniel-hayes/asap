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

class Login extends React.Component {
  state = {
    phoneNumber: '',
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
      cognitoUser.getSession(function(err, session) {
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

  handleChange = e => {
    const inputValue = e.currentTarget.value;

    if (!isLikelyPhoneNumberRegEx.test(inputValue) && inputValue.length === MAX_PHONE_LENGTH) {
      // do some validation
      console.log('not a number');
      return;
    }

    this.setState({ phoneNumber: inputValue });
  };

  login = e => {
    e.preventDefault();
    const { authenticate } = this.props;

    const authenticationDetails = new AuthenticationDetails({
      Username: '+14136875432',
      Password: 'password'
    });

    const cognitoUser = new CognitoUser({
      Username: '+14136875432',
      Pool: new CognitoUserPool({
        UserPoolId: USER_POOL.poolId,
        ClientId: USER_POOL.clientId
      })
    });

    // cognitoUser.confirmRegistration('573142', true, function(err, result) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log(result);
    // });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        const accessToken = result.getAccessToken().getJwtToken();

        /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
        const idToken = result.idToken.jwtToken;
        console.log(result, accessToken, idToken);
        authenticate(true);
      },

      onFailure: function(err) {
        console.log(err);
      }
    });
  };

  createUser = e => {
    e.preventDefault();

    const userPool = new CognitoUserPool({
      UserPoolId: USER_POOL.poolId,
      ClientId: USER_POOL.clientId
    });

    var phoneNumber = new CognitoUserAttribute({
      Name: 'phone_number',
      Value: '+14136875432'
    });

    userPool.signUp('+14136875432', 'password', [phoneNumber], null, (err, result) => {
      if (err) {
        // handle validation
        console.log(err);
        return;
      }

      console.log(result);
      console.log('user name is ' + result.user.getUsername());
    });
  };

  render() {
    const { phoneNumber, validationErrors, isLoading, venueList } = this.state;
    const phoneIsReady = phoneNumber.length === MAX_PHONE_LENGTH && validationErrors.length === 0;

    return (
      <form className="App-form" onSubmit={this.handleSubmit}>
        <input
          autoComplete="off"
          className="base-input input"
          name="phone"
          maxLength={MAX_PHONE_LENGTH}
          type="tel"
          placeholder="xxx xxx xxxx"
          onChange={this.handleChange}
          value={phoneNumber}
        />

        <div className="button-group floating">
          <button onClick={this.login} className={`button ${phoneIsReady ? 'ready' : ''}`}>
            Log In
          </button>
          <button onClick={this.createUser} className={`button ${phoneIsReady ? 'ready' : ''}`}>
            Create Account
          </button>
        </div>

        {/* <button className="button ready">Next</button> */}

        {/* <input
          className="base-input input"
          name="password"
          type="password"
          placeholder="password"
        /> */}
      </form>
    );
  }
}

export default Login;
