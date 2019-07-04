import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as React from 'react';
import { Alert, FormGroup, OverlayTrigger, Radio, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';
import { FlexibleXYPlot, HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import * as Actions from '../actions';
import Question from '../survey/Question';

class UserResults extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.getVignetteDetails = this.getVignetteDetails.bind(this);
        this.getVignetteChartData = this.getVignetteChartData.bind(this);
        this.getSelectedVignetteId = this.getSelectedVignetteId.bind(this);
        this.attemptTypeChange = this.attemptTypeChange.bind(this);
        this.resultModeChange = this.resultModeChange.bind(this);
        this.tabChanged = this.tabChanged.bind(this);
        this.checker = this.checker.bind(this);
        this.modeChecker = this.modeChecker.bind(this);
        this.getCardScore = this.getCardScore.bind(this);
        this.getRawScores = this.getRawScores.bind(this);
        this.getSelectedRawScores = this.getSelectedRawScores.bind(this);
        this.getPercentAnsweredCorrectly = this.getPercentAnsweredCorrectly.bind(this);
        this.questionClicked = this.questionClicked.bind(this);
        this.getQuestionTpl = this.getQuestionTpl.bind(this);

        _.get(this.props, 'dispatch')(Actions.loadUserResults());
        _.get(this.props, 'dispatch')(Actions.loadAllResults(
            _.get(this.props, 'content.userInfo.user.username')
        ));

        this.state = {
            key: 'vignette',
            selectedQuestion: null
        }
    }

    public getQuestionDetails () {
        return _.get(this.props, 'results.results.questionDetails');
    }

    public getVignetteDetails () {
        return _.get(this.props, 'results.results.vignetteDetails');
    }

    public getSelectedVignetteId () {
        return _.get(this.props, 'content.selectedVignette.id');
    }

    public getVignetteChartData () {
        const d = _.get(this.getVignetteDetails(), this.getSelectedVignetteId());
        if (d) {
            const res = d.map(dp => {
                return {
                    id: dp.id,
                    x: dp.x,
                    y: dp.y
                };
            });
            return res;
        } else {
            return [];
        }
    }

    public getQuestionChartData () {
        const d = _.get(this.getQuestionDetails(), this.getSelectedVignetteId());
        const res = {};
        if (d) {
            _.each(d, (v, k) => {
                res[k] = [];
                _.each(v, dp => {
                    res[k].push({
                        id: dp.id,
                        x: dp.x,
                        y: dp.y
                    });
                })
                res[k] = _.sortBy(res[k], dp => dp.x);
            });
        }

        return res;
    }

    public getPercentAnsweredCorrectly () {
        const groupByUser = _.groupBy(_.get(this.props, 'results.all').filter(a => a.vignetteId === this.getSelectedVignetteId()), (r) => r.userId);
        let results = {};

        if (this.checker('best')) {
            results = this.getBestAnswers(groupByUser)
        } else {
            _.forEach(groupByUser, (ress, userId) => {
                _.forEach(ress, r => {
                    if (!results[userId] || (results[userId] && results[userId][0].iterationId < r.iterationId)) {
                        results[userId] = [r];
                    } else if (results[userId][0].iterationId === r.iterationId) {
                        results[userId].push(r);
                    }
                })
            })
        }

        const res: any = _.values(results);

        if (res.length > 0) {
            return _.sortBy(res[0].map(q => {
                let correct = 0;
                let n = 0
                _.forEach(results, (ress, userId) => {
                    _.forEach(ress, r => {
                        if (_.get(r, 'questionId') === _.get(q, 'questionId')) {
                             if (_.get(r, 'isCorrect')) {
                                correct = correct + 1;
                             }
                             n = n + 1;
                        }
                    });
                })

                return {
                    correct,
                    id: q.questionId,
                    x: q.questionSeq + 1,
                    y: correct / n
                };
            }), r => r.x);
        } else {
            return [];
        }
    }

    public getBestAnswers (groupByUser) {
        const results = {};
        const bestResults = {};
        _.forEach(groupByUser, (ress, userId) => {
            _.forEach(ress, r => {
                if (!results[userId]) { results[userId] = {}; }
                if (!results[userId][r.iterationId]) {
                    results[userId][r.iterationId] = [r]
                } else {
                    results[userId][r.iterationId].push(r);
                }
            })
        });

        _.forEach(results, (v, k) => {
            _.forEach(v, (r, i) => {
                const a: any = r
                const c = _.sumBy(a, rec => _.get(rec, 'isCorrect') ? 1 : 0);
                if (!bestResults[k] || bestResults[k].numCorrect < c) {
                    bestResults[k] = { numCorrect: c, records: r };
                }
            });
        });

        _.forEach(results, (v, k) => {
            results[k] = bestResults[k].records;
        });

        return results;
    }

    public yTickFormat (i, type) {
        const f = (t) => {
            let ret = '';
            let tick = parseFloat(t);

            if (type === 'percent') {
                tick = tick * 100
            }

            if ((!i || i === 0) && tick % 1 === 0) {
                ret = tick.toFixed(i || 0);
            } else {
                ret = tick.toFixed(i || 0);
            }

            if (type === 'percent') {
                ret = ret + '%';
            }

            return ret;
        }
        return f;
    }

    public attemptTypeChange (e) {
        const resultFilter = e.target.value;

        _.get(this.props, 'dispatch')(
            Actions.ATTEMPT_TYPE_CHANGE(resultFilter)
        )
    }

    public resultModeChange (e) {
        const resultFilter = e.target.value;

        _.get(this.props, 'dispatch')(
            Actions.RESULT_MODE_CHANGE(resultFilter)
        )
    }

    public tabChanged (key) {
        this.setState({key})
    }

    public checker (key) {
        return _.get(this.props, 'content.results.filters.attemptType') === key
    }

    public modeChecker (key) {
        return _.get(this.props, 'content.results.filters.resultMode') === key
    }

    public getRawScores () {
        return _.get(this.props, 'content.results.filters.attemptType') === 'best' ?
            _.get(this.props, 'results.best') : _.get(this.props, 'results.mostRecent');
    }

    public getSelectedRawScores () {
        const s = _.get(this.getRawScores(), this.getSelectedVignetteId())
        return s ? _.sortBy(s, r => r.questionSeq) : s;
    }

    public getCardScore () {
        const vigScore = this.getSelectedRawScores()

        if (vigScore) {
            return Math.round(vigScore[0].num / vigScore[0].denom * 100) + '%';
        }

        return -1;
    }

    public questionClicked (q) {
        const me = this;
        return () => {
            const stagesData = _.get(me.props, 'content.selectedVignette.data.stages');
            const stage = _.filter(stagesData, s => _.get(s, 'id') === _.get(q, 'stageId'))[0];
            const stageText = _.get(stage, 'data.name');
            const question = _.filter(_.get(stage, 'data.question'), qd => _.get(qd, 'id') === _.get(q, 'questionId'))[0];
            const questionData = _.get(question, 'data');
            const questionText = _.get(questionData, 'text');
            const answers = _.get(questionData, 'answers');
            const userAnswers = _.get(q, 'answers')


            const meta = _.get(q, 'answerMeta');
            if (meta) {
                _.get(this.props, 'dispatch')(
                    Actions.NUMERIC_RESPONSE_CHANGED(
                        parseFloat(meta[0])
                    )
                );
            } else {
                _.get(this.props, 'dispatch')(
                    Actions.NUMERIC_RESPONSE_CHANGED(void(0))
                );
            }


            me.setState({
                key: _.get(me.state, 'key'),
                selectedQuestion: {
                    answers,
                    question,
                    questionData,
                    questionText,
                    stageText,
                    userAnswers
                }
            })

        }
    }

    public getQuestionTpl () {
        const sq = _.get(this.state, 'selectedQuestion');
        if (!sq) {
            return (<div/>);
        } else {
            return (
                <div className="header results-stage">
                    <div className="vignette-text-cnt stage-text">{_.get(sq, "stageText")}</div>
                    <Question
                        data={
                            _.get(sq, 'questionData')
                        }
                        overrideMode="answered"
                        feedbackOverride={1}
                        responseOverride={_.get(sq, 'userAnswers')}
                        isLastQuestion={false}
                        isLastStage={false}
                    />
                </div>
            );
        }
    }

    public render () {
        return (
            <div className="res-cnt">
                <div className="res-dash-filters">
                    <div className="detail-filters">
                        <div className="attempt-type">
                            <label>Attempt:</label>
                            <FormGroup>
                                <Radio checked={this.checker('best')} name="attempttype" value="best" onClick={this.attemptTypeChange}>
                                    Best
                                </Radio>
                                <Radio checked={this.checker('last')} name="attempttype" value="last" onClick={this.attemptTypeChange}>
                                    Most Recent
                                </Radio>
                            </FormGroup>
                        </div>
                        <div className="result-mode">
                            <label>Mode:</label>
                            <FormGroup>
                                <Radio checked={this.modeChecker('vignette')} name="resultmode" value="vignette" onClick={this.resultModeChange}>
                                    Vignette
                                </Radio>
                                <Radio checked={this.modeChecker('specialty')} name="resultmode" value="specialty" onClick={this.resultModeChange}>
                                    Specialty
                                </Radio>
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <div className="res-dash-cnt">
                    <div className="full-chart inline">
                        <div className="half">
                            <FlexibleXYPlot xType="ordinal">
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis title="Question Number" />
                                <YAxis
                                    tickFormat={this.yTickFormat(0, 'percent')}
                                    title="Percentage Answering Correctly"
                                    />
                                <VerticalBarSeries color="#337ab7" stroke="#276eaa" data={this.getPercentAnsweredCorrectly()} />
                            </FlexibleXYPlot>
                        </div>
                        <div className="half">
                            {this.getQuestionTpl()}
                        </div>
                    </div>
                    <div className="most-recent callout inline">
                        <div className="callout-left">
                            <Alert bsStyle="info" className="res-callout-alert">
                                Click <FontAwesomeIcon icon={["fas", "info-circle"]} /> for details
                            </Alert>
                            {
                                _.map(this.getSelectedRawScores(), (s) => {
                                    return (
                                        <div className="callout-item">
                                            <div className="callout-info">
                                                <OverlayTrigger
                                                    key={"top"}
                                                    placement={"top"}
                                                    overlay={
                                                        <Tooltip id={`res-question-tooltip`}>
                                                            Click for Question Details
                                                        </Tooltip>
                                                    }
                                                >
                                                <div onClick={this.questionClicked(s)}><FontAwesomeIcon icon={["fas", "info-circle"]}/></div>
                                                </OverlayTrigger>
                                            </div>
                                            <div className="callout-item-value">
                                                Question {_.get(s, 'questionSeq') + 1}:
                                                <span className="fa-layers fa-fw">
                                                    <FontAwesomeIcon inverse className={_.get(s, 'isCorrect') ? 'background-icon correct' : 'background-icon incorrect'} color={_.get(s, 'isCorrect') ? '#3c763d' : '#a94442'} icon={["far", "circle"]} size="lg" />
                                                    <FontAwesomeIcon color={_.get(s, 'isCorrect') ? '#3c763d' : '#a94442'} icon={["far", _.get(s, 'isCorrect') ? "check-circle" : "times-circle"]} size="lg" />
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="callout-right">
                            {this.getCardScore()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    public renderIt () {
        return (
            <div className="res-cnt">
                <div className="res-dash-filters">
                    <div className="detail-filters">
                        <div className="attempt-type">
                            <label>Attempt:</label>
                            <FormGroup>
                                <Radio checked={this.checker('best')} name="attempttype" value="best" onClick={this.attemptTypeChange}>
                                    Best
                                </Radio>
                                <Radio checked={this.checker('last')} name="attempttype" value="last" onClick={this.attemptTypeChange}>
                                    Most Recent
                                </Radio>
                            </FormGroup>
                        </div>
                        <div className="result-mode">
                            <label>Mode:</label>
                            <FormGroup>
                                <Radio checked={this.modeChecker('vignette')} name="resultmode" value="vignette" onClick={this.resultModeChange}>
                                    Vignette
                                </Radio>
                                <Radio checked={this.modeChecker('specialty')} name="resultmode" value="specialty" onClick={this.resultModeChange}>
                                    Specialty
                                </Radio>
                                <Radio checked={this.modeChecker('iteration')} name="resultmode" value="iteration" onClick={this.resultModeChange}>
                                    Iteration
                                </Radio>
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <div className="chart-cnt">
                    <div className="flexi-cnt">
                        <FlexibleXYPlot xType="ordinal">
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis title="Number of Questions Answered Correctly" />
                            <YAxis
                                tickFormat={this.yTickFormat}
                                title="Count of Participants"
                                />
                            <VerticalBarSeries color="#337ab7" stroke="#276eaa" data={this.getVignetteChartData()} />
                        </FlexibleXYPlot>
                    </div>
                    <div className="q-details">
                        {
                            _.map(this.getQuestionChartData(), d => (
                                <div className='q-chart-cnt'>
                                    <FlexibleXYPlot xType="ordinal">
                                        <VerticalGridLines />
                                        <HorizontalGridLines />
                                        <XAxis title="Selected Answer" />
                                        <YAxis
                                            tickFormat={this.yTickFormat}
                                            title="Count of Participants"
                                            />
                                        <VerticalBarSeries color="#337ab7" stroke="#276eaa" data={d} />
                                    </FlexibleXYPlot>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        content: _.get(state, 'content'),
        results: _.get(state, 'results')
    };
}

export default connect(mapStateToProps)(UserResults);