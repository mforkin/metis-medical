import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class UserResults extends React.Component {
    constructor (props, context) {
        super(props, context);

        _.get(this.props, 'dispatch')(Actions.loadUserResults());
    }

    public render () {
        return (
            <div>Results: {_.get(this.props, 'results')}</div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        results: _.get(state, 'results')
    };
}

export default connect(mapStateToProps)(UserResults);