import * as _ from 'lodash';
import * as React from 'react';
import { Button, Col, Grid, Row } from 'react-bootstrap';
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
        <Survey />
    </div>
);
class App extends React.Component {


    constructor (props, context) {
        super(props, context);
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
                        <div>
                            <Col xsHidden={true} md={2} lg={2}>
                                <Sidebar />
                            </Col>
                            <Col xs={12} md={_.get(this.state,'calculatorMode') ? 8 : 10} lg={_.get(this.state,'calculatorMode') ? 8 : 10}>
                                <div className="content">
                                    <div>
                                      <Route exact={true} path="/" component={Home} />
                                      <Route path="/edit" component={VignetteEditor} />
                                      <Route path="/editSpecialties" component={SpecialtyEditor} />
                                    </div>
                                    <div className="calculator-button">
                                        <Button onClick={this.toggleCalculatorMode}>
                                            { _.get(this.state,'calculatorMode') ? 'Close Calculator' : 'Open Calculator' }
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                            <Col lgHidden={!_.get(this.state,'calculatorMode')} mdHidden={!_.get(this.state,'calculatorMode')} md={2} lg={2}>
                                <div>Hey</div>
                            </Col>
                        </div>
                    </Router>
                </Row>
            </Grid>
        );
    }
}

export default connect()(App);
