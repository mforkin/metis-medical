import * as _ from 'lodash';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Stage from './Stage';

class Survey extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.getStages = this.getStages.bind(this);
        this.getStageIndex = this.getStageIndex.bind(this);
        this.getQuestionIndex = this.getQuestionIndex.bind(this);
        this.getQuestionsInStage = this.getQuestionsInStage.bind(this);
        this.getStageAtIndex = this.getStageAtIndex.bind(this);
        this.getQuestionAtIndex = this.getQuestionAtIndex.bind(this);
        this.isLastQuestionOfStage = this.isLastQuestionOfStage.bind(this);
        this.isLastStageOfVignette = this.isLastStageOfVignette.bind(this);
        this.isCompleted = this.isCompleted.bind(this);
        this.getRenderTpl = this.getRenderTpl.bind(this);
        this.getStageTpl = this.getStageTpl.bind(this);
        this.getCompletedTpl = this.getCompletedTpl.bind(this);
    }

    public getStages () {
        const stages = _.get(
            this.props,
            'content.selectedVignette.data.stages'
        );

        return stages || [];
    }

    public getStageIndex () {
        return _.get(
            this.props,
            'content.selectedVignette.userInfo.stageIdx'
        );
    }

    public getQuestionIndex () {
        return _.get(
            this.props,
            'content.selectedVignette.userInfo.questionIdx'
        );
    }

    public getQuestionsInStage () {
        return _.get(this.getStageAtIndex(), 'data.question');
    }

    public getStageAtIndex () {
        return this.getStages()[this.getStageIndex()];
    }

    public getQuestionAtIndex () {
        return _.get(
            this.getStageAtIndex(),
            'data.question'
        )[this.getQuestionIndex()];
    }

    public isLastQuestionOfStage () {
        const stages = this.getStages();
        const questions = this.getQuestionsInStage();
        let isLast = false;

        if (stages.length === 0) {
            isLast = true;
        }

        if (!questions || questions.length - 1 === this.getQuestionIndex()) {
            isLast = true;
        }

        return isLast;
    }

    public isLastStageOfVignette () {
        return this.getStages().length - 1 === this.getStageIndex()
    }

    public getTotalQuestions () {
        return this.getStages().reduce((total, s) => _.get(s, 'data.question').length + total, 0)
    }

    public isCompleted () {
        return  _.get(this.props, 'content.selectedVignette.userInfo.inProgress._3') > 0 || (
            _.get(this.props, 'content.selectedVignette.userInfo.inProgress._1') === (this.getStages().length - 1) &&
            _.get(this.props, 'content.selectedVignette.userInfo.inProgress._2') === (this.getTotalQuestions() - 1));
//         return this.isLastStageOfVignette() && this.isLastQuestionOfStage()
//             && _.get(this.getStageAtIndex(), 'data.seq') === _.get(this.props, 'content.selectedVignette.userInfo.inProgress._1')
//             && _.get(this.getQuestionAtIndex(), 'data.seq') === _.get(this.props, 'content.selectedVignette.userInfo.inProgress._2')
//             && _.get(this.props, 'content.selectedVignette.userInfo.inProgress._3') === _.get(this.props, 'content.selectedVignette.userInfo.iteration')
    }

    public getRenderTpl () {
        if (this.isCompleted()) {
            return this.getCompletedTpl();
        } else {
            return this.getStageTpl();
        }
    }

    public getStageTpl () {
        return (
            <Stage
                data={
                    _.get(
                        this.getStageAtIndex(),
                        'data'
                    )
                }
                isLastStage={
                    this.isLastStageOfVignette()
                }
                isLastQuestion={
                    this.isLastQuestionOfStage()
                }
            />
        )
    }

    public getCompletedTpl () {
        return (
            <Alert bsStyle="info" className="res-callout-alert">
                Vignette Completed! Select a new vignette from the sidebar to take another quiz.
            </Alert>
        );
    }

    public render () {
        return (
            <div className='survey'>
                { this.getRenderTpl() }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        content: _.get(state, 'content')
    };
}

export default connect(mapStateToProps)(Survey);