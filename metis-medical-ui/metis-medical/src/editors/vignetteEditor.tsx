import * as _ from 'lodash';
import * as React from 'react';
import { Button, Checkbox, ControlLabel, FormControl, FormGroup, HelpBlock, Well } from 'react-bootstrap';

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

        this.state = {
            availableVignettes: [],
            selectedVignetteId: -1,
            specialties: {},
            vignette: {
                data: {
                    name: '',
                    specialtyId: -1,
                    stages: []
                }
            }
        };

        this.getAvailableSpecialties();
    }

    public handleSelectedVignetteChange (e) {
        const vId = parseInt(e.target.value, 10);
        if (vId === -1) {
            this.setState({
                ...this.state,
                selectedVignetteId: vId,
                vignette: {
                    data: {
                        name: '',
                        specialtyId: _.get(this.state, 'vignette.data.specialtyId'),
                        stages: []
                    }
                }
            });
        } else {
            this.setState({
                ...this.state,
                selectedVignetteId: vId,
                vignette: _.find(_.get(this.state, 'availableVignettes'), (v) => {
                    return v.id ===  vId;
                })
            });
        }
    }

    public getAvailableSpecialties () {
        const me = this;
        fetch("/api/specialty")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                me.setState({
                    ...me.state,
                    specialties: data
                });
            });
    }

    public getAvailableVignettes (sId) {
        const me = this;
        fetch("/api/vignette/specialty/" + sId)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                me.setState({
                    ...me.state,
                    availableVignettes: data
                })
            });
    }

    public submit () {
        const selectedId = _.get(this.state, 'selectedVignetteId');

        fetch("/api/vignette/", {
            body: JSON.stringify({..._.get(this.state, 'vignette')}),
            method: selectedId === -1 ? 'post' : 'put'
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    }

    public answerPropChange (propName, stageIdx, qIdx, aIdx, e) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question[qIdx].data.answers[aIdx].data[propName] = (propName === 'isCorrect' ? e.target.checked : e.target.value);
                if (propName === 'seq') {
                    d.data.question[qIdx].data.answers[aIdx].data[propName] = parseInt(d.data.question[qIdx].data.answers[aIdx].data[propName], 10);
                }
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
        );
    }





    public questionNameChange (stageIdx, qIdx, e) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question[qIdx].data.text = e.target.value;
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
        );
    }

    public questionSeqChange (stageIdx, qIdx, e) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question[qIdx].data.seq = parseInt(e.target.value, 10);
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
        );
    }

    public stageNameChange (stageIdx, e) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.name = e.target.value;
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
        );
    }

    public stageSeqChange (stageIdx, e) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.seq = parseInt(e.target.value, 10);
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
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
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages').concat([{
                            data: {
                                name: '',
                                question: [],
                                seq: -1
                            }
                        }])
                    }
                }
            }
        );
    }

    public addQuestion (stageIdx) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question = d.data.question.concat(
                    [{
                        data: {
                            answers: [],
                            seq: -1,
                            text: ""
                        }
                    }]
                );
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
        );
    }

    public addAnswer (stageIdx, questionIdx) {
        _.get(this.state, 'vignette.data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question = _.map(d.data.question, (q, idx) => {
                    if (questionIdx === idx) {
                        q.data.answers = q.data.answers.concat([{
                            data: {
                                correctResponse: "",
                                incorrectResponse: "",
                                isCorrect: false,
                                selectedText: "",
                                seq: -1,
                                text: ""
                            }
                        }]);
                    }
                    return q;
                })
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        stages: _.get(this.state, 'vignette.data.stages')
                    }
                }
            }
        );
    }

    public handleNameChange(e) {
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        name: e.target.value
                    }
                }
            }
        );
    }

    public handleSpecChange(e) {
        this.setState(
            {
                ...this.state,
                vignette: {
                    ..._.get(this.state, 'vignette'),
                    data: {
                        ..._.get(this.state, 'vignette.data'),
                        specialtyId: parseInt(e.target.value, 10)
                    }
                }
            }
        );
        this.getAvailableVignettes(e.target.value);
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
                            value={_.get(this.state, 'vignette.data.specialtyId')}
                            placeholder="Enter Specialty"
                            onChange={this.handleSpecChange}
                        >
                            <option value="-1"/>
                            {
                                _.map(_.get(this.state, 'specialties'), (name, id) => (
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
                            value={_.get(this.state, 'selectedVignetteId')}
                            placeholder="Select To Edit Existing"
                            onChange={this.handleSelectedVignetteChange}
                        >
                            <option value="-1">Create New</option>
                            {
                                _.map(_.get(this.state, 'availableVignettes'), (v) => (
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
                            value={_.get(this.state, 'vignette.data.name')}
                            onChange={this.handleNameChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Testing</HelpBlock>
                    </FormGroup>
                    <div>
                        {
                            _.map(_.get(this.state, 'vignette.data.stages'), (s, i) => (
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

export default VignetteEditor;