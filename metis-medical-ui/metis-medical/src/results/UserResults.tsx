import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

class UserResults extends React.Component {
    constructor (props, context) {
        super(props, context);
    }

    public render () {
        return (
            <div>Results</div>
        )
    }

}

export default connect()(UserResults);