import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from "../../../axios-orders";
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component{

    state ={
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = async (event)=>{
        event.preventDefault();
        console.log("Ingredients: ", this.props.ingredients);
        this.setState({loading:true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Agustin Pane',
                address: {
                    street: 'Test 2',
                    zipCode: '3000',
                    country: 'Argentina'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
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


    render(){
        console.log("Rendering contact data");

        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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