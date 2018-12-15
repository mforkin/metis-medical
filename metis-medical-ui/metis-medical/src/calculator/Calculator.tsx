import * as _ from 'lodash';
import * as React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

class Calculator extends React.Component {
    constructor (props, context) {
        super(props, context)

        this.handleValueChange = this.handleValueChange.bind(this);
        this.wrapValueChange = this.wrapValueChange.bind(this);
        this.calcTotal = this.calcTotal.bind(this);

        this.state = {
            currentEntries: {},
            ratios: {
                d1: 0.015,
                d2: 0.5,
                d3: 0.35
            }
        }
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

    public calcTotal () {
        return _.reduce(
            _.get(this.state, 'currentEntries'),
            (s, v, k) => {
                return s + _.get(this.state, 'ratios')[k] * v;
            },
            0
        )
    }

    public render () {
        return (
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
                                />
                            </div>
                        )
                    })
                }

                <div>
                    <ControlLabel>Morphene Equivalence:</ControlLabel>
                    <div>
                        {this.calcTotal()}
                    </div>
                </div>
            </FormGroup>
        )
    }

}


export default connect()(Calculator);