import React from "react";
import s from "./ConverterBlock.module.scss"
import Select from "react-select";
import "../../common/styles/custom-select.scss"

const ConverterBlock = (props) => {

    //React-select state
    const options = []
    props.currenciesData.forEach(c => {
        options.push({
            value: c.id,
            label: c.currencyName
        })
    })

    //options of react-select
    const getFirstSelectValue = () => {
        if (props.currenciesData.length !== 0) {
            return props.firstComparedId ? options.find(c => c.value === props.firstComparedId) : ""
        }
    }

    const getSecondSelectValue = () => {
        if (props.currenciesData.length !== 0) {
            return props.secondComparedId ? options.find(c => c.value === props.secondComparedId) : ""
        }
    }

    //Mutation after onChange Input
    let onCalculateCurrencyValue = (event) => {
        let currentInputName = event.target.name //Name as identifier of Input
        let currentInputValue = String(event.target.value).replace(",", ".")
        //allowed only numeric values and one "." or ","
        if (currentInputValue.match(/^[0-9]*[.,]?[0-9]*$/)) {
            props.calculateCurrencyValueAC(currentInputName, currentInputValue)
        }
    }

    //Mutation after onChange Select
    let changeComparedCurrencyItem = (e, action) => {
        let currencyId = Number(e.value)
        let currentSelectName = action.name
        props.changeComparedCurrencyItemAC(currentSelectName, currencyId)
    }

    return (
        <div className={s.formBlockWrapper}>
            <form className={s.formBlock}>
                <div className={s.upperCurrencyField}>
                    <div className={s.inputWrapper}>
                        <input
                            autoComplete={"off"}
                            placeholder={"Значение валюты"}
                            name={"currencyValue1"}
                            value={props.firstResultInput}
                            onChange={onCalculateCurrencyValue}
                        />
                    </div>
                    <div>
                        <Select
                            classNamePrefix={"customSelect"}
                            name={"selectedCurrency1"}
                            options={options}
                            onChange={(e, action) => {
                                changeComparedCurrencyItem(e, action)
                            }}
                            value={getFirstSelectValue()}
                            //styles={customStyles}
                        />
                    </div>
                </div>
                <div className={s.lowerCurrencyField}>
                    <div className={s.inputWrapper}>
                        <input
                            autoComplete={"off"}
                            placeholder={"Значение валюты"}
                            name={"currencyValue2"}
                            value={props.secondResultInput}
                            onChange={onCalculateCurrencyValue}
                        />
                    </div>
                    <div>
                        <Select
                            classNamePrefix={"customSelect"}
                            name={"selectedCurrency2"}
                            options={options}
                            onChange={(e, action) => {
                                changeComparedCurrencyItem(e, action)
                            }}
                            value={getSecondSelectValue()}
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ConverterBlock