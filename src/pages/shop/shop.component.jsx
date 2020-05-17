import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { updateCollections } from '../../redux/shop/shop.actions';

import WithSpinner from '../../components/with-spinner/with-spinner.component';


import CollectionsOverView from '../../components/collections-overview/collections-overview.component';
import CollectionPage from '../collection/collection.component';

import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';

const CollectionsOverViewWithSpinner = WithSpinner(CollectionsOverView);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends React.Component{
    
    state = {
        loading: true
    };

    unsuscribeFromSnapShot = null;

    componentDidMount() {
        const { updateCollections } = this.props;
        const collectionRef = firestore.collection('collections');

        //sempre que collectionRef update ou esse código rodar pela 1 vez
        //snapshot => docs = array com os queryDocuments
        collectionRef.onSnapshot(async snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            updateCollections(collectionsMap);

            //após load o conteúdo remover o loading
            this.setState({ loading: false});
        });
    }

    render() {
        const { match } = this.props;
        const { loading } = this.state;

        return(
            <div className='shop-page'>
                <Route exact path={`${match.path}`} render={(props) => <CollectionsOverViewWithSpinner isLoading = {loading} {...props}/>} />
                <Route path={`${match.path}/:collectionId`} render={(props) => <CollectionPageWithSpinner isLoading = {loading} {...props} />} />
            </div>
        )
    }
}
    
const mapDispatchToProps = dispatch => ({
    updateCollections: collectionsMap => dispatch(updateCollections(collectionsMap))
})

export default connect(null, mapDispatchToProps)(ShopPage);