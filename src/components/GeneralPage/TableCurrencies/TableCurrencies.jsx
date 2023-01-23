import React from "react";
import s from "./TableCurrencies.module.scss"


const TableCurrencies = (props) => {

    //hide option with currencies from selector, that are already showed
    let hideOptions = (id) => {
        let curId = props.rowsData.find(row => row.currencyId === id)
        if (curId !== undefined) return true
    }

    //adding one more row by id from option
    let onAddRow = (event) => {
        let currencyId = Number(event.target.value)
        props.addRowAC(currencyId)
        props.activateEditMode()
    }

    // sort Ascending function
    let sortRows = (field) => {
        let isTouched = props.sortMode[field]
        props.sortRowsAC(field, isTouched)
        props.activateSortMode(field)
    }

    // finding text by the table
    let findText = (e) => {
        let searchText = (e.target.value)
        props.findByTableAC(searchText)
    }

    //style sortButton according to sortMode
    let sortButtonStyle = (field) => (!props.sortMode[field]) ? s.arrowButton : s.arrowButtonRotated


    //rowsElements for table BEFORE SORT
    let rowsElements = props.rowsData.map(row => {
                return <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.currencyCode}</td>
                    <td>{row.currencyName}</td>
                    <td>{row.ratioToRUB}</td>
                    <td>{row.ratioToUSD}</td>
                    <td>{row.ratioToEUR}</td>
                    <td>{row.ratioToCNY}</td>
                </tr>
        }
    )

    //options elements for selector
    let optionElements = props.currenciesData.map(currencies => {
        return <option
            className={s.optionsForTable}
            disabled={hideOptions(currencies.id)}
            value={currencies.id}
            key={currencies.id}>{currencies.currencyName}</option>
    })

    return (
        <>
            <div className={s.contentWrapper}>
                <div className={s.contentBlockWrapper}>
                    <div className={s.tableBlock}>
                        <div className={s.findInputBlock}>
                            <input
                                onChange={findText}
                            />
                            <div className={s.findIcon}></div>
                            <div>Поиск по валюте</div>
                        </div>
                        <div className={s.tableWrapper}>
                            <table>
                                {/*Header of table*/}
                                <thead>
                                <tr>
                                    <th><span onClick={() => sortRows("id")}
                                              className={sortButtonStyle("id")}
                                              title={"Сортировать"}></span>#
                                    </th>
                                    <th><span onClick={() => sortRows("currencyCode")}
                                              className={sortButtonStyle("currencyCode")}
                                              title={"Сортировать"}></span>*Код
                                        ISO
                                    </th>
                                    <th><span onClick={() => sortRows("currencyName")}
                                              className={sortButtonStyle("currencyName")}
                                              title={"Сортировать"}></span>Название
                                        валюты
                                    </th>
                                    <th><span onClick={() => sortRows("ratioToRUB")}
                                              className={sortButtonStyle("ratioToRUB")}
                                              title={"Сортировать"}></span>к
                                        Рублю
                                    </th>
                                    <th><span onClick={() => sortRows("ratioToUSD")}
                                              className={sortButtonStyle("ratioToUSD")}
                                              title={"Сортировать"}></span>к
                                        Доллару
                                    </th>
                                    <th><span onClick={() => sortRows("ratioToEUR")}
                                              className={sortButtonStyle("ratioToEUR")}
                                              title={"Сортировать"}></span>к
                                        Евро
                                    </th>
                                    <th><span onClick={() => sortRows("ratioToCNY")}
                                              className={sortButtonStyle("ratioToCNY")}
                                              title={"Сортировать"}></span>к Юаню
                                    </th>
                                </tr>
                                </thead>

                                {/*Rows of table*/}
                                <tbody>
                                {rowsElements}
                                </tbody>
                            </table>
                        </div>

                        {/*Add and delete block construction button+selector*/}
                        <div className={s.changeAmountRowTable}>
                            <button className={s.buttonAddRow}
                                    onClick={props.activateEditMode}
                                    disabled={props.editMode}
                                    hidden={props.rowsData.length >=
                                        props.currenciesData.length}>Добавить валюту
                            </button>
                            <div>
                                {props.editMode &&
                                    <div className={s.selectWrapper}>
                                        <select
                                            onChange={(event) => onAddRow(event)}>
                                            <option value={""} hidden={true}>
                                                Нажмите, чтобы выбрать валюту</option>
                                            {optionElements}
                                        </select>
                                    </div>
                                }
                            </div>
                            {/*Delete button*/}
                            <button
                                className={s.buttonDeleteRow}
                                onClick={props.deleteRowAC}
                                hidden={props.rowsData.length === 0}>Удалить валюту
                            </button>


                        </div>

                        {/*Banner notifying about watches absence*/}
                        <div className={s.notifyBannerBlock}>
                            <div className={s.notifyBanner} hidden={props.rowsData.length !== 0}>
                                Таблица пуста :( <br/>
                                Нажмите кнопку "Добавить валюту"
                            </div>
                        </div>

                        {/*Banner notifying about watches amount limit*/}
                        <div className={s.notifyBannerBlock}>
                            <div className={s.notifyBanner}
                                 hidden={props.rowsData.length < props.currenciesData.length}>
                                Заполнено максимальное количество строк
                            </div>
                        </div>
                    </div>
                    {/*<span>* Код валюты указан в соответствии со стандартом
            Международной организации по стандартизации (ISO 4217)</span>*/}
                </div>
            </div>
        </>
    )
}

export default TableCurrencies