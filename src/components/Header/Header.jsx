import React from "react";
import s from "./Header.module.scss";
import logo from "../../assets/images/logo2.png"

const Header = (props) => {
    let hh = props.updateTime.hours
    let mm = props.updateTime.minutes
    let ss = props.updateTime.seconds
    let setFormat = (digit) => {
        return digit < 10 ? `0` + digit : digit
    }
    return (
        <div className={s.headerWrapper}>
            <header className={s.header}>
                <img src={logo}/>
                <div className={s.textLogoWrapper}>
                    <div className={s.textLogo}>Конвертер валют</div>
                </div>
                <div className={s.loginBlock}>
                    <div className={s.updateDataButton} onClick={props.getCurrenciesData}
                         title={"Обновить базу валют"}></div>
                    {/*<label>Последнее обновление курсов:</label>*/}
                    <div className={s.digitTimeWrapper}>
                        <div className={s.digitTime}>{setFormat(hh)}</div>
                        :
                        <div className={s.digitTime}>{setFormat(mm)}</div>:
                        <div className={s.digitTime}>{setFormat(ss)}</div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;