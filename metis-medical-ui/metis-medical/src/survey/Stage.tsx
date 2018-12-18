import * as _ from 'lodash';
import * as React from 'react';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Question from './Question';

class Stage extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.getQuestions = this.getQuestions.bind(this);
        this.hasQuestions = this.hasQuestions.bind(this);
        this.getQuestionIdx = this.getQuestionIdx.bind(this);
        this.getQuestionAtIndex = this.getQuestionAtIndex.bind(this);
    }

    public getQuestions () {
        const questions =  _.get(
            this.props,
            'data.question'
        );

        return questions || [];
    }

    public hasQuestions () {
        return this.getQuestions().length > 0
    }

    public getQuestionIdx () {
        return _.get(
            this.props,
            'sidebar.userInfo.currentVignette.questionIdx'
        )
    }

    public getQuestionAtIndex () {
        return this.getQuestions()[this.getQuestionIdx()];
    }

    public render () {
        return (
            <div className='stage'>
                <div className="header">
                    {_.get(this.props, 'vignettes.vignette.data.name') + " - " + (_.get(this.props, 'data.name') || '')}
                </div>
                {
                    this.hasQuestions() ?
                    <Question
                        data={
                            _.get(
                                this.getQuestionAtIndex(),
                                'data'
                            )
                        }
                        isLastQuestion={_.get(this.props, 'isLastQuestion')}
                        isLastStage={_.get(this.props, 'isLastStage')}
                    /> : <h2> No Questions Configured </h2>
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