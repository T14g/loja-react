import React from 'react';

import { SpinnerOverlay, SpinnerContainer } from './with-spinner.styles';

//High order function, takes a component and return, check the props of this component
//a function that takes a component and put the spinner loading feature
const WithSpinner = WrappedComponent => ({isLoading, ...otherProps}) => {
    return isLoading ? (
        <SpinnerOverlay><SpinnerContainer /></SpinnerOverlay>
    ) : (
        <WrappedComponent {...otherProps} />
    )
}

export default WithSpinner;