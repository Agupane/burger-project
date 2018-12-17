import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from "../../../axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component{

    state ={
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZipCode'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}],
                    placeholder: 'Country'
                },
                value: ''
            }
        },
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
        updatedForm[inputId] = updatedFormElement;
        this.setState({orderForm: updatedForm});
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
                            changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        />
                ))}
                <Button btnType="Success">ORDER</Button>
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

export default ContactData;