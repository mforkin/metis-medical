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
        this.getCurrentEntryValue = this.getCurrentEntryValue.bind(this);

        this.state = {
            currentEntries: {},
            ratios: {
                "Codeine - Oral (mg/day)": 0.15,
                "Fentanyl - Transdermal (in mcg/hr)": 2.4,
                "Hydrocodone - Oral (mg/day)": 1,
                "Hydromorphone - Oral (mg/day)": 4,
                "Methadone - Oral (mg/day)": 3,
                "Morphine - Oral (mg/day)": 1,
                "Oxycodone - Oral (mg/day)": 1.5,
                "Oxymorphone - Oral (mg/day)": 3,
                "Tapentadol (mg/day)": 0.4,
                "Tramadol (mg/day)": 0.1
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
        return (e) => {
            const inputValue = parseFloat(e.target.value);
            let v = inputValue < 0 ? 0 : inputValue;
            if (/^[.]0+$/.test(e.target.value)) {
                v = e.target.value;
            }
            this.handleValueChange(
                key,
                v
            );
        };
    }

    public calcPiece (k) {
        return (_.get(this.state, 'ratios')[k] * (parseFloat(_.get(this.state, 'currentEntries')[k] || 0) || 0)).toFixed(5);
    }

    public calcTotal () {
        return _.reduce(
            _.get(this.state, 'currentEntries'),
            (s, v, k) => {
                return s + _.get(this.state, 'ratios')[k] * (parseFloat(v) || 0);
            },
            0
        ).toFixed(5)
    }

    public getCurrentEntryValue (k) {
        const val = _.get(this.state, 'currentEntries.' + k);
        if (/^[.]0+$/.test(val)) {
            return val;
        }
        return val || '';
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
                                <div key={k}>
                                    <ControlLabel>{k}</ControlLabel>
                                    <FormControl
                                        type="number"
                                        step="0.001"
                                        onChange={this.wrapValueChange(k)}
                                        value={this.getCurrentEntryValue(k)}
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