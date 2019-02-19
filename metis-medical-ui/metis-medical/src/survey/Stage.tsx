import * as _ from 'lodash';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import Question from './Question';

import './stage.css';

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
                    <div className="vignette-name">
                        {_.get(this.props, 'vignettes.vignette.data.name')}
                    </div>
                    {_.get(this.props, 'data.name') ?
                    <div className="vignette-text-cnt">
                        <div className="stage-text">
                            {_.get(this.props, 'data.name') || ''}
                        </div>
                    </div> : ""}
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
                    /> : <Alert bsStyle="danger" className="vignette-name"> Please Select a Vignette! </Alert>
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        content: _.get(state, 'content')
    };
}

export default connect(mapStateToProps)(Stage);