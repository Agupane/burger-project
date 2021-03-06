import React from 'react';
import BuildControl from './BuildControl/BuildControl';
import classes from './BuildControls.module.css';

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Meat', type: 'meat'}
];
const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: {props.price.toFixed(2)}</p>
        {
            controls.map(individualBtn => (
                    <BuildControl
                        key={individualBtn.label}
                        label={individualBtn.label}
                        type={individualBtn.type}
                        added={ () => props.ingredientAdded(individualBtn.type)}
                        removed={ () => props.ingredientRemoved(individualBtn.type)}
                        disabled={props.disabled[individualBtn.type]}/>
                )
            )
        }
        <button
            className={classes.OrderButton}
            disabled={!props.purchasable}
             onClick={props.ordered}>ORDER NOW</button>
    </div>
);
export default buildControls;