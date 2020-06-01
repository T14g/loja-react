import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './App.css';
import HomePage from './pages/homepage/homepage.component';
import CheckoutPage from './pages/checkout/checkout.component';
import ShopPage from './pages/shop/shop.component';

import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { selectCurrentUser } from './redux/user/user.selectors';

import { checkUserSession } from './redux/user/user.actions';


class  App extends React.Component {

  unsuscribreFromAuth = null;

  componentDidMount() {
    const { checkUserSession } = this.props;
    checkUserSession();
    
  }

  //will close the subscription preventind memory leaks
  componentWillUnmount() {
    this.unsuscribreFromAuth();
  }

  render() {
    return (
      <div >
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route  path='/shop' component={ShopPage} />
          <Route  path='/checkout' component={CheckoutPage} />
          <Route  path='/signin' render={() => 
          this.props.currentUser ? (
            <Redirect to ='/' />
          ) : (
            <SignInAndSignUpPage />
          )
          } />
        </Switch>
      </div>
    );
  }

}

const mapStateToProps = createStructuredSelector ({
  currentUser : selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
