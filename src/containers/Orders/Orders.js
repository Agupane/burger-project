import React,{Component} from 'react';
import Order from '../../components/Order/Order';
import classes from './Orders.module.css';
import axios from '../../axios-orders';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component{

    state = {
        orders: [],
        loading: true
    };

    componentDidMount = async() => {
        let response;
        try{
            response = await axios.get('/orders.json');
            let fetchedOrders = [];
            for(let key in response.data){
                fetchedOrders.push({
                    id: key,
                    ...response.data[key]
                });
            }
            this.setState({loading:false, orders: fetchedOrders});
        }
        catch(error){
            this.setState({loading:false})
        }

    };

    render(){
        return(
            <div className={classes.Orders}>
                {this.state.orders.map(order =>{
                    return <Order
                        key={order.id}
                        ingredients={order.ingredients}
                        price={order.price}
                    />
                })}
            </div>
        );
    }
}

export default withErrorHandler(Orders,axios);