import * as _ from 'lodash';
import * as React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Actions from '../actions';
import Question from './Question';

import './stage.css';

class Stage extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.getQuestions = this.getQuestions.bind(this);
        this.hasQuestions = this.hasQuestions.bind(this);
        this.getQuestionIdx = this.getQuestionIdx.bind(this);
        this.getQuestionAtIndex = this.getQuestionAtIndex.bind(this);

        this.isLast = this.isLast.bind(this);
        this.getMode = this.getMode.bind(this);
        this.getSubmitLabel = this.getSubmitLabel.bind(this);
        this.getSubmitFn = this.getSubmitFn.bind(this);
        this.getNextVignetteId = this.getNextVignetteId.bind(this);
        this.hasNextVignette = this.hasNextVignette.bind(this);
        this.selectNextVignette = this.selectNextVignette.bind(this);
        this.modeSetter = this.modeSetter.bind(this);
        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.getNextQuestionIdxFromSeq = this.getNextQuestionIdxFromSeq.bind(this);

    }

    public getQuestions () {
        const questions =  _.get(
            this.props,
            'data.question'
        );

        return questions || [];
    }

    public hasQuestions () {
        return this.getQuestions().length > 0
    }

    public getQuestionIdx () {
        return _.get(
            this.props,
            'content.selectedVignette.userInfo.questionIdx'
        )
    }

    public getQuestionAtIndex () {
        return this.getQuestions()[this.getQuestionIdx()];
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

    public submit (e) {
        _.get(this.props, 'dispatch')(Actions.submitAnswer({
            answerMetaInfo: _.get(this.props, 'content.selectedVignette.userInfo.currentResponse')
                .map((r) => {
                    return {
                        id: r,
                        meta: _.get(this.state, 'numericResponse')
                    };
                }),
            datetime: (new Date()).toISOString(),
            iteration: _.get(this.props, 'content.selectedVignette.userInfo.iteration')
        }));
    }

    public isLast () {
        return _.get(this.props, 'isLastQuestion') &&  _.get(this.props, 'isLastStage')
    }

    public getMode () {
        return _.get(this.props, 'content.selectedVignette.userInfo.mode');
    }

    public getSubmitLabel () {
        return this.getMode() === 'answer' ? "Submit" : "Next Question";
    }

    public getSubmitFn () {
        return this.getMode() === 'answer' ? this.submit : this.next;
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

    public hasNextVignette () {
        return this.getNextVignetteId() !== void(0);
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

    public render () {
        return (
            <div className="stage-cnt">
                <div className='stage'>
                    <div className="header">
                        <div className="vignette-name">
                            {_.get(this.props, 'content.selectedVignette.data.name')}
                        </div>
                        {_.get(this.props, 'data.name') ?
                        <div className="vignette-text-cnt">
                            <div className="stage-text">
                                {_.get(this.props, 'data.name') || ''}
                            </div>
                        </div> : ""}
                    </div>
                    {
                        this.hasQuestions() ?
                        <Question
                            data={
                                _.get(
                                    this.getQuestionAtIndex(),
                                    'data'
                                )
                            }
                            isLastQuestion={_.get(this.props, 'isLastQuestion')}
                            isLastStage={_.get(this.props, 'isLastStage')}
                        /> : <Alert bsStyle="danger" className="vignette-name"> Please Select a Vignette! </Alert>
                    }
                </div>
                {
                    this.hasQuestions() ? (
                        <div className="controls">
                            {
                                this.isLast() && this.getMode() === 'answered'? (
                                    <div>
                                        {
                                            this.hasNextVignette() ?
                                            (
                                                <Button
                                                    onClick={this.selectNextVignette}
                                                >
                                                    Next Vignette
                                                </Button>
                                            )
                                            :
                                            (
                                                <div className="vig-complete">
                                                    All Vignettes Completed!
                                                </div>
                                            )
                                        }
                                        <Button className="link-btn">
                                            <Link onClick={this.modeSetter('results')} to="/results">Results</Link>
                                        </Button>
                                    </div>
                                ) :
                                (
                                    <div>
                                        <Button
                                            onClick={this.getSubmitFn()}
                                        >
                                            {this.getSubmitLabel()}
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    ) : ''
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

export default connect(mapStateToProps)(Stage);