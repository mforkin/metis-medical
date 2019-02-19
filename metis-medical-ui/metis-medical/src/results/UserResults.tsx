import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { FlexibleXYPlot, HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import * as Actions from '../actions';

class UserResults extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.getVignetteDetails = this.getVignetteDetails.bind(this);
        this.getVignetteChartData = this.getVignetteChartData.bind(this);
        this.getSelectedVignetteId = this.getSelectedVignetteId.bind(this);

        _.get(this.props, 'dispatch')(Actions.loadUserResults());
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

    public render () {
        return (
            <div className="res-cnt">
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