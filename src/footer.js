import './css/footer.css'

function footer () {
    return(
    <footer className="footer">
        <div className="term">
        <div className="term__c" id="navigation-term">
            <div className="term__block term__block--starting">
            <p>Startup</p>
            </div>
        <div className="term__block"><i></i><p>START BOOTING SYSTEM...</p></div><div className="term__block--loader term__block"><i></i></div><div className="term__block"><i></i><p>RUNNING SKYSOFT TOMA PEGAZ 0?67.9712.?095</p><p>New session</p><p>Welcome User 9595</p></div></div>
        </div>

        {/* <div className="time">
        <div className="time__c" id="navigation-time">
            <div className="time__block">
            </div>
        <div className="time__block"><i></i><p>// 14:36</p><p>// août,31st</p><p>// SESSION 46271</p></div></div>
        </div> */}
    </footer>);
}

export default footer;