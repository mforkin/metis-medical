import * as _ from 'lodash';
import * as React from 'react';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Question from './Question';

class Stage extends React.Component {
    constructor (props, context) {
        super(props, context);
    }

    public render () {
        return (
            <div className='stage'>
                <div className="header">
                    {_.get(this.props, 'data.name')}
                </div>
                {
                    _.map(_.get(this.props, 'data.question'), (q) => (
                        <Question data={q.data} />
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

export default connect(mapStateToProps)(Stage);