import * as _ from 'lodash';
import * as React from 'react';
import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import './vignetteEditor.css';

class VignetteEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSpecChange = this.handleSpecChange.bind(this);

        this.state = {
            data: {
                name: '',
                specialtyId: -1,
                stages: []
            }
        };
    }

    public handleNameChange(e) {
        this.setState(
            {
                ...this.state,
                data: {
                    name: e.target.value
                }
            }
        );
    }

    public handleSpecChange(e) {
        this.setState(
            {
                ...this.state,
                data: {
                    specialtyId: e.target.value
                }
            }
        );
    }

    public render() {
        return (
          <div className="editor vignette-editor">
            <div className="header">
                Vignette Editor
            </div>
            <div className="content">
                <form>
                    <FormGroup
                        controlId="formBasicText"
                    >
                        <ControlLabel>Name</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter Name"
                            onChange={this.handleNameChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Testing</HelpBlock>
                    </FormGroup>
                    <FormGroup
                        controlId="formSpec"
                    >
                        <ControlLabel>Specialty</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={_.get(this.state, 'data.specialtyId')}
                            placeholder="Enter Specialty"
                            onChange={this.handleSpecChange}
                        >
                            <option value="-1"/>
                            <option value="1">Specialty 1</option>
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                </form>
            </div>
          </div>
        );
    }
}

export default VignetteEditor;