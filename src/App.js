import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import HomePage from './pages/homepage/hoempage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils'; 



class  App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    }
  }

  unsuscribreFromAuth = null;

  componentDidMount() {

    //will return a function that's when called closes the subscription
    this.unsuscribreFromAuth = auth.onAuthStateChanged( async userAuth => {
      // this.setState({ currentUser: user});

      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot =>{
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          })
        })
      }else{
        this.setState({ currentUser: userAuth});
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
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route  path='/shop' component={ShopPage} />
          <Route  path='/signin' component={SignInAndSignUpPage} />
        </Switch>
      </div>
    );
  }

}

export default App;
