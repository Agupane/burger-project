import React, {Component} from 'react';
import CheckoutSummary from '../../components/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';
import * as actionTypes from "../../store/action";

class Checkout extends Component{


    checkoutCancelledHandler = ()=>{
        this.props.history.goBack();
    };

    checkoutContinuedHandler = ()=>{
        this.props.history.replace(this.props.match.path+'/contract-data');
    };

    render(){
        return(
            <div>
                <CheckoutSummary
                    ingredients={this.props.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler} />
                <Route path={this.props.match.path+'/contract-data'} component={ContactData}/>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        ingredients: state.ingredients
    };
};



export default connect(mapStateToProps)(Checkout);