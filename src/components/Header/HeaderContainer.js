import React from "react";
import Header from "./Header";
import {connect} from "react-redux";
import {compose} from "redux";
import {getCurrenciesDataTC} from "../../redux/exchanges-reducer";


class HeaderContainer extends React.Component {
    componentDidMount() {
        //call thunkCreator
        this.props.getCurrenciesData()
    }
    render() {
        return <Header
            updateTime={this.props.updateTime}
            getCurrenciesData={this.props.getCurrenciesData}
        />
    }
}

let mapStateToProps = (state) => ({
    updateTime:state.exchangesPage.updateTime
 })

export default compose(
    connect(mapStateToProps,
        {getCurrenciesData: getCurrenciesDataTC}))(HeaderContainer)