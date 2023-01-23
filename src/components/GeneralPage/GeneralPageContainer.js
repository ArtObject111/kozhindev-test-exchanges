import React from "react";
import GeneralPage from "./GeneralPage";
import {connect} from "react-redux";
import {compose} from "redux";
import s from "./GeneralPage.module.css";
import Preloader from "../common/Preloader/Preloader";

class GeneralPageContainer extends React.Component {

    render() {
        return (
            <>
                {!this.props.isFetching &&
                    <GeneralPage/>}
                <div className={s.preloaderBlock}>
                    {this.props.isFetching ? <Preloader/> : null}
                </div>
            </>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        isFetching: state.exchangesPage.isFetching
    }
}

export default compose(connect(mapStateToProps,
    {}))(GeneralPageContainer)