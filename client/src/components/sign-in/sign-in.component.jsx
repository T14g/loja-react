import React, { useState} from 'react';
import { connect } from 'react-redux';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

import { googleSignInStart, emailSignInStart } from '../../redux/user/user.actions';

import './sign-in.styles.scss';

const  SignIn = ({emailSignInStart, googleSignInStart}) => {
    
    const [ userCredentials, setCredentials ] = useState({email: '', password: ''});

    const { email, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();
        emailSignInStart(email,password);
    }

    // Reusable by both inputs very good 
    const handleChange = event => {
        const { value, name } = event.target;
        setCredentials({...userCredentials, [name] : value});
    }

    return(
        <div className="sign-in">
            <h2>I already have an account</h2>
            <span>Sign in with your email and password</span>

            <form onSubmit={handleSubmit} >
                <FormInput label="email" type="email" handleChange={handleChange} name="email" value={email} required />
                <FormInput label="password" type="password" handleChange={handleChange} name="password" value={password} required />
                
                <div className="buttons">
                    <CustomButton type="submit">Sign In</CustomButton>
                    <CustomButton type="button" onClick={googleSignInStart} isGoogleSignIn>Sign In with Google</CustomButton>
                </div>
            </form>
        </div>
    )
    
}  

const mapDispatchToProps = dispatch => ( {
    googleSignInStart: () => dispatch(googleSignInStart()),
    emailSignInStart: (email,password) => dispatch(emailSignInStart({email, password}))
});

export default connect(null ,mapDispatchToProps)(SignIn);