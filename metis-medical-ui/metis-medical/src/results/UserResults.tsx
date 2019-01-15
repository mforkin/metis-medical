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

    public getVignetteDetails () {
        return _.get(this.props, 'results.results.vignetteDetails');
    }

    public getSelectedVignetteId () {
        return _.get(this.props, 'vignettes.vignette.id');
    }

    public getVignetteChartData () {
        const d = _.get(this.getVignetteDetails(), this.getSelectedVignetteId());
        if (d) {
            return d.map(dp => {
                return {
                    id: dp.id,
                    x: dp.x,
                    y: dp.y
                };
            });
        } else {
            return [];
        }
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
            <div className="flexi-cnt">
                <FlexibleXYPlot>
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
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        results: _.get(state, 'results'),
        sidebar: _.get(state, 'sidebar'),
        vignettes: _.get(state, 'vignettes'),
    };
}

export default connect(mapStateToProps)(UserResults);