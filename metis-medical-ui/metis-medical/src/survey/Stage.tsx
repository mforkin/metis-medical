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
                    !_.get(
                        this.props,
                        'data.question'
                    ) ||
                    _.get(
                        this.props,
                        'data.question'
                    ).length === 0 ? <h2> No Questions Configured </h2> :
                    <Question
                        data={
                            _.get(
                                _.get(
                                    this.props,
                                    'data.question'
                                )[
                                    _.get(
                                        this.props,
                                        'sidebar.userInfo.currentVignette.questionIdx'
                                    )
                                ],
                                'data'
                            )
                        }
                        isLastQuestion={_.get(this.props, 'isLastQuestion')}
                        isLastStage={_.get(this.props, 'isLastStage')}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        sidebar: _.get(state, 'sidebar'),
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(Stage);