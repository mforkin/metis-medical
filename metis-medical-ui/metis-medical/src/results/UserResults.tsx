import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as _ from 'lodash';
import * as React from 'react';
import { FormGroup, Radio } from 'react-bootstrap';
import { connect } from 'react-redux';
import { FlexibleXYPlot, HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import * as Actions from '../actions';

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

        _.get(this.props, 'dispatch')(Actions.loadUserResults());
        _.get(this.props, 'dispatch')(Actions.loadAllResults(
            _.get(this.props, 'content.userInfo.user.username')
        ));

        this.state = {
            key: 'vignette'
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

    public yTickFormat (t) {
        let ret = '';
        const tick = parseFloat(t);
        if (tick % 1 === 0) {
            ret = tick.toFixed(0);
        }

        return ret;
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
                                <Radio checked={this.modeChecker('iteration')} name="resultmode" value="iteration" onClick={this.resultModeChange}>
                                    Iteration
                                </Radio>
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <div className="res-dash-cnt">
                    <div className="full-chart inline">
                        Full Chart Here
                    </div>
                    <div className="most-recent callout inline">
                        <div className="callout-left">
                            <div className="callout-item">
                                <div className="callout-info">
                                    <FontAwesomeIcon icon="info-circle"/>
                                </div>
                                <div className="callout-item-value">
                                    Q1: <FontAwesomeIcon icon={["far", "check-circle"]} size="lg" />
                                </div>
                            </div>
                        </div>
                        <div className="callout-right">
                            66%
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