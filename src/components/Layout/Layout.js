import React, {Component} from 'react';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import classes from './Layout.module.css';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    };

    sideDrawerClosedHandler = () =>{
        console.log("Side drawer closed");
        this.setState({showSideDrawer: false});
    };

    sideDrawerToggleHandler = () =>{
        console.log("Side drawer toggled");
        this.setState((prevState) =>{
            return {showSideDrawer: !prevState.showSideDrawer}
        });
    };

    render(){
        return(
            <>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
                <SideDrawer
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}
                />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </>
        );
    }
}

export default Layout;