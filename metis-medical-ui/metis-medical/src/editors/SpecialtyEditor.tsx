import * as _ from 'lodash';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

import './specialtyEditor.css';

class SpecialtyEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleSpecUpdate = this.handleSpecUpdate.bind(this);
        this.handleExistingSpecUpdate = this.handleExistingSpecUpdate.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {
            data: {},
            newSpec: ""
        };

        this.getSpecialties()

    }

    public getSpecialties () {
        const me = this;
        fetch("/api/specialty")
            .then(r => r.json())
            .then(d => me.setState({
                ...me.state,
                data: d
            }))
    }

    public handleSpecUpdate (e) {
        this.setState({
            ...this.state,
            newSpec: e.target.value
        });
    }

    public handleExistingSpecUpdate(k) {
        const me = this;
        return (e) => {
            const d = _.get(me.state, 'data');
            _.set(d, k, e.target.value);
            me.setState({
                ...me.state,
                data: d,
            });
        };
    }

    public submit () {
        const newSpec = _.get(this.state, 'newSpec');
        if (newSpec.length > 0) {
            fetch("/api/specialty/", {
                body: JSON.stringify({
                    name: newSpec
                }),
                method: 'post'
            })
        }
        _.map(_.get(this.state, 'data'), (v, k) => {
            fetch("/api/specialty/" + k, {
                body: JSON.stringify({
                    id: parseInt(k, 10),
                    name: v
                }),
                method: 'put'
            });
        });
    }

    public render () {
        return (
            <div className="editor specialty-editor">
                <div className="header">
                    Specialty Editor
                </div>
                <div className="content">
                    <form>
                        <FormGroup controlId="specEdit">
                            <ControlLabel>Edit Specialties</ControlLabel>
                            {
                                _.map(_.get(this.state, 'data'), (v, k) => (
                                    <FormControl
                                        type="text"
                                        placeholder="Update Specialty Name"
                                        value={v}
                                        onChange={this.handleExistingSpecUpdate(k)}
                                    />
                                ))
                            }
                            <FormControl
                                type="text"
                                placeholder="Enter Specialty Name to Create"
                                value={_.get(this.state, 'newSpec')}
                                onChange={this.handleSpecUpdate}
                            />
                        </FormGroup>
                        <Button
                            onClick={this.submit}>
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default SpecialtyEditor;