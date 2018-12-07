import * as _ from 'lodash';
import * as React from 'react';
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
        this.isLastQuestionOfStage = this.isLastQuestionOfStage.bind(this);
    }

    public getStages () {
        const stages = _.get(
            this.props,
            'vignettes.vignette.data.stages'
        );

        return stages || [];
    }

    public getStageIndex () {
        return _.get(
            this.props,
            'sidebar.userInfo.currentVignette.stageIdx'
        );
    }

    public getQuestionIndex () {
        return _.get(
            this.props,
            'sidebar.userInfo.currentVignette.questionIdx'
        );
    }

    public getQuestionsInStage () {
        return _.get(this.getStageAtIndex(), 'data.question');
    }

    public getStageAtIndex () {
        return this.getStages()[this.getStageIndex()];
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

    public render () {
        return (
            <div className='survey'>
                <Stage
                    data={
                        _.get(
                            this.getStageAtIndex(),
                            'data'
                        )
                    }
                    isLastStage={
                        this.getStages().length - 1 === this.getStageIndex()
                    }
                    isLastQuestion={
                        this.isLastQuestionOfStage()
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