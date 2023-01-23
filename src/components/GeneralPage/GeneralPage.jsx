import React from "react";
import TableCurrenciesContainer from "./TableCurrencies/TableCurrenciesContainer";
import ConverterBlockContainer from "./ConverterBlock/ConverterBlockContainer";

const GeneralPage = (props) => {
    return <>
        <TableCurrenciesContainer/>
        <ConverterBlockContainer/>
    </>
}

export default GeneralPage