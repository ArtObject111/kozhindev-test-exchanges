import './App.css';
import HeaderContainer from "./components/Header/HeaderContainer";
import GeneralPageContainer from "./components/GeneralPage/GeneralPageContainer";

const App = () => {
    return (
        <div className="app-wrapper">
            <div className='light x1'></div>
            <div className='light x2'></div>
            <div className='light x3'></div>
            <div className='light x4'></div>
            <div className='light x5'></div>
            <div className='light x6'></div>
            <div className='light x7'></div>
            <div className='light x8'></div>
            <div className='light x9'></div>
            <div className="app-wrapper-content">
                <HeaderContainer/>
                <GeneralPageContainer/>
            </div>
        </div>
    );
}

export default App;
