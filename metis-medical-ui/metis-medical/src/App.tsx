import * as _ from 'lodash';
import * as React from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as Actions from './actions';
import SpecialtyEditor from './editors/SpecialtyEditor';
import VignetteEditor from './editors/VignetteEditor';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import Survey from './survey/Survey';

import './App.css';

// import logo from './logo.svg';
const Home = () => (
    <div>
        <h2>Home</h2>
        <Survey />
    </div>
);
class App extends React.Component {

  constructor (props, context) {
    super(props, context);
    props.dispatch(Actions.loadSpecialties());
  }

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

export default connect()(App);
