import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle as farCheckCircle, faCheckSquare as farCheckSquare, faCircle as farCircle, faSquare as farSquare, faTimesCircle as farTimesCircle} from '@fortawesome/free-regular-svg-icons';
import { faAngleDoubleLeft, faAngleDoubleRight, faCalculator, faCheckCircle, faCheckSquare, faChevronDown, faCircle, faNotesMedical, faSquare, faTimesCircle, faUserMd } from '@fortawesome/free-solid-svg-icons';
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

        const me = this;

        library.add(faNotesMedical);
        library.add(faCalculator);
        library.add(faAngleDoubleLeft);
        library.add(faAngleDoubleRight);
        library.add(faUserMd);
        library.add(faChevronDown);
        library.add(faCheckCircle);
        library.add(faTimesCircle);
        library.add(faSquare);
        library.add(faCircle);
        library.add(faCheckSquare);

        library.add(farCheckCircle);
        library.add(farTimesCircle);
        library.add(farSquare);
        library.add(farCircle);
        library.add(farCheckSquare);


        _.get(me.props, 'dispatch')(Actions.loadSpecialties())
            .then(() => {
                _.get(me.props, 'dispatch')(Actions.loadUserInfo())
                    .then(() => {
                        _.get(me.props, 'dispatch')(
                            Actions.loadAvailableVignettes(
                                _.get(me.props, 'content.specialtyId'),
                                undefined
                            )
                        )
                    });
            });

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
                                <div className="content main-pane">
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
                            <Col className="calc-cnt" lgHidden={!_.get(this.state,'calculatorMode')} mdHidden={!_.get(this.state,'calculatorMode')} md={2} lg={2}>
                                <Calculator />
                            </Col>
                        </div>
                    </Router>
                </Row>
                <Row className="footer">
                    <div>
                        <FontAwesomeIcon icon="notes-medical" />
                    </div>
                </Row>
            </Grid>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        content: _.get(state, 'content')
    };
}

export default connect(mapStateToProps)(App);
