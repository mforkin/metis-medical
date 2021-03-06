import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as React from 'react';
import { Checkbox, FormControl, FormGroup, Radio } from 'react-bootstrap';
// import { Button, Checkbox, FormControl, FormGroup, Radio } from 'react-bootstrap';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import * as Actions from '../actions';

class Question extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.modeSetter = this.modeSetter.bind(this);
        this.isLast = this.isLast.bind(this);
        this.selectNextVignette = this.selectNextVignette.bind(this);
        this.getNextVignetteId = this.getNextVignetteId.bind(this);
        this.hasNextVignette = this.hasNextVignette.bind(this);
        this.getNextQuestionIdxFromSeq = this.getNextQuestionIdxFromSeq.bind(this);
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
        this.getAnswerCheckbox = this.getAnswerCheckbox.bind(this);
        this.getAnswerRadio = this.getAnswerRadio.bind(this);
        this.getFeedbackId = this.getFeedbackId.bind(this);
        this.getRawCurrentResponse = this.getRawCurrentResponse.bind(this);

        this.state = {
            iconSize: "lg"
        };
    }

    public numericAnswerChanged (e) {
        const answer = parseFloat(e.target.value);
        _.get(this.props, 'dispatch')(
            Actions.NUMERIC_RESPONSE_CHANGED(answer)
        );

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
             const idx = _.indexOf(this.getRawCurrentResponse(), selectedAnswerId);
             if (idx >= 0) {
                _.remove(this.getRawCurrentResponse(), i => i === selectedAnswerId);
                _.get(this.props, 'dispatch')(
                    Actions.SIDEBAR_RESPONSE_CHANGED(
                        this.getRawCurrentResponse()
                    )
                );
             } else {
                const cur = this.getRawCurrentResponse();
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
            answerMetaInfo: this.getRawCurrentResponse()
                .map((r) => {
                    return {
                        id: r,
                        meta: _.get(this.props, 'content.numericResponse')
                    };
                }),
            datetime: (new Date()).toISOString(),
            iteration: _.get(this.props, 'content.selectedVignette.userInfo.iteration')
        }));
    }

    public next () {
        if (!_.get(this.props, 'isLastQuestion')) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                _.get(this.props, 'content.selectedVignette.userInfo.questionIdx') + 1,
                _.get(this.props, 'content.selectedVignette.userInfo.stageIdx')
            ));
        } else if (!_.get(this.props, 'isLastStage')) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                0,
                _.get(this.props, 'content.selectedVignette.userInfo.stageIdx') + 1,

            ));
        } else {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_LAST_QUESTION_ANSWERED({
                '_1': _.get(_.get(this.props, 'content.selectedVignette.data.stages')[_.get(this.props, 'content.selectedVignette.userInfo.stageIdx')], 'data.seq'),
                '_2': _.get(this.props, 'data.seq'),
                '_3': _.get(this.props, 'content.selectedVignette.userInfo.inProgress._3')
            }));

            _.get(this.props, 'dispatch')(Actions.loadAvailableVignettes(
                _.get(this.props, 'content.specialtyId'),
                undefined
            ));
        }

        _.get(this.props, 'dispatch')(
            Actions.NUMERIC_RESPONSE_CHANGED('')
        );
    }


    public getAnswers () {
        const answers = _.get(this.props, 'data.answers');

        return answers || [];
    }

    public getMode () {
        const overrideMode = _.get(this.props, 'overrideMode');
        if (overrideMode) {
            return overrideMode;
        } else {
            return _.get(this.props, 'content.selectedVignette.userInfo.mode');
        }
    }

    public getFeedbackId () {
        const fbOverride = _.get(this.props, 'feedbackOverride');
        if (fbOverride) {
            return fbOverride
        } else {
            const fb = _.get(this.props, 'content.feedback.id');
            return fb;
        }
    }

    public getRawCurrentResponse () {
        const crOverride = _.get(this.props, 'responseOverride');
        if (crOverride) {
            return crOverride;
        } else {
            const cr =  _.get(this.props, 'content.selectedVignette.userInfo.currentResponse');
            console.log(cr);
            return cr;
        }
    }

    public getSubmitLabel () {
        return this.getMode() === 'answer' ? "Submit" : "Next Question";
    }

    public getSubmitFn () {
        return this.getMode() === 'answer' ? this.submit : this.next;
    }

    public isLast () {
        return _.get(this.props, 'isLastQuestion') &&  _.get(this.props, 'isLastStage')
    }

    public getAnswerCheckbox (isAnswerChecked, a, props, answerChanged, cls) {
        if (this.getMode() === 'answer') {
            return (<Checkbox checked={isAnswerChecked(a)} name={_.get(props, 'data.text')} value={_.get(a, 'id')} onClick={answerChanged}>
                {_.get(a, 'data.text')}
            </Checkbox>)
        } else {
            let icon: IconProp = cls === 'success' ? ["far", "check-square"] : ["far", "times-circle"];
            if (cls === '') { icon = ["far", "square"] }
            return (
                <div className="verify-checkbox">
                    <FontAwesomeIcon icon={icon} size={_.get(this.state, 'iconSize')} />
                    <div className="checkbox-text">
                        {_.get(a, 'data.text')}
                    </div>
                </div>
            )
        }
    }

    public getAnswerRadio (isAnswerChecked, a, props, answerChanged, cls) {
        if (this.getMode() === 'answer') {
            return (<Radio checked={isAnswerChecked(a)} name={_.get(props, 'data.text')} value={_.get(a, 'id')} onClick={answerChanged}>
                {_.get(a, 'data.text')}
            </Radio>)
        } else {
            let icon: IconProp = cls === 'success' ? ["far", "check-circle"] : ["far", "times-circle"];
            if (cls === '') { icon = ["far", "circle"] }
            return (
                <div className="verify-checkbox">
                    <FontAwesomeIcon icon={icon} size={_.get(this.state, 'iconSize')} />
                    <div className="checkbox-text">
                        {_.get(a, 'data.text')}
                    </div>
                </div>
            )
        }
    }

    public getResponse (answer, isMulti) {
        const response = { message: '', class: '' };
        if (this.getFeedbackId()) {
            if (_.indexOf(this.getRawCurrentResponse(), _.get(answer, 'id')) >= 0 || _.get(answer, 'data.isCorrect')) {
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
                response.message = "Correct! This is not an appropriate choice of medication. "  + _.get(answer, 'data.incorrectResponse')
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
        if (this.getFeedbackId()) {
            const curAnswerId = this.getRawCurrentResponse()[0];
            const cur = _.find(this.getAnswers(), (a) => a.id === curAnswerId)
            if (cur.data.isCorrect) {
                response = (<FontAwesomeIcon icon={["far", "check-circle"]} size={_.get(this.state, 'iconSize')} />)
            } else {
                response = (<FontAwesomeIcon icon={["far", "times-circle"]} size={_.get(this.state, 'iconSize')} />)
            }
        }
        return response;
    }

    public getNumericResponse () {
        const response = { message: '', class: '' };
        if (this.getFeedbackId()) {
            const curAnswerId = this.getRawCurrentResponse()[0];
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
            return _.indexOf(this.getRawCurrentResponse(), answer.id) >= 0;
        }
        return this.getRawCurrentResponse()[0] === answer.id;
    }

    public modeSetter (mode) {
        const me = this;
        return (e) => {
            _.get(me.props, 'dispatch')(Actions.UPDATE_MODE(mode));
            _.get(me.props, 'dispatch')(Actions.loadUserResults());
            _.get(this.props, 'dispatch')(Actions.loadAvailableVignettes(
                _.get(this.props, 'content.specialtyId'),
                _.get(this.props, 'content.selectedVignette.id')
            ));
            _.get(this.props, 'dispatch')(
                Actions.NUMERIC_RESPONSE_CHANGED('')
            );
        };
    }

    public getNextVignetteId () {
        const vignetteIds = _.sortBy(
            _.map(
                _.get(this.props, 'content.availableVignettes'),
                (v) => {
                    return {
                        id: _.get(v, 'id'),
                        seq: _.get(v, 'data.seq')
                    };
                }
            ),
            'seq'
        );

        const curIdx = _.findIndex(vignetteIds, (v) => _.get(v, 'id') === _.get(this.props, 'content.selectedVignette.id'));
        const nextId = curIdx === vignetteIds.length ? void(0) : _.get(vignetteIds[curIdx + 1], 'id');
        return nextId;
    }

    public getNextQuestionIdxFromSeq (stageSeq, questionSeq, iteration, vig) {
        const stages = _.get(vig, 'data.stages')
        const stageIndex = _.findIndex(stages, (s) => _.get(s, 'data.seq') === stageSeq)
        const questions = _.get(stages[stageIndex], 'data.question')
        const questionIndex = _.findIndex(questions, (q) => _.get(q, 'data.seq') === questionSeq)
        const ret = {
            questionIndex,
            stageIndex
        }
        // last question in stage was answered
        if (questionIndex === questions.length - 1) {
            // if there is a new stage to go to, go to it, if not, reset!
            if (stageIndex !== stages.length - 1) {
                ret.stageIndex = stageIndex + 1
                ret.questionIndex = 0
                _.get(this.props, 'dispatch')(Actions.SIDEBAR_UPDATE_ITERATION(
                    iteration
                ));
            } else {
                ret.stageIndex = 0
                ret.questionIndex = 0
                _.get(this.props, 'dispatch')(Actions.SIDEBAR_UPDATE_ITERATION(
                    iteration + 1
                ));
            }
        } else {
            ret.questionIndex = questionIndex + 1
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_UPDATE_ITERATION(
                iteration
            ));
        }
        return ret;
    }

    public selectNextVignette () {
        const nextId = this.getNextVignetteId();
        const availableV = _.get(this.props, 'dispatch')(
            Actions.loadAvailableVignettes(
                _.get(this.props, 'content.specialtyId'),
                nextId
            )
        );

        const me = this;

        _.get(this.props, 'dispatch')(
            Actions.NUMERIC_RESPONSE_CHANGED('')
        );

        availableV.then(a => {
            _.get(this.props, 'dispatch')(
                Actions.VIGNETTE_SELECTED(
                    _.get(this.props, 'content.specialtyId'),
                    _.get(this.props, 'content.availableVignettes'),
                    nextId
                )
            )

            const loaded = _.get(this.props, 'dispatch')(
                Actions.loadUserDataForVignette(
                    nextId
                )
            );

            loaded.then(l => {
                const loadPromise = _.get(this.props, 'dispatch')(
                    Actions.loadProgressForVignette(
                        _.get(this.props, 'content.specialtyId'),
                        nextId
                    )
                );

                loadPromise.then(t => {
                    // @TODO don't get vignette like this, change to redux dispatch
                    const vignette = _.find(
                        _.get(me.props, 'content.availableVignettes'),
                        (v) => v.id === nextId
                    );
                    const progress = _.get(vignette, 'inProgress');
                    // CHANGED const progress = _.get(_.get(me.props, 'vignettes.userData')[0], 'inProgress')
                    if (progress) {
                        const nextIndexes = me.getNextQuestionIdxFromSeq(_.get(progress, '_1'), _.get(progress, '_2'), _.get(progress, '_3'), vignette)
                        _.get(me.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                            nextIndexes.questionIndex,
                            nextIndexes.stageIndex
                        ));
                    } else {
                        _.get(me.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                            0,
                            0
                        ));
                    }
                });
            });
        })
    }

    public hasNextVignette () {
        return this.getNextVignetteId() !== void(0);
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
                                value={_.get(this.props, 'content.numericResponse')}
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
                                        {this.getAnswerCheckbox(this.isAnswerChecked, a, this.props, this.answerChanged, this.getResponse(a, false).class)}
                                        {this.getResponse(a, true).message}
                                    </div>
                                ) : (
                                    <div className={this.getResponse(a, false).class}>
                                        {this.getAnswerRadio(this.isAnswerChecked, a, this.props, this.answerChanged, this.getResponse(a, false).class)}
                                        {this.getResponse(a, false).message}
                                    </div>
                                ))
                            }
                        </FormGroup>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        content: _.get(state, 'content')
    };
}

export default connect(mapStateToProps)(Question);