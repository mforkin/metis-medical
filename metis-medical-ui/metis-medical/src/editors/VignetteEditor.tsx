import * as _ from 'lodash';
import * as React from 'react';
import { Button, Checkbox, ControlLabel, FormControl, FormGroup, HelpBlock, Well } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Actions from '../actions';

import './vignetteEditor.css';

class VignetteEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSpecChange = this.handleSpecChange.bind(this);
        this.addStage = this.addStage.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
        this.stageNameChange = this.stageNameChange.bind(this);
        this.stageSeqChange = this.stageSeqChange.bind(this);
        this.questionNameChange = this.questionNameChange.bind(this);
        this.questionSeqChange = this.questionSeqChange.bind(this);
        this.answerPropChange = this.answerPropChange.bind(this);
        this.submit = this.submit.bind(this);
        this.wrap = this.wrap.bind(this);
        this.handleSelectedVignetteChange = this.handleSelectedVignetteChange.bind(this);
    }

    public handleSelectedVignetteChange (e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_SELECTED(
                _.get(this.props, 'vignettes.vignette.data.specialtyId'),
                _.get(this.props, 'vignettes.availableVignettes'),
                e.target.value
            )
        )
    }

    public submit () {
        _.get(this.props, 'dispatch')(
            Actions.createOrUpdateVignette(
                _.get(this.props, 'vignettes.vignette'),
                _.get(this.props, 'vignettes.selectedVignetteId')
            )
        );

    }

    public answerPropChange (propName, stageIdx, qIdx, aIdx, e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_ANSWER_PROP_CHANGE(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                propName,
                stageIdx,
                qIdx,
                aIdx,
                e
            )
        );
    }

    public questionNameChange (stageIdx, qIdx, e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_QUESTION_NAME_CHANGE(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                stageIdx,
                qIdx,
                e
            )
        );
    }

    public questionSeqChange (stageIdx, qIdx, e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_QUESTION_SEQ_CHANGE(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                stageIdx,
                qIdx,
                e
            )
        );
    }

    public stageNameChange (stageIdx, e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_STAGE_NAME_CHANGE(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                stageIdx,
                e
            )
        );
    }

    public stageSeqChange (stageIdx, e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_STAGE_SEQ_CHANGE(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                stageIdx,
                e
            )
        );
    }

    public wrap (fnName, ...moreArgs) {
        const me = this;
        const args = Array.prototype.splice.call(arguments, 1, arguments.length);
        return (e) => {
            _.get(me, fnName).apply(me, args.concat(e));
        }
    }

    public addStage () {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_STAGE_ADD(
                _.get(this.props, 'vignettes.vignette.data.stages')
            )
        );
    }

    public addQuestion (stageIdx) {
         _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_QUESTION_ADD(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                stageIdx
            )
        );
    }

    public addAnswer (stageIdx, questionIdx) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_ANSWER_ADD(
                _.get(this.props, 'vignettes.vignette.data.stages'),
                stageIdx,
                questionIdx
            )
        );
    }

    public handleNameChange(e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_NAME_CHANGE(
                _.get(this.props, 'vignettes.vignette.data'),
                e
            )
        );
    }

    public handleSpecChange(e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_SPEC_CHANGE(
                _.get(this.props, 'vignettes.vignette.data'),
                _.get(this.props, 'vignettes.selectedVignetteId'),
                e
            )
        );
        _.get(this.props, 'dispatch')(
            Actions.loadAvailableVignettes(e.target.value, undefined)
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
                        controlId="formSpec"
                    >
                        <ControlLabel>Specialty</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={_.get(this.props, 'vignettes.vignette.data.specialtyId')}
                            placeholder="Enter Specialty"
                            onChange={this.handleSpecChange}
                        >
                            <option value="-1"/>
                            {
                                _.map(_.get(this.props, 'specialties.specialties'), (name, id) => (
                                    <option value={id}>{name}</option>
                                ))
                            }
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup controlId="vignetteSelector">
                        <ControlLabel>Select Vignette</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={_.get(this.props, 'vignettes.selectedVignetteId')}
                            placeholder="Select To Edit Existing"
                            onChange={this.handleSelectedVignetteChange}
                        >
                            <option value="-1">Create New</option>
                            {
                                _.map(_.get(this.props, 'vignettes.availableVignettes'), (v) => (
                                    <option value={_.get(v, 'id')}>{_.get(v, 'data.name')}</option>
                                ))
                            }
                        </FormControl>
                    </FormGroup>
                    <FormGroup
                        controlId="formBasicText"
                    >
                        <ControlLabel>Name</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter Name"
                            value={_.get(this.props, 'vignettes.vignette.data.name')}
                            onChange={this.handleNameChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Testing</HelpBlock>
                    </FormGroup>
                    <div>
                        {
                            _.map(_.get(this.props, 'vignettes.vignette.data.stages'), (s, i) => (
                                <Well>
                                    <FormGroup>
                                        <FormControl
                                            type="text"
                                            placeholder="Stage Name"
                                            value={_.get(s, 'data.name')}
                                            onChange={this.wrap('stageNameChange', i)}
                                        />
                                        <FormControl
                                            type="number"
                                            value={_.get(s, 'data.seq')}
                                            onChange={this.wrap('stageSeqChange', i)}
                                        />
                                    </FormGroup>
                                    <div>
                                    {
                                        _.map(_.get(s, 'data.question'), (q, j) => (
                                            <Well>
                                                <FormControl
                                                    type="text"
                                                    placeholder="Question Text"
                                                    value={_.get(q, 'data.text')}
                                                    onChange={this.wrap('questionNameChange', i, j)}
                                                />
                                                <FormControl
                                                    type="number"
                                                    value={_.get(q, 'data.seq')}
                                                    onChange={this.wrap('questionSeqChange', i, j)}
                                                />
                                                <div>
                                                {
                                                    _.map(_.get(q, 'data.answers'), (a, k) => (
                                                        <Well>
                                                        <FormControl
                                                            type="text"
                                                            value={_.get(a, 'data.text')}
                                                            placeholder="Answer Text"
                                                            onChange={this.wrap('answerPropChange', 'text', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="number"
                                                            value={_.get(a, 'data.seq')}
                                                            onChange={this.wrap('answerPropChange', 'seq', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="text"
                                                            value={_.get(a, 'data.correctResponse')}
                                                            placeholder="Correct Response"
                                                            onChange={this.wrap('answerPropChange', 'correctResponse', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="text"
                                                            value={_.get(a, 'data.incorrectResponse')}
                                                            placeholder="Incorrect Response"
                                                            onChange={this.wrap('answerPropChange', 'incorrectResponse', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="text"
                                                            value={_.get(a, 'data.selectedText')}
                                                            placeholder="Selected Response"
                                                            onChange={this.wrap('answerPropChange', 'selectedText', i, j, k)}
                                                        />
                                                        <Checkbox
                                                        checked={_.get(a, 'data.isCorrect')}
                                                        onChange={this.wrap('answerPropChange', 'isCorrect', i, j, k)}>Correct Answer?</Checkbox>
                                                        </Well>
                                                    ))
                                                }
                                                </div>
                                                <Button
                                                    onClick={this.wrap('addAnswer', i, j)}>add answer</Button>
                                            </Well>
                                        ))
                                    }
                                    </div>
                                    <Button
                                        onClick={this.wrap('addQuestion', i)}>add question</Button>
                                </Well>
                            ))
                        }
                    </div>
                    <Button
                        onClick={this.addStage}>
                        add stage</Button>

                    <Button
                        onClick={this.submit}>
                        Submit
                    </Button>
                </form>
            </div>
          </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        specialties: _.get(state, 'specialties'),
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(VignetteEditor);