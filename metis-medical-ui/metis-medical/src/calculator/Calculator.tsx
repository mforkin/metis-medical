import * as _ from 'lodash';
import * as React from 'react';
import { Badge, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import './calculator.css'

class Calculator extends React.Component {
    constructor (props, context) {
        super(props, context)

        this.handleValueChange = this.handleValueChange.bind(this);
        this.wrapValueChange = this.wrapValueChange.bind(this);
        this.calcTotal = this.calcTotal.bind(this);
        this.calcPiece = this.calcPiece.bind(this);
        this.clear = this.clear.bind(this);

        this.state = {
            currentEntries: {},
            ratios: {
                d1: 0.015,
                d2: 0.5,
                d3: 0.35
            }
        }
    }

    public clear () {
        this.setState({
            ...this.state,
            currentEntries: {}
        });
    }

    public handleValueChange(key, value) {
        const obj = {};
        _.set(obj, key, value);
        this.setState({
            ...this.state,
            currentEntries: Object.assign({}, _.get(this.state, 'currentEntries'), obj)
        });
    }

    public wrapValueChange (key) {
        return (e) => this.handleValueChange(
            key,
            parseFloat(e.target.value)
        );
    }

    public calcPiece (k) {
        return (_.get(this.state, 'ratios')[k] * _.get(this.state, 'currentEntries')[k] || 0).toFixed(5);
    }

    public calcTotal () {
        return _.reduce(
            _.get(this.state, 'currentEntries'),
            (s, v, k) => {
                return s + _.get(this.state, 'ratios')[k] * v;
            },
            0
        ).toFixed(5)
    }

    public render () {
        return (
            <div className='calculator'>
                <div className='header'>
                    Morphine Equivalence Calculator
                </div>
                <FormGroup
                    controlId="calcForm">
                    {
                        _.map(_.get(this.state, 'ratios'), (v, k) => {
                            return (
                                <div>
                                    <ControlLabel>{k}</ControlLabel>
                                    <FormControl
                                        type="number"
                                        onChange={this.wrapValueChange(k)}
                                        value={_.get(this.state, 'currentEntries.' + k) || ''}
                                    />
                                    <div className='badge-holder'>
                                        <Badge>{this.calcPiece(k)}</Badge>
                                    </div>
                                </div>
                            )
                        })
                    }
                </FormGroup>
                <div className='footer'>
                    <div className="badge-holder">
                        <Badge> Total: {this.calcTotal()} </Badge>
                    </div>
                    <div className='clear-holder'>
                        <Button bsStyle="danger" onClick={this.clear}>Clear</Button>
                    </div>
                </div>
            </div>
        )
    }

}


export default connect()(Calculator);