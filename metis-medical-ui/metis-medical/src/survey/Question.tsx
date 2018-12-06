import * as _ from 'lodash';
import * as React from 'react';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

class Question extends React.Component {
    constructor (props, context) {
        super(props, context);
    }

    public render () {
        return (
            <div className='question'>
                <div>{_.get(this.props, 'data.text')}</div>
                {
                    _.map(_.get(this.props, 'data.answers'), (a) => (
                        <div>{_.get(a, 'data.text')}</div>
                    ))
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(Question);