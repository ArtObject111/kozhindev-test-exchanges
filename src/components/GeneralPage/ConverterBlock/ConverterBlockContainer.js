import React from "react";
import ConverterBlock from "./ConverterBlock";
import {compose} from "redux";
import {connect} from "react-redux";
import {
    calculateCurrencyValueAC, changeComparedCurrencyItemAC, saveInputInLocalStorageAC,
    setDefaultValuesAC
} from "../../../redux/exchanges-reducer";

class ConverterBlockContainer extends React.Component {
    // skip the first initialization, if local storage contains input values
    componentDidMount() {
        if(!this.props.isLocalStorageFull) {
            this.props.setDefaultValuesAC(this.props.firstComparedId, this.props.secondComparedId)
        }
    }

    render() {
        return <>
            <ConverterBlock
                currenciesData={this.props.currenciesData}
                firstComparedId={this.props.firstComparedId}
                secondComparedId={this.props.secondComparedId}
                firstComparedValue={this.props.firstComparedValue}
                secondComparedValue={this.props.secondComparedValue}
                firstResultInput={this.props.firstResultInput}
                secondResultInput={this.props.secondResultInput}
                firstInputLocalStorage={this.props.firstInputLocalStorage}
                secondInputLocalStorage={this.props.secondInputLocalStorage}
                changeComparedCurrencyItemAC={this.props.changeComparedCurrencyItemAC}
                calculateCurrencyValueAC={this.props.calculateCurrencyValueAC}
                saveInputInLocalStorageAC={this.props.saveInputInLocalStorageAC}
            />
        </>
    }
}

let mapStateToProps = (state) => {
    return {
        currenciesData: state.exchangesPage.currenciesData,
        firstComparedId: state.exchangesPage.formCurrentState.firstComparedId,
        secondComparedId: state.exchangesPage.formCurrentState.secondComparedId,
        firstComparedValue: state.exchangesPage.formCurrentState.firstComparedValue,
        secondComparedValue: state.exchangesPage.formCurrentState.secondComparedValue,
        firstResultInput: state.exchangesPage.formCurrentState.firstResultInput,
        secondResultInput: state.exchangesPage.formCurrentState.secondResultInput,
        firstInputLocalStorage: state.exchangesPage.formCurrentState.firstInputLocalStorage,
        secondInputLocalStorage: state.exchangesPage.formCurrentState.secondInputLocalStorage,
        isLocalStorageFull: state.exchangesPage.formCurrentState.isLocalStorageFull
    }
}

export default compose(
    connect(mapStateToProps,
        {setDefaultValuesAC,
            changeComparedCurrencyItemAC, calculateCurrencyValueAC,
            saveInputInLocalStorageAC})
(ConverterBlockContainer))
