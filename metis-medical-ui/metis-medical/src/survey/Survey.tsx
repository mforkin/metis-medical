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
                <Stage
                    data={
                        _.get(
                            _.get(
                                this.props,
                                'vignettes.vignette.data.stages'
                            )[
                                _.get(
                                    this.props,
                                    'sidebar.userInfo.currentVignette.stageIdx'
                                )
                            ],
                            'data'
                        )
                    }
                    isLastStage={
                        _.get(
                            this.props,
                            'vignettes.vignette.data.stages'
                        ).length - 1 === _.get(
                            this.props,
                            'sidebar.userInfo.currentVignette.stageIdx'
                        )
                    }
                    isLastQuestion={
                        _.get(
                            this.props,
                            'vignettes.vignette.data.stages'
                        ).length === 0 ? true :
                        _.get(
                            _.get(
                                this.props,
                                'vignettes.vignette.data.stages'
                            )[
                                _.get(
                                    this.props,
                                    'sidebar.userInfo.currentVignette.stageIdx'
                                )
                            ],
                            'data.question'
                        ).length - 1 === _.get(
                            this.props,
                            'sidebar.userInfo.currentVignette.questionIdx'
                        )
                    }
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        sidebar: _.get(state, 'sidebar'),
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(Survey);