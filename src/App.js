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
import { auth, createUserProfileDocument } from './firebase/firebase.utils'; 
import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';




class  App extends React.Component {

  unsuscribreFromAuth = null;

  componentDidMount() {

    const { setCurrentUser } = this.props; 

    //will return a function that's when called closes the subscription
    //Quando o state do auth mudar retorna o objecto userAuth
    //UserAuth fica na table authentication , qualquer um que logar , e recebe um userID
    this.unsuscribreFromAuth = auth.onAuthStateChanged( async userAuth => {
      // this.setState({ currentUser: user});

      if(userAuth) {

        //Passa esse objecto userAuth para o método que cria o user profile
        const userRef = await createUserProfileDocument(userAuth);

        //quando o doc snapshot muda chama o setCurrentUser action para o redux
        userRef.onSnapshot(snapShot =>{
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data() 
          });
        });
      }

      setCurrentUser(userAuth);

      //Adds  data to firebase in a bulk
      //Get a new array with what you want using map
      // addCollectionAndDocuments('collections', collectionsArray.map(({title, items}) => ({title, items})));

    });

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

//Make dispatch of actions acessible via props
const mapDispatchToProps = dispatch => ({
  setCurrentUser : user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps , mapDispatchToProps) (App);
