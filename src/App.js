import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils'; 
import { setCurrentUser } from './redux/user/user.actions';




class  App extends React.Component {

  unsuscribreFromAuth = null;

  componentDidMount() {

    const { setCurrentUser } = this.props; 

    //will return a function that's when called closes the subscription
    this.unsuscribreFromAuth = auth.onAuthStateChanged( async userAuth => {
      // this.setState({ currentUser: user});

      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot =>{
          setCurrentUser({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          })
        })
      }else{
        setCurrentUser(userAuth);
      }
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

const mapStateToProps = ({user}) => ({
  currentUser : user.currentUser
});

//Make dispatch of actions acessible via props
const mapDispatchToProps = dispatch => ({
  setCurrentUser : user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps , mapDispatchToProps) (App);
