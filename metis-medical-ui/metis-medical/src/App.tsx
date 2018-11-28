import * as _ from 'lodash';
import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import SpecialtyEditor from './editors/SpecialtyEditor';
import VignetteEditor from './editors/VignetteEditor';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

import './App.css';

// import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
        <Grid className="app">
            <Row className="header">
                <Col xs={12} md={12}>
                    <Header />
                </Col>
            </Row>
            <Row>
                <Router>
                    <div>
                        <Col xsHidden md={2}>
                            <Sidebar />
                        </Col>
                        <Col xs={12} md={10}>
                            <div className="content">
                                <div>
                                  <Route exact={true} path="/" component={Home} />
                                  <Route path="/edit" component={VignetteEditor} />
                                  <Route path="/editSpecialties" component={SpecialtyEditor} />
                                  <Route path="/topics" component={Topics} />
                                </div>
                            </div>
                        </Col>
                    </div>
                </Router>
            </Row>
        </Grid>
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
const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>;
const Topics = ({ match }) => (
  <div>
    <h2>Specialties</h2>
    <ul>
        {
        _.map(specialties, (v, k) => (
            <li key={k}>
                <Link to={`${match.url}/${k}`}>{v}</Link>
            </li>
        ))
        }
    </ul>

    <Route path={`${match.path}/:id`} component={Topic} />
    <Route
      exact={true}
      path={match.path}
      render={test}
    />
  </div>
);

const test = () => <h3>Please select a topic.</h3>

export default App;
