import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from "../../../axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';

class ContactData extends Component{

    state ={
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZipCode'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}],
                    placeholder: 'Country'
                },
                value: 'fastest',
                valid: true,
                validation: {}
            }
        },
        formIsValid: false,
        loading: false
    };

    orderHandler = async (event)=>{
        /** Avoid page reload **/
        event.preventDefault();
        console.log("Ingredients: ", this.props.ingredients);
        this.setState({loading:true});
        let formData = {};
        for(let formElement in this.state.orderForm){
            formData[formElement] = this.state.orderForm[formElement].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        };
        try{
            let response = await axios.post("/orders.json", order);
            this.setState({loading:false});
            this.props.history.push('/');
        }
        catch(error){
            this.setState({loading:false});
        }
    };

    checkValidity = (value, rules) =>{
        let isValid = true;

        if(!rules){
            return true;
        }

        console.log("checking validity with rules ", rules);
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    };

    inputChangedHandler = (event, inputId) =>{
        console.log("Changed" , event.target.value);
        const updatedForm = {
            ...this.state.orderForm
        };
        /** Deeply clone **/
        const updatedFormElement = {
          ...updatedForm[inputId]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedForm[inputId] = updatedFormElement;


        let formIsValid = true;
        for(let inputId in updatedForm){
            formIsValid = updatedForm[inputId].valid && formIsValid;
        }
        this.setState({orderForm: updatedForm, formIsValid: formIsValid});
    };

    render(){
        console.log("Rendering contact data");

        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
               id: key,
               config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {
                    formElementsArray.map(formElement => (
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if(this.state.loading){
            form = <Spinner/>;
        }

        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}


const mapStateToProps = state =>{
    return {
        ingredients: state.ingredients,
        price: state.totalPrice
    };
};

export default connect(mapStateToProps)(ContactData);