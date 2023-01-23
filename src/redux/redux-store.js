import {applyMiddleware, combineReducers, createStore} from "redux";
import exchangesReducer from "./exchanges-reducer"
import thunkMiddleware from "redux-thunk"
import {reducer as formReducer} from 'redux-form';

let reducers = combineReducers({
    exchangesPage: exchangesReducer,
    form: formReducer
})

let store = createStore(reducers, applyMiddleware(thunkMiddleware))

window.store = store

export default store