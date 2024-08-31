import './css/header.css'
import logo from './logo.png'

function header() {
    return(
        <header class="header shrink-off">
            <a class="header__logo" href="https://neosibde.github.io/menu/">
                <img src={logo} alt=""/>
            </a>
        </header>
    );
};

export default header;