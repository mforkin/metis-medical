import * as _ from 'lodash';
import * as React from 'react';
import { Button, FormGroup, Radio } from 'react-bootstrap';
// import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class Question extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.answerChanged = this.answerChanged.bind(this);
        this.getAnswers = this.getAnswers.bind(this);
        this.getMode = this.getMode.bind(this);
        this.getSubmitLabel = this.getSubmitLabel.bind(this);
        this.getSubmitFn = this.getSubmitFn.bind(this);
        this.getResponse = this.getResponse.bind(this);
        this.isAnswerChecked = this.isAnswerChecked.bind(this);
    }

    public answerChanged (e) {
         _.get(this.props, 'dispatch')(Actions.SIDEBAR_RESPONSE_CHANGED(parseInt(e.target.value, 10)));
    }

    public submit (e) {
        _.get(this.props, 'dispatch')(Actions.submitAnswer({
            answerId: _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse'),
            datetime: (new Date()).toISOString()
        }));
    }

    public next () {
        if (!_.get(this.props, 'isLastQuestion')) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                _.get(this.props, 'sidebar.userInfo.currentVignette.questionIdx') + 1,
                _.get(this.props, 'sidebar.userInfo.currentVignette.stageIdx')
            ));
        } else if (!_.get(this.props, 'isLastStage')) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                0,
                _.get(this.props, 'sidebar.userInfo.currentVignette.stageIdx') + 1,

            ));
        }
    }


    public getAnswers () {
        const answers = _.get(this.props, 'data.answers');

        return answers || [];
    }

    public getMode () {
        return _.get(this.props, 'sidebar.userInfo.currentVignette.mode');
    }

    public getSubmitLabel () {
        return this.getMode() === 'answer' ? "Submit" : "Next";
    }

    public getSubmitFn () {
        return this.getMode() === 'answer' ? this.submit : this.next;
    }

    public getResponse (answer) {
        let response;
        if (_.get(this.props, 'sidebar.feedback.id') === _.get(answer, 'id')) {
            let message = _.get(answer, 'data.incorrectResponse');
            if (_.get(answer, 'data.isCorrect')) {
                message = _.get(answer, 'data.correctResponse');
            }
            response = (<div>{message}</div>);
        }
        return response;
    }

    public isAnswerChecked (answer) {
        return _.get(this.props, 'sidebar.userInfo.currentVignette.currentResponse') === answer.id;
    }

    public render () {
        return (
            <div className='question'>
                <h2>{_.get(this.props, 'data.text')}</h2>
                <FormGroup>
                    {
                        _.map(this.getAnswers(), (a) => (
                            <div>
                                <Radio checked={this.isAnswerChecked(a)} name={_.get(this.props, 'data.text')} value={_.get(a, 'id')} onClick={this.answerChanged}>
                                    {_.get(a, 'data.text')}
                                </Radio>
                                {this.getResponse(a)}
                            </div>
                        ))
                    }
                </FormGroup>
                {
                    (
                        <Button
                            onClick={this.getSubmitFn()}
                        >
                            {this.getSubmitLabel()}
                        </Button>
                    )
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

export default connect(mapStateToProps)(Question);