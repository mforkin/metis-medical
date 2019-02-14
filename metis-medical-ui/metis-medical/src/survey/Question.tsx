import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Checkbox, FormControl, FormGroup, Radio } from 'react-bootstrap';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class Question extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.answerChanged = this.answerChanged.bind(this);
        this.numericAnswerChanged = this.numericAnswerChanged.bind(this);
        this.getAnswers = this.getAnswers.bind(this);
        this.getMode = this.getMode.bind(this);
        this.getSubmitLabel = this.getSubmitLabel.bind(this);
        this.getSubmitFn = this.getSubmitFn.bind(this);
        this.getResponse = this.getResponse.bind(this);
        this.getMultiResultClass = this.getMultiResultClass.bind(this);
        this.getNumericResponse = this.getNumericResponse.bind(this);
        this.isAnswerChecked = this.isAnswerChecked.bind(this);

        this.state = {
            numericResponse: undefined
        };
    }

    public numericAnswerChanged (e) {
        const answer = parseFloat(e.target.value);
        this.setState({
            numericResponse: answer
        });

        const rightAnswer = _.find(this.getAnswers(), (a) => a.data.isCorrect);
        const wrongAnswer = _.find(this.getAnswers(), (a) => !a.data.isCorrect);
        let aId;
        if (parseFloat(rightAnswer.data.text) === answer) {
            aId = rightAnswer.id;
        } else {
            aId = wrongAnswer.id;
        }

        _.get(this.props, 'dispatch')(
            Actions.SIDEBAR_RESPONSE_CHANGED(
                [aId]
            )
        );
    }

    public answerChanged (e) {
        const selectedAnswerId = parseInt(e.target.value, 10);

        if (_.get(this.props, 'data.multi')) {
             const idx = _.indexOf(_.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse'), selectedAnswerId);
             if (idx >= 0) {
                _.remove(_.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse'), i => i === selectedAnswerId);
                _.get(this.props, 'dispatch')(
                    Actions.SIDEBAR_RESPONSE_CHANGED(
                        _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse')
                    )
                );
             } else {
                const cur = _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse');
                _.get(this.props, 'dispatch')(
                    Actions.SIDEBAR_RESPONSE_CHANGED(
                        cur.concat([selectedAnswerId])
                    )
                );
             }
        } else {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_RESPONSE_CHANGED([parseInt(e.target.value, 10)]));
        }
    }

    public submit (e) {
        _.get(this.props, 'dispatch')(Actions.submitAnswer({
            answerMetaInfo: _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse')
                .map((r) => {
                    return {
                        id: r,
                        meta: _.get(this.state, 'numericResponse')
                    };
                }),
            datetime: (new Date()).toISOString(),
            iteration: _.get(this.props, 'sidebar.userInfo.currentVignette.iteration')
        }));
    }

    public next () {
        if (!_.get(this.props, 'isLastQuestion')) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                _.get(this.props, 'sidebar.userInfo.currentVignette.questionIdx') + 1,
                _.get(this.props, 'sidebar.userInfo.currentVignette.stageIdx')
            ));
        } else if (!_.get(this.props, 'isLastStage')) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                0,
                _.get(this.props, 'sidebar.userInfo.currentVignette.stageIdx') + 1,

            ));
        } else {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_LAST_QUESTION_ANSWERED({
                '_1': _.get(_.get(this.props, 'vignettes.vignette.data.stages')[_.get(this.props, 'sidebar.userInfo.currentVignette.stageIdx')], 'data.seq'),
                '_2': _.get(this.props, 'data.seq'),
                '_3': _.get(this.props, 'sidebar.userInfo.currentVignette.inProgress._3')
            }));

            _.get(this.props, 'dispatch')(Actions.loadAvailableVignettes(
                _.get(this.props, 'vignettes.vignette.id'),
                undefined
            ));
        }
    }


    public getAnswers () {
        const answers = _.get(this.props, 'data.answers');

        return answers || [];
    }

    public getMode () {
        return _.get(this.props, 'sidebar.userInfo.currentVignette.mode');
    }

    public getSubmitLabel () {
        return this.getMode() === 'answer' ? "Submit" : "Next";
    }

    public getSubmitFn () {
        return this.getMode() === 'answer' ? this.submit : this.next;
    }

    public getResponse (answer, isMulti) {
        const response = { message: '', class: '' };
        if (_.get(this.props, 'sidebar.feedback.id')) {
            if (_.indexOf(_.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse'), _.get(answer, 'id')) >= 0 || _.get(answer, 'data.isCorrect')) {
                let prefix = 'Incorrect. ';
                response.message = prefix + _.get(answer, 'data.incorrectResponse');
                if (_.get(answer, 'data.isCorrect')) {
                    prefix = 'Correct! ';
                    if (isMulti && !this.isAnswerChecked(answer)) {
                        prefix = 'This answer is correct and should have been selected. ';
                    }
                    response.message = prefix + _.get(answer, 'data.correctResponse');
                }
                response.class = _.get(answer, 'data.isCorrect') ? 'success' : 'danger';
            } else {
                response.message = "Correct! This is not a valid solution. "  + _.get(answer, 'data.incorrectResponse')
            }
        }
        return response;
    }

    public getMultiResultClass (answer) {
        let resultCls = 'answer-cnt ';
        if (this.getMode() !== 'answer') {
            if (this.isAnswerChecked(answer) && !_.get(answer, 'data.isCorrect')) {
                resultCls += 'missed-multi-answer incorrect-selected';
            } else if (!this.isAnswerChecked(answer) && _.get(answer, 'data.isCorrect')) {
                resultCls += 'missed-multi-answer correct-omission';
            }
        }
        return resultCls;
    }

    public getNumericResponseIcon () {
        let response;
        if (_.get(this.props, 'sidebar.feedback.id')) {
            const curAnswerId = _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse')[0];
            const cur = _.find(this.getAnswers(), (a) => a.id === curAnswerId)
            if (cur.data.isCorrect) {
                response = (<FontAwesomeIcon icon="check-circle" />)
            } else {
                response = (<FontAwesomeIcon icon="times-circle" />)
            }
        }
        return response;
    }

    public getNumericResponse () {
        const response = { message: '', class: '' };
        if (_.get(this.props, 'sidebar.feedback.id')) {
            const curAnswerId = _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse')[0];
            const cur = _.find(this.getAnswers(), (a) => a.id === curAnswerId)
            if (cur.data.isCorrect) {
                response.message = 'Correct! ' + cur.data.correctResponse;
            } else {
                response.message = 'Incorrect! ' + cur.data.incorrectResponse;
            }
            response.class = _.get(cur, 'data.isCorrect') ? 'success' : 'danger';
        }
        return response;
    }

    public getNumericSuffix (data) {
        const answers = _.get(data, 'answers')
        const unit = _.find(answers, a => _.get(a, 'data.isCorrect'))
        return _.get(unit, 'data.selectedText')
    }

    public isAnswerChecked (answer) {
        if (_.get(this.props, 'data.multi')) {
            return _.indexOf(_.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse'), answer.id) >= 0;
        }
        return _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse')[0] === answer.id;
    }

    public render () {
        return (
            <div className='question'>
                <h2>{_.get(this.props, 'data.text')}</h2>
                {
                    _.get(this.props, 'data.questionType') === 'numeric' ? (
                        <div className={"numeric-response-cnt " + this.getNumericResponse().class}>
                            <FormControl
                                className="numeric-form-control"
                                type="number"
                                value={_.get(this.state, 'numericResponse')}
                                onChange={this.numericAnswerChanged}
                                />
                            <div className="numeric-suffix">{this.getNumericSuffix(_.get(this.props, 'data'))}</div>
                            <div className="numeric-response-icon">
                                {this.getNumericResponseIcon()}
                            </div>
                            <div className="numeric-response">
                                {this.getNumericResponse().message}
                            </div>
                        </div>
                    ) : (
                        <FormGroup>
                            {
                                _.map(this.getAnswers(), (a) => _.get(this.props, 'data.multi') ? (
                                    <div className={this.getMultiResultClass(a) + ' ' + this.getResponse(a, false).class}>
                                        <Checkbox checked={this.isAnswerChecked(a)} name={_.get(this.props, 'data.text')} value={_.get(a, 'id')} onClick={this.answerChanged}>
                                            {_.get(a, 'data.text')}
                                        </Checkbox>
                                        {this.getResponse(a, true).message}
                                    </div>
                                ) : (
                                    <div className={this.getResponse(a, false).class}>
                                        <Radio checked={this.isAnswerChecked(a)} name={_.get(this.props, 'data.text')} value={_.get(a, 'id')} onClick={this.answerChanged}>
                                            {_.get(a, 'data.text')}
                                        </Radio>
                                        {this.getResponse(a, false).message}
                                    </div>
                                ))
                            }
                        </FormGroup>
                    )
                }
                {
                    (
                        <Button
                            onClick={this.getSubmitFn()}
                        >
                            {this.getSubmitLabel()}
                        </Button>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        sidebar: _.get(state, 'sidebar'),
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(Question);