import * as _ from 'lodash';
import * as React from 'react';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Stage from './Stage';

class Survey extends React.Component {
    constructor (props, context) {
        super(props, context);
    }

    public render () {
        return (
            <div className='survey'>
                {
                    _.map(_.get(this.props, 'vignettes.vignette.data.stages'), (s) => (
                        <Stage data={s.data}/>
                    ))
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(Survey);