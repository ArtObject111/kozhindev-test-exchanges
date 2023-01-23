import {currenciesApi} from "../api/api";

//action types
const SET_CURRENCIES_DATA = "SET-CURRENCIES-DATA"
const ADD_ROW = "ADD-ROW"
const DELETE_ROW = "DELETE-ROW"
const SET_UPDATE_TIME = "SET-UPDATE-TIME"
const TOGGLE_IS_FETCHING = "TOGGLE-IS-FETCHING";
const SET_COMPARED_CURRENCIES_VALUES = "SET-COMPARED-CURRENCIES-VALUES";
const CALCULATE_CURRENCY_VALUE = "CALCULATE_CURRENCY_VALUE";

//state
let initialState = {
    currenciesData: [],
    valueOfUSD: null,
    valueOfEUR: null,
    valueOfCNY: null,
    rowsData: [
        {id: 1, currencyId: 1},
        {id: 2, currencyId: 2},
        {id: 3, currencyId: 3},
        {id: 4, currencyId: 4},
        {id: 5, currencyId: 5},
        {id: 6, currencyId: 6},
        {id: 7, currencyId: 7},
        {id: 8, currencyId: 8},
        {id: 9, currencyId: 9}
    ],
    isFetching: true,
    updateTime: {
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    compForm: {
        firstComparedId: 1,
        secondComparedId: 12,
        firstComparedValue: 1,
        secondComparedValue: 1,
        firstResultInput: 1,
        secondResultInput: 1
    }
}

//reducer
const exchangesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENCIES_DATA:
            //equate Nominal value to one
            //changing currency values according to nominal == 1 instead 10, 100 etc.
            let nominalToOneValue = (value, nominal) => {
                switch (nominal) {
                    case nominal = 10:
                        return value / 10
                    case nominal = 100:
                        return value / 100
                    case nominal = 1000:
                        return value / 1000
                    case nominal = 10000:
                        return value / 10000
                    default:
                        return value
                }
            }
            //setting object from API element in empty array
            let currenciesData = []
            let Id = 1
            let arrCurrencies = [...action.currencies]
            //set RUB, because of its absence in API
            currenciesData.push({
                id: Id++,
                currencyCode: "810",
                currencyCharCode: "RUB",
                currencyName: "Российский рубль",
                currencyValue: 1
            })
            arrCurrencies.forEach(c => {
                currenciesData.push({
                    id: Id++,
                    currencyCode: c[1].NumCode,
                    currencyCharCode: c[1].CharCode,
                    currencyName: (c[1].Name),
                    currencyValue: nominalToOneValue(c[1].Value, c[1].Nominal)
                })
            })
            currenciesData.push()
            return {
                ...state,
                currenciesData: currenciesData,
                valueOfUSD: currenciesData.find(currency => currency.currencyCharCode === "USD").currencyValue,
                valueOfEUR: currenciesData.find(currency => currency.currencyCharCode === "EUR").currencyValue,
                valueOfCNY: currenciesData.find(currency => currency.currencyCharCode === "CNY").currencyValue
            }
        case ADD_ROW:
            debugger
            const length = state.rowsData.length
            //если watchesData пустой, то последний id = 0, иначе id = id последнего эл-та массива
            const last_id = (length !== 0) && state.rowsData[length - 1].id
            let newRow = {
                id: last_id + 1,
                currencyId: action.curId
            }
            return {
                ...state,
                rowsData: [...state.rowsData, newRow]
            }
        case DELETE_ROW:
            let arrayRows = [...state.rowsData]
            arrayRows.pop()
            return {
                ...state,
                rowsData: arrayRows
            }
        case SET_UPDATE_TIME:
            let day = new Date();
            let hours = day.getHours()
            let minutes = day.getMinutes()
            let seconds = day.getSeconds()
            let time = {hours, minutes, seconds}
            return {
                ...state,
                updateTime: {...time},
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case SET_COMPARED_CURRENCIES_VALUES:
            let currentComparedValue = state.currenciesData[action.currencyId - 1].currencyValue
            if (action.currentSelectName === "selectedCurrency1") {
                let secondComparedValue = state.compForm.secondComparedValue
                let k = currentComparedValue/secondComparedValue
                debugger
                return {
                    ...state,
                    compForm: {
                        ...state.compForm, firstComparedValue: currentComparedValue,
                        firstComparedId: action.currencyId,
                        secondResultInput: (Number((k *state.compForm.firstResultInput).toFixed(3)))
                    }
                }
            } else if (action.currentSelectName === "selectedCurrency2") {
                let firstComparedValue = state.compForm.firstComparedValue
                let k = currentComparedValue/firstComparedValue
                debugger
                return {
                    ...state,
                    compForm: {
                        ...state.compForm, secondComparedValue: currentComparedValue,
                        secondComparedId: action.currencyId,
                        firstResultInput: (Number((k* state.compForm.secondResultInput).toFixed(3)))
                    }
                }
            } break
        case CALCULATE_CURRENCY_VALUE:
            debugger
            let result
            let firstComparedValue = state.compForm.firstComparedValue
            let secondComparedValue = state.compForm.secondComparedValue
            if (action.currentInputName === "currencyValue1") {
                debugger
                result = firstComparedValue / secondComparedValue * action.currentInput
                console.log(result)
                return {
                    ...state,
                    compForm: {
                        ...state.compForm,
                        firstResultInput: action.currentInput,
                        secondResultInput: result
                    }
                }
            } else if (action.currentInputName === "currencyValue2") {
                debugger
                result = secondComparedValue / firstComparedValue * action.currentInput
                console.log(result)
                return {
                    ...state,
                    compForm: {
                        ...state.compForm,
                        secondResultInput: action.currentInput,
                        firstResultInput: result
                    }
                }
            }
            break
        default:
            return state
    }
}

//actionCreators block
export const setCurrenciesDataAC = (currencies) => ({type: SET_CURRENCIES_DATA, currencies})
export const addRowAC = (curId) => ({type: ADD_ROW, curId})
export const deleteRowAC = (curId) => ({type: DELETE_ROW, curId})
export const setUpdateTimeAC = () => ({type: SET_UPDATE_TIME})
export const toggleIsFetchingAC = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})
export const setComparedCurrenciesValuesAC = (currentSelectName, currencyId) => ({
    type: SET_COMPARED_CURRENCIES_VALUES,
    currentSelectName, currencyId
})
export const calculateCurrencyValueAC = (currentInputName, currentInput) => ({
    type: CALCULATE_CURRENCY_VALUE,
    currentInput, currentInputName
})

//thunkCreators block
export const getCurrenciesDataTC = (time) => {
    return (dispatch) => {
        dispatch(toggleIsFetchingAC(true))//preloader on
        currenciesApi.getCurrencies()
            .then(data => {
                //recording currencies to state in array format to include the 1st obj property
                dispatch(setCurrenciesDataAC(Object.entries(data.Valute)))
                dispatch(setUpdateTimeAC(time))
                dispatch(toggleIsFetchingAC(false))//preloader off
            })
    }
}

//export default exchangesReducer