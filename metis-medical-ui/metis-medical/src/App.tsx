import * as _ from 'lodash';
import * as React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import './App.css';

// import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
        <Router>
            <div>
              <Header />

              <Route exact={false} path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/topics" component={Topics} />
            </div>
        </Router>
    );
  }
}
let specialties = {};
fetch("/api/specialty", {
    headers: {
        "accepts": "application/json"
    }
})
    .then((resp) => resp.json())
    .then((data) => {
        specialties = data;
    })
console.log(specialties);
const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>;
const Topics = ({ match }) => (
  <div>
    <h2>Specialties</h2>
    <ul>
        {
        _.map(specialties, (v, k) => (
            <li>
                <Link to={`${match.url}/${k}`}>{v}</Link>
            </li>
        ))
        }
    </ul>

    <Route path={`${match.path}/:id`} component={Topic} />
    <Route
      exact={false}
      path={match.path}
      render={test}
    />
  </div>
);

const test = () => <h3>Please select a topic.</h3>

const Header = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/about">About</Link>
    </li>
    <li>
      <Link to="/topics">Topics</Link>
    </li>
  </ul>
);

export default App;
