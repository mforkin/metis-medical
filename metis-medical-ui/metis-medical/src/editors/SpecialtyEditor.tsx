import * as _ from 'lodash';
import * as React from 'react';
import { Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Actions from '../actions';

import './specialtyEditor.css';

class SpecialtyEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleSpecUpdate = this.handleSpecUpdate.bind(this);
        this.handleExistingSpecUpdate = this.handleExistingSpecUpdate.bind(this);
        this.submit = this.submit.bind(this);
    }

    public handleSpecUpdate (e) {
        _.get(this.props, 'dispatch')(Actions.LOAD_EDITOR_SPEC(e.target.value));
    }

    public handleExistingSpecUpdate(k) {
        const me = this;
        return (e) => {
            _.get(me.props, 'dispatch')(Actions.LOAD_EDITOR_SPECIALTIES(k, e.target.value));
        };
    }

    public submit () {
        const newSpec = _.get(this.props, 'newSpec');
        let submissions:any = [];
        if (newSpec.length > 0) {
            submissions.push(
                fetch("/api/specialty/", {
                    body: JSON.stringify({
                        name: newSpec
                    }),
                    method: 'post'
                })
            )
        }
        submissions = submissions.concat(
            _.map(_.get(this.props, 'editorSpecialties'), (v, k) => {
                return fetch("/api/specialty/" + k, {
                    body: JSON.stringify({
                        id: parseInt(k, 10),
                        name: v
                    }),
                    method: 'put'
                });
            })
        );

        Promise.all(submissions).then(() => {
            _.get(this.props, 'dispatch')(Actions.loadSpecialties());
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
                                _.map(_.get(this.props, 'editorSpecialties'), (v, k) => (
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
                                value={_.get(this.props, 'newSpec')}
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

const mapStateToProps = (state, ownProps) => {
    return _.get(state, 'specialties');
}

export default connect(mapStateToProps)(SpecialtyEditor);