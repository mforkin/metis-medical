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

        this.state = {
            data: {
                name: '',
                specialtyId: -1,
                stages: []
            }
        };
    }

    public submit () {
        fetch("/api/vignette/", {
            body: JSON.stringify({...this.state}),
            method: 'post'
        })
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    public answerPropChange (propName, stageIdx, qIdx, aIdx, e) {
        _.get(this.state, 'data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question[qIdx].data.answers[aIdx].data[propName] = (propName === 'isCorrect' ? e.target.checked : e.target.value);
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
                }
            }
        );
    }





    public questionNameChange (stageIdx, qIdx, e) {
        _.get(this.state, 'data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question[qIdx].data.text = e.target.value;
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
                }
            }
        );
    }

    public questionSeqChange (stageIdx, qIdx, e) {
        _.get(this.state, 'data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.question[qIdx].data.seq = e.target.value;
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
                }
            }
        );
    }

    public stageNameChange (stageIdx, e) {
        _.get(this.state, 'data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.name = e.target.value;
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
                }
            }
        );
    }

    public stageSeqChange (stageIdx, e) {
        _.get(this.state, 'data.stages').map((d, i) => {
            if (i === stageIdx) {
                d.data.seq = e.target.value;
            }
            return d;
        });
        this.setState(
            {
                ...this.state,
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
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
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages').concat([{
                        data: {
                            name: '',
                            question: [],
                            seq: -1
                        }
                    }])
                }
            }
        );
    }

    public addQuestion (stageIdx) {
        _.get(this.state, 'data.stages').map((d, i) => {
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
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
                }
            }
        );
    }

    public addAnswer (stageIdx, questionIdx) {
        _.get(this.state, 'data.stages').map((d, i) => {
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
                data: {
                    ..._.get(this.state, 'data'),
                    stages: _.get(this.state, 'data.stages')
                }
            }
        );
    }

    public handleNameChange(e) {
        this.setState(
            {
                ...this.state,
                data: {
                    ..._.get(this.state, 'data'),
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
                    ..._.get(this.state, 'data'),
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
                    <div>
                        {
                            _.map(_.get(this.state, 'data.stages'), (s, i) => (
                                <Well>
                                    <FormGroup>
                                        <FormControl
                                            type="text"
                                            placeholder="Stage Name"
                                            onChange={this.wrap('stageNameChange', i)}
                                        />
                                        <FormControl
                                            type="number"
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
                                                    onChange={this.wrap('questionNameChange', i, j)}
                                                />
                                                <FormControl
                                                    type="number"
                                                    onChange={this.wrap('questionSeqChange', i, j)}
                                                />
                                                <div>
                                                {
                                                    _.map(_.get(q, 'data.answers'), (a, k) => (
                                                        <Well>
                                                        <FormControl
                                                            type="text"
                                                            placeholder="Answer Text"
                                                            onChange={this.wrap('answerPropChange', 'text', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="number"
                                                            onChange={this.wrap('answerPropChange', 'seq', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="text"
                                                            placeholder="Correct Response"
                                                            onChange={this.wrap('answerPropChange', 'correctResponse', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="text"
                                                            placeholder="Incorrect Response"
                                                            onChange={this.wrap('answerPropChange', 'incorrectResponse', i, j, k)}
                                                        />
                                                        <FormControl
                                                            type="text"
                                                            placeholder="Selected Response"
                                                            onChange={this.wrap('answerPropChange', 'selectedText', i, j, k)}
                                                        />
                                                        <Checkbox onChange={this.wrap('answerPropChange', 'isCorrect', i, j, k)}>Correct Answer?</Checkbox>
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