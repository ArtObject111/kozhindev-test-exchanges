//DAL (Data Acces Layer) -- this is layer to interact with API. Уровень доступа к данным для
// взаимодействия с API

import axios from "axios";

//instance block
const instance = axios.create({
    baseURL: `https://www.cbr-xml-daily.ru/daily_json.js`, //base URL
});

export const currenciesApi = { //subsidiary object, containing methods for working with ajax
    getCurrencies () {// insert method in usersAPI object
        return instance.get().then(responce => {
                return responce.data.Valute
            })
    }
}