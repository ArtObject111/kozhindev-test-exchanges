import React, {createRef} from "react";
import s from "./ConverterBlock.module.scss"
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";

const ConversionBlockUnused = (props) => {
    let optionElements = props.currenciesData.map(currency =>
        <option key={currency.id} value={currency.currencyValue}>{currency.currencyName}</option>
    )

    let onCalculateCurrencyValue = (refSel1, refSel2, refInp2, event) => {
        debugger
        /*//console.log(Number(values.currentTarget.value))
        //console.log(event.target.name)
        let curValueName1 = refSel1.current.props.name
        console.log(curValueName1)
        let curValue1 = refSel1.current.ref.current.props.value
        console.log(curValue1)
        let curValueName2 = refSel2.current.props.name
        console.log(curValueName2)
        let curValue2 = refSel2.current.ref.current.props.value
        console.log(curValue2)
        //let curName = event.target.name
        //let curInputName = Number(event.target.value)
        let curInput2 = refInp2.current.props._reduxForm.values.currencyValue2
        console.log(curInput2)
       // props.calculateCurrencyValueAC(curValue1, curValue2, curName, curInput)*/

        /*let curValue1 = refSel1.current.ref.current.props.value
        console.log(curValue1)
        let curValue2 = refSel2.current.ref.current.props.value
        console.log(curValue2)*/
        let k
        let curName = event.target.name
        let curInput1 = event.target.value
        let curInput2
        let result
        switch (curName) {
            case "currencyValue1":
                curInput2 = refInp2.current.props._reduxForm.values.currencyValue2
                //k = curValue2/curValue1
                //result = k * curInput1
                //props.calculateCurrencyValueAC(curInput, curValue2)
                console.log("текущ" + curInput1 + "  меням низ" + curInput2)
                break
            case "currencyValue2":
                curInput2 = refInp2.current.props._reduxForm.values.currencyValue1
                //k = curValue1/curValue2
                //result = k * curInput1
                //props.calculateCurrencyValueAC()
                console.log("текущ" + curInput1 + "  меням верх" + curInput2)
                break
        }
    }

    let onSubmit = (formData) => {
        console.log(formData)
    }
    return <div className={s.formBlockWrapper}>
        <ConversionForm
            //onSubmit={onCalculateCurrencyValue}
            optionElements={optionElements}
            onCalculateCurrencyValue={onCalculateCurrencyValue}/>
        {/*<ConversionReduxForm abc={"123"}
            optionElements={optionElements} onSubmit={onSubmit}/>*/}
    </div>
}

let ConversionForm = (props) => {
    let currencyInput1 = React.createRef()
    let currencyInput2 = React.createRef()
    let currencyValue1 = React.createRef()
    let currencyValue2 = React.createRef()
    return (
        <form className={s.formBlock} onSubmit={props.handleSubmit}>
                <div className={s.firstCurrencyField}>
                    <div>
                        <Field placeholder={"Значение валюты"} name={"currencyValue1"} component={"input"}
                               ref={currencyInput1}
                               onChange={(event) => props.onCalculateCurrencyValue(currencyValue1, currencyValue2, currencyInput2, event)}
                        />
                    </div>
                    <div>
                        <Field name={"selectedCurrency1"} component={"select"}
                               ref={currencyValue1}
                        >
                            {props.optionElements}
                        </Field>
                    </div>
                </div>
                <div className={s.secondCurrencyField}>
                    <div>
                        <Field placeholder={"Значение валюты"} name={"currencyValue2"} component={"input"}
                               ref={currencyInput2}
                               onChange={(event) => props.onCalculateCurrencyValue(currencyValue1, currencyValue2, currencyInput1, event)}
                        />
                    </div>
                    <div>
                        <Field name={"selectedCurrency2"} component={"select"}
                               ref={currencyValue2}
                        >
                            {props.optionElements}
                        </Field>
                    </div>
                </div>
            <button>Send</button>

        </form>
    )
}

ConversionForm = reduxForm({
    form: 'conversionForm'
})(ConversionForm)

let mapStateToProps = (state) => {
    return {
        initialValues: {
            currencyValue1: state.exchangesPage.firstResultInput,
            currencyValue2: state.exchangesPage.secondResultInput
        },
        //enableReinitialize: true
    }
}

ConversionForm = connect(mapStateToProps,{
})(ConversionForm)

/*const ConversionReduxForm = reduxForm({
    form: 'conversionForm'
})(ConverterBlock)*/

//export default ConversionBlockUnused