import React from "react";
import TableCurrencies from "./TableCurrencies";
import {compose} from "redux";
import {connect} from "react-redux";
import {
    addRowAC,
    deleteRowAC, findByTableAC,
    setRowsDefaultAC,
    sortRowsAC
} from "../../../redux/exchanges-reducer";

class TableCurrenciesContainer extends React.Component {

    componentDidMount() {
        if ((this.props.currenciesData) && this.props.rowsData.length === 0)
            this.props.setRowsDefaultAC(this.props.defaultRowsAmount)
    }

    //local state for displaying currencies list below table
    state = {
        editMode: false,
        sortMode: {
            id: false,
            currencyCode: false,
            currencyName: false,
            ratioToRUB: false,
            ratioToUSD: false,
            ratioToEUR: false,
            ratioToCNY: false
        }
    }

    activateEditMode = () => {
        !this.state.editMode &&
        this.setState({
            editMode: true
        })

        this.state.editMode && (
            this.setState({
                editMode: false
            })
        )
    }

    activateSortMode = (field) => {
        !this.state.sortMode[field] &&
        this.setState({
            ...this.state,
            sortMode: {...this.state.sortMode, [field]: true}
        })

        this.state.sortMode[field] && (
            this.setState({
                ...this.state,
                sortMode: {...this.state.sortMode, [field]: false}
            })
        )
    }

    render() {
        return (
            <>
                <TableCurrencies
                    currenciesData={this.props.currenciesData}
                    rowsData={this.props.rowsData}
                    valueOfUSD={this.props.valueOfUSD}
                    valueOfEUR={this.props.valueOfEUR}
                    valueOfCNY={this.props.valueOfCNY}
                    editMode={this.state.editMode}
                    sortMode={this.state.sortMode}
                    addRowAC={this.props.addRowAC}
                    deleteRowAC={this.props.deleteRowAC}
                    sortRowsAC={this.props.sortRowsAC}
                    findByTableAC={this.props.findByTableAC}
                    activateEditMode={this.activateEditMode}
                    activateSortMode={this.activateSortMode}
                />
            </>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        currenciesData: state.exchangesPage.currenciesData,
        valueOfUSD: state.exchangesPage.valueOfUSD,
        valueOfEUR: state.exchangesPage.valueOfEUR,
        valueOfCNY: state.exchangesPage.valueOfCNY,
        rowsData: state.exchangesPage.rowsData,
        defaultRowsAmount: state.exchangesPage.defaultRowsAmount
    }
}

export default compose(
    connect(mapStateToProps,
        {addRowAC, deleteRowAC,
            setRowsDefaultAC, sortRowsAC, findByTableAC})(TableCurrenciesContainer))