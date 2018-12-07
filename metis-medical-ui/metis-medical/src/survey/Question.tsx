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

    public render () {
        return (
            <div className='question'>
                <h2>{_.get(this.props, 'data.text')}</h2>
                <FormGroup>
                    {
                        _.map(_.get(this.props, 'data.answers'), (a) => (
                            <Radio name={_.get(this.props, 'data.text')} value={_.get(a, 'id')} onClick={this.answerChanged}>
                                {_.get(a, 'data.text')}
                            </Radio>
                        ))
                    }
                </FormGroup>
                {
                    _.get(this.props, 'sidebar.userInfo.currentVignette.mode') === 'answer' ?
                        (<Button
                            onClick={this.submit}>
                            Submit
                        </Button>)
                    :
                        (<Button
                            onClick={this.next}>
                            Next
                        </Button>)
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