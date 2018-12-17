import React, { Component } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/action';



const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };


    componentDidMount = ()=>{
        console.log("[BurgerBuilder] componentDidMount");
/*        let response = await axios.get("/ingredients.json");
        try{
          this.setState({ingredients: response.data});
        }
        catch(error){
          this.setState({error:true});
        }*/

    };


    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }

    addIngredientHandler = ( type ) => {
        const oldCount = this.props.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.props.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = ( type ) => {
        const oldCount = this.props.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.props.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    };

    purchaseHandler = () => {
        console.log("Purchase handler");
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        console.log("Closing modal");
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = async () => {
        console.log("Continue purchase");
        const queryParams = [];
        for(let i in this.props.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    };


    render () {
        const disabledInfo = {
            ...this.props.ingredients
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        console.log("Ingredients: ", this.props.ingredients);
        console.log("props ", this.props);
        let burger = this.state.error ? <p style={{textAlign: 'center'}}>Ingredients can't be loaded!</p> : <Spinner/>;
        if(this.props.ingredients){
            burger = (
                <>
                    <Burger ingredients={this.props.ingredients} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />
                </>
            );
            orderSummary =
                <OrderSummary
                    ingredients={this.props.ingredients}
                    cancel={this.purchaseCancelHandler}
                    continue={this.purchaseContinueHandler}
                    totalPrice={this.state.totalPrice}
                />;
        }
        if(this.state.loading){
            orderSummary = <Spinner/>
        }


        return (
            <>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                    {burger}
            </>
        );
    }
}


const mapDispatchToProps = state =>{
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice
    };
};


const mapStateToProps = dispatch => {
    return{
      onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
      onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));