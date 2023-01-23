import {currenciesApi} from "../api/api";

//action types
const SET_CURRENCIES_DATA = "SET-CURRENCIES-DATA"
const SET_ROWS_DEFAULT = "SET-ROWS-DEFAULT"
const ADD_ROW = "ADD-ROW"
const DELETE_ROW = "DELETE-ROW"
const SORT_ROWS = "SORT-ROWS-ASCENDING"
const FIND_BY_TABLE = "FIND-BY-TABLE"
const SET_UPDATE_TIME = "SET-UPDATE-TIME"
const TOGGLE_IS_FETCHING = "TOGGLE-IS-FETCHING";
const SET_DEFAULT_VALUES = "SET-DEFAULT-VALUES";
const CHANGE_COMPARED_CURRENCY_ITEM = "SET-COMPARED-CURRENCIES-VALUES";
const CALCULATE_CURRENCY_VALUE = "CALCULATE_CURRENCY_VALUE";
const SAVE_INPUT_IN_LOCAL_STORAGE = "SAVE-INPUT-IN-LOCAL-STORAGE";

//constants in a logic for currenciesTable and getting RUB from API
const USD = "USD"
const EUR = "EUR"
const CNY = "CNY"
const RUB = "RUB"

//state
let initialState = {
    currenciesData: [],  //all currencies from api storage
    valueOfUSD: null,
    valueOfEUR: null,
    valueOfCNY: null,
    defaultRowsAmount: 10, //set default rows amount in table
    rowsData: [],          //rows storage
    rowsStateCopy: [],     //temp rows state for searching by table
    isFetching: true,      //for preloader
    updateTime: {          //current time
        hours: 0,
        minutes: 0,
        seconds: 0
    },
    formCurrentState: {     //current state of converter
        firstComparedId: JSON.parse(localStorage.getItem("firstSelect")) || 14,
        secondComparedId: JSON.parse(localStorage.getItem("secondSelect")) || 15,
        firstComparedValue: JSON.parse(localStorage.getItem("firstRateValue")) || 1,
        secondComparedValue: JSON.parse(localStorage.getItem("secondRateValue")) || 1,
        firstResultInput: JSON.parse(localStorage.getItem("firstInput")) || 1,
        secondResultInput: JSON.parse(localStorage.getItem("secondInput")) || 1,

        isLocalStorageFull: JSON.parse(localStorage.getItem("isLocalStorageFull")) || false
    }
}

//reducer
const exchangesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENCIES_DATA:
            //setting object from API element in empty array
            let currenciesData = []
            let Id = 1
            let arrCurrencies = [...action.currencies]
            arrCurrencies.forEach(c => {
                currenciesData.push({
                    id: Id++,
                    currencyCode: c[1].NumCode,
                    currencyCharCode: c[1].CharCode,
                    currencyName: (c[1].Name),
                    currencyValue: nominalToOneValue(c[1].Value, c[1].Nominal)
                })
            })
            //set RUB in a case its absence in API, because today there's not "RUB"
            if (!currenciesData.find(c => c.currencyCharCode === RUB))
                currenciesData.push({
                    id: Id++,
                    currencyCode: "810",
                    currencyCharCode: "RUB",
                    currencyName: "Российский рубль",
                    currencyValue: 1
                })
            return {
                ...state,
                currenciesData: currenciesData,
                valueOfUSD: currenciesData.find(currency => currency.currencyCharCode === USD).currencyValue,
                valueOfEUR: currenciesData.find(currency => currency.currencyCharCode === EUR).currencyValue,
                valueOfCNY: currenciesData.find(currency => currency.currencyCharCode === CNY).currencyValue
            }
        case SET_ROWS_DEFAULT:
            let array = []
            //let array = new Array(action.rowsCount)
            for (let i = 1; i <= action.rowsCount; i++) {
                array.push({
                    id: i,
                    currencyId: i,
                    currencyCode: state.currenciesData[i - 1].currencyCharCode + ` (` + state.currenciesData[i - 1].currencyCode + `)`,
                    currencyName: state.currenciesData[i - 1].currencyName,
                    ratioToRUB: Number(state.currenciesData[i - 1].currencyValue.toFixed(3)),
                    ratioToUSD: checkCurForLowValue(state.currenciesData[i - 1].currencyValue / state.valueOfUSD),
                    ratioToEUR: checkCurForLowValue(state.currenciesData[i - 1].currencyValue / state.valueOfEUR),
                    ratioToCNY: checkCurForLowValue(state.currenciesData[i - 1].currencyValue / state.valueOfCNY)
                })
            }
            return {
                ...state,
                rowsData: array
            }
        case ADD_ROW:
            const length = state.rowsData.length
            //если watchesData пустой, то последний id = 0, иначе id = наибольшего id эл-та массива
            // (объекта)
            const last_id = (length !== 0) && state.rowsData.reduce((a, b) => a.id > b.id ? a : b).id
            let newRow = {
                id: last_id + 1,
                currencyId: action.curId,
                currencyCode: state.currenciesData[action.curId - 1].currencyCharCode + ` (` + state.currenciesData[action.curId - 1].currencyCode + `)`,
                currencyName: state.currenciesData[action.curId - 1].currencyName,
                //currencyRate: Number(state.currenciesData[action.curId - 1].currencyValue.toFixed(3)),
                ratioToRUB: Number(state.currenciesData[action.curId - 1].currencyValue.toFixed(3)),
                ratioToUSD: checkCurForLowValue(state.currenciesData[action.curId - 1].currencyValue / state.valueOfUSD),
                ratioToEUR: checkCurForLowValue(state.currenciesData[action.curId - 1].currencyValue / state.valueOfEUR),
                ratioToCNY: checkCurForLowValue(state.currenciesData[action.curId - 1].currencyValue / state.valueOfCNY)

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
        case SORT_ROWS:
            let sortedArray = state.rowsData.slice(0)
            let byField = (field) => {
                if (action.isTouched) {
                    return (a, b) => a[field] > b[field] ? 1 : -1//ascending
                } else return (a, b) => a[field] < b[field] ? 1 : -1//descending
            }
            sortedArray.sort(byField(action.field))
            return {
                ...state,
                rowsData: sortedArray
            }
        case FIND_BY_TABLE:
            //copying only in the 1st time, while rowsData is full
            if (state.rowsStateCopy.length === 0)
                //let stateBeforeSortProcess = state.rowsData.length
                state.rowsStateCopy = state.rowsData.slice(0)
            let regex = new RegExp(`${action.searchText}`, "i")
            let foundRows = state.rowsStateCopy.filter(currency => (currency.currencyName.match(regex)) ||
                currency.currencyCode.match(regex))
            return {
                ...state,
                rowsStateCopy: (state.rowsStateCopy.length === foundRows.length) ? [] : state.rowsStateCopy,
                rowsData: foundRows
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
        case SET_DEFAULT_VALUES:
            let firstCurValue = state.currenciesData[action.firstId - 1].currencyValue
            localStorage.setItem("firstRateValue", JSON.stringify(firstCurValue))
            let secondCurValue = state.currenciesData[action.secondId - 1].currencyValue
            localStorage.setItem("secondRateValue", JSON.stringify(secondCurValue))
            let ratio = firstCurValue / secondCurValue
            let firstResultInput = state.formCurrentState.firstResultInput
            //if local storage empty, set default values else "false"
            localStorage.setItem("isLocalStorageFull", JSON.stringify(true))
            return {
                ...state,
                formCurrentState: {
                    ...state.formCurrentState,
                    firstComparedId: action.firstId,
                    secondComparedId: action.secondId,
                    firstComparedValue: firstCurValue,
                    secondComparedValue: secondCurValue,
                    //firstResultInput: checkCurForLowValue(firstCurValue / secondCurValue),
                    secondResultInput: checkCurForLowValue(ratio * firstResultInput)
                }
            }
        case CHANGE_COMPARED_CURRENCY_ITEM:
            let currentComparedValue = state.currenciesData[action.currencyId - 1].currencyValue
            if (action.currentSelectName === "selectedCurrency1") {
                let secondComparedValue = state.currenciesData[state.formCurrentState.secondComparedId - 1].currencyValue
                let k = currentComparedValue / secondComparedValue
                let result = checkCurForLowValue(k * state.formCurrentState.firstResultInput)
                localStorage.setItem("firstRateValue", JSON.stringify(currentComparedValue))
                localStorage.setItem("firstSelect", JSON.stringify(action.currencyId))
                localStorage.setItem("secondInput", JSON.stringify(result))
                return {
                    ...state,
                    formCurrentState: {
                        ...state.formCurrentState, firstComparedValue: currentComparedValue,
                        firstComparedId: action.currencyId,
                        secondResultInput: result
                    }
                }
            } else if (action.currentSelectName === "selectedCurrency2") {
                let firstComparedValue = state.currenciesData[state.formCurrentState.firstComparedId - 1].currencyValue
                let k = currentComparedValue / firstComparedValue
                let result = checkCurForLowValue(k * state.formCurrentState.secondResultInput)
                localStorage.setItem("secondRateValue", JSON.stringify(currentComparedValue))
                localStorage.setItem("secondSelect", JSON.stringify(action.currencyId))
                localStorage.setItem("firstInput", JSON.stringify(result))
                return {
                    ...state,
                    formCurrentState: {
                        ...state.formCurrentState, secondComparedValue: currentComparedValue,
                        secondComparedId: action.currencyId,
                        firstResultInput: result
                    }
                }
            }
            break
        case CALCULATE_CURRENCY_VALUE:
            let firstComparedValue = state.formCurrentState.firstComparedValue
            let secondComparedValue = state.formCurrentState.secondComparedValue
            let currentInput = action.currentInput
            let k
            let result
            if (action.currentInputName === "currencyValue1") {
                k = firstComparedValue / secondComparedValue
                result = checkCurForLowValue(k * currentInput)
                localStorage.setItem("firstInput", JSON.stringify(
                    (!Number(currentInput) || Number(currentInput) === 0) ? "0" : Number(currentInput)))
                localStorage.setItem("secondInput", JSON.stringify(!result ? "0" : result))
                return {
                    ...state,
                    formCurrentState: {
                        ...state.formCurrentState,
                        firstResultInput: (currentInput === ".") ? "0." : currentInput,
                        secondResultInput: result
                    }
                }
            } else if (action.currentInputName === "currencyValue2") {
                k = secondComparedValue / firstComparedValue
                result = checkCurForLowValue(k * currentInput)
                localStorage.setItem("secondInput", JSON.stringify(
                    (!Number(currentInput) || Number(currentInput) === 0) ? "0" : Number(currentInput)))
                localStorage.setItem("firstInput", JSON.stringify(!result ? "0" : result))
                return {
                    ...state,
                    formCurrentState: {
                        ...state.formCurrentState,
                        secondResultInput: (currentInput === ".") ? "0." : currentInput,
                        firstResultInput: result
                    }
                }
            }
            break
        case SAVE_INPUT_IN_LOCAL_STORAGE:
            localStorage.setItem("firstInput", state.formCurrentState.firstResultInput)
            localStorage.setItem("secondInput", state.formCurrentState.secondResultInput)
            return {
                ...state,
            }
        default:
            return state
    }
}

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

//function fixing a bug connected with displaying too low currency value (for example "UZS")
//increases Digits After Comma
let checkCurForLowValue = (value) => {
    return value < 0.001 ? Number(value.toFixed(5)) : Number(value.toFixed(3))
}

//actionCreators block
export const setCurrenciesDataAC = (currencies) => ({type: SET_CURRENCIES_DATA, currencies})
export const setRowsDefaultAC = (rowsCount) => ({type: SET_ROWS_DEFAULT, rowsCount})
export const addRowAC = (curId) => ({type: ADD_ROW, curId})
export const deleteRowAC = (curId) => ({type: DELETE_ROW, curId})
export const sortRowsAC = (field, isTouched) => ({type: SORT_ROWS, field, isTouched})
export const findByTableAC = (searchText) => ({type: FIND_BY_TABLE, searchText})
export const setUpdateTimeAC = () => ({type: SET_UPDATE_TIME})
export const toggleIsFetchingAC = (isFetching) => ({type: TOGGLE_IS_FETCHING, isFetching})
export const setDefaultValuesAC = (firstId, secondId) => ({type: SET_DEFAULT_VALUES, firstId, secondId})
export const changeComparedCurrencyItemAC = (currentSelectName, currencyId) => ({
    type: CHANGE_COMPARED_CURRENCY_ITEM,
    currentSelectName, currencyId
})
export const calculateCurrencyValueAC = (currentInputName, currentInput) => ({
    type: CALCULATE_CURRENCY_VALUE,
    currentInput, currentInputName
})
export const saveInputInLocalStorageAC = () => ({type: SAVE_INPUT_IN_LOCAL_STORAGE})

//thunkCreators block
export const getCurrenciesDataTC = (time) => {
    return (dispatch) => {
        dispatch(toggleIsFetchingAC(true))//preloader on
        currenciesApi.getCurrencies()
            .then(data => {
                //recording currencies to state in array format to include the 1st obj property
                dispatch(setCurrenciesDataAC(Object.entries(data)))
                dispatch(setUpdateTimeAC(time))
                dispatch(toggleIsFetchingAC(false))//preloader off
            })
    }
}

export default exchangesReducer