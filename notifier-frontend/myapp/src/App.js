import './App.css';
import Home from './components/home'
import UnSubscribe from './components/unsubscribe'
import {BrowserRouter as Router, Route } from "react-router-dom";

import vaccineHeaderImg from './vac-header6.png';

function App() {
  return (
    <div className="App">
      <Router>
      <nav class="navbar navbar-expand-sm bg-dark navbar-dark justify-content-center">
        <a class="navbar-brand row" href="#"><h3>NotifyMe (CoWIN-Notifier)</h3></a>
      </nav>
      <Route path="/" exact component= {Home} />
      <Route path="/unsubscribe" exact component= {UnSubscribe} />
      <div className="mt-5 mb-5 container">
        <p><i>We treat all your personal data with care and only uses it for sending email notifications.</i><br/>
        <i>This site uses the CoWIN public API to fetch information about available slots.</i><br/>
        <i>(Trying my best to provide accurate informations, as this is not official intiative, the data might not be exact.
        Please keep checking your COWIN website and Aarogya Setu application.)</i></p>
        <p><b>If you have any suggestion or want to collaboarate in any initiative, please reach out to me at 
        <a href="mailto: rahulchugwani12@gmail.com"> rahulchugwani12@gmail.com</a></b><br/>
        </p>

      </div>
      </Router>
    </div>
  );
}

export default App;
