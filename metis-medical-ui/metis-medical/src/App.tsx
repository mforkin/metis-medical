import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDoubleLeft, faAngleDoubleRight, faCalculator, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as Actions from './actions';
import Calculator from './calculator/Calculator';
import SpecialtyEditor from './editors/SpecialtyEditor';
import VignetteEditor from './editors/VignetteEditor';
import Header from './header/Header';
import UserResults from './results/UserResults';
import Sidebar from './sidebar/Sidebar';
import Survey from './survey/Survey';

import './App.css';

// import logo from './logo.svg';
const Home = () => (
    <div>
        <Survey />
    </div>
);
class App extends React.Component {


    constructor (props, context) {
        super(props, context);

        library.add(faNotesMedical);
        library.add(faCalculator);
        library.add(faAngleDoubleLeft);
        library.add(faAngleDoubleRight);

        props.dispatch(Actions.loadSpecialties());

        this.toggleCalculatorMode = this.toggleCalculatorMode.bind(this);

        this.state = {
            calculatorMode: false
        }
    }

    public toggleCalculatorMode () {
        this.setState({
            ...this.state,
            calculatorMode: !_.get(this.state, 'calculatorMode')
        })
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
                        <div className="content">
                            <Col xsHidden={true} md={2} lg={2}>
                                <Sidebar />
                            </Col>
                            <Col xs={12} md={_.get(this.state,'calculatorMode') ? 8 : 10} lg={_.get(this.state,'calculatorMode') ? 8 : 10}>
                                <div className="content">
                                    <div>
                                      <Route exact={true} path="/" component={Home} />
                                      <Route path="/edit" component={VignetteEditor} />
                                      <Route path="/editSpecialties" component={SpecialtyEditor} />
                                      <Route path="/results" component={UserResults} />
                                    </div>
                                    <div className="calculator-button">
                                        <Button bsStyle="primary" onClick={this.toggleCalculatorMode}>
                                            <FontAwesomeIcon icon={_.get(this.state, 'calculatorMode') ? 'angle-double-right' : 'angle-double-left'} />
                                            <FontAwesomeIcon icon="calculator" />
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                            <Col lgHidden={!_.get(this.state,'calculatorMode')} mdHidden={!_.get(this.state,'calculatorMode')} md={2} lg={2}>
                                <Calculator />
                            </Col>
                        </div>
                    </Router>
                </Row>
            </Grid>
        );
    }
}

export default connect()(App);
