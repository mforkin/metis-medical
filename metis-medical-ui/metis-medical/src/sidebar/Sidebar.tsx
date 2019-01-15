import * as _ from 'lodash';
import * as React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Actions from '../actions';

import './sidebar.css'

class Sidebar extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.handleSpecChange = this.handleSpecChange.bind(this);
        this.handleVigChange = this.handleVigChange.bind(this);
        this.isVignetteCompleted = this.isVignetteCompleted.bind(this);
        this.isVignetteInProgressLabel = this.isVignetteInProgressLabel.bind(this);
        this.modeSetter = this.modeSetter.bind(this);
        this.isSelectedClass = this.isSelectedClass.bind(this);

        this.state = {
            mode: 'quiz'
        };
    }

    public isSelectedClass (mode) {
        return "menu-item " + (_.get(this.state, 'mode') === mode ? 'selected' : 'not-selected');
    }

    public modeSetter (mode) {
        const me = this;
        return (e) => {
            _.get(me.props, 'dispatch')(Actions.loadUserResults());
            me.setState({ mode });
        };
    }

    public handleSpecChange (e) {
        _.get(this.props, 'dispatch')(
            Actions.SIDEBAR_SPEC_CHANGE(e)
        );

        _.get(this.props, 'dispatch')(
            Actions.loadAvailableVignettes(
                parseInt(e.target.value, 10),
                undefined
            )
        );
    }

    public handleVigChange (e) {
        _.get(this.props, 'dispatch')(
            Actions.VIGNETTE_SELECTED(
                _.get(this.props, 'vignettes.selectedSpecialtyId'),
                _.get(this.props, 'vignettes.availableVignettes'),
                e.target.value
            )
        )

        _.get(this.props, 'dispatch')(
            Actions.loadUserDataForVignette(
                parseInt(e.target.value, 10)
            )
        );

        const loadPromise = _.get(this.props, 'dispatch')(
            Actions.loadProgressForVignette(
                parseInt(e.target.value, 10)
            )
        );

        const targetValue = parseInt(e.target.value, 10);

        const me = this;

        loadPromise.then(t => {
            // @TODO don't get vignette like this, change to redux dispatch
            const vignette = _.find(
                _.get(me.props, 'vignettes.availableVignettes'),
                (v) => v.id === targetValue
            );
            console.log(t);
            const progress = _.get(_.get(me.props, 'vignettes.userData')[0], 'inProgress')
            if (progress) {
                const nextIndexes = me.getNextQuestionIdxFromSeq(_.get(progress, '_1'), _.get(progress, '_2'), _.get(progress, '_3'), vignette)
                _.get(me.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                    nextIndexes.questionIndex,
                    nextIndexes.stageIndex
                ));
            } else {
                _.get(me.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                    0,
                    0
                ));
            }
        });
    }

    public getNextQuestionIdxFromSeq (stageSeq, questionSeq, iteration, vig) {
        const stages = _.get(vig, 'data.stages')
        const stageIndex = _.findIndex(stages, (s) => _.get(s, 'data.seq') === stageSeq)
        const questions = _.get(stages[stageIndex], 'data.question')
        const questionIndex = _.findIndex(questions, (q) => _.get(q, 'data.seq') === questionSeq)
        const ret = {
            questionIndex,
            stageIndex
        }
        // last question in stage was answered
        if (questionIndex === questions.length - 1) {
            // if there is a new stage to go to, go to it, if not, reset!
            if (stageIndex !== stages.length - 1) {
                ret.stageIndex = stageIndex + 1
                ret.questionIndex = 0
                _.get(this.props, 'dispatch')(Actions.SIDEBAR_UPDATE_ITERATION(
                    iteration
                ));
            } else {
                ret.stageIndex = 0
                ret.questionIndex = 0
                _.get(this.props, 'dispatch')(Actions.SIDEBAR_UPDATE_ITERATION(
                    iteration + 1
                ));
            }
        } else {
            ret.questionIndex = questionIndex + 1
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_UPDATE_ITERATION(
                iteration
            ));
        }
        return ret;
    }

    public isVignetteCompleted (d) {
        let finished = false;
        const lastStage = _.maxBy(
            _.get(d, 'data.stages'),
            s => _.get(s, 'data.seq')
        )
        const lastStageSeq = _.get(lastStage, 'data.seq')
        if (_.get(d, 'inProgress') && lastStageSeq === _.get(d, 'inProgress._1')) {
            const lastQuestion = _.maxBy(
                _.get(lastStage, 'data.question'),
                q => _.get(q, 'data.seq')
            )
            const lastQuestionSeq = _.get(lastQuestion, 'data.seq')
            if (lastQuestionSeq === _.get(d, 'inProgress._2')) {
                finished = true;
            }
        }

        return finished;
    }

    public isVignetteInProgressLabel (d) {
        let label = ""
        if (this.isVignetteCompleted(d)) {
            label = " - Completed"
        } else if (_.get(d, 'inProgress')) {
            label = " - In Progress"
        }
        return label
    }

    public render() {
        return (
            <div className='sidebar'>
                <div>
                    <FormGroup controlId="specMenu">
                        <ControlLabel>Choose Speciality</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={_.get(this.props, 'sidebar.specialtyId')}
                            placeholder="Select Specialty"
                            onChange={this.handleSpecChange}
                        >
                            <option value="-1"/>
                            {
                                _.map(_.get(this.props, 'specialties.specialties'), (name, id) => (
                                    <option key={id} value={id}>{name}</option>
                                ))
                            }
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                </div>
                <div>
                    <FormGroup controlId="vigMenu">
                        <ControlLabel>Choose Vignette</ControlLabel>
                        <FormControl
                            componentClass="select"
                            value={_.get(this.props, 'sidebar.vignetteId')}
                            placeholder="Select Vignette"
                            onChange={this.handleVigChange}
                        >
                            <option value="-1"/>
                            {
                                _.map(_.get(this.props, 'vignettes.availableVignettes'), (d) => (
                                    <option key={d.id} value={d.id}>{d.data.name + this.isVignetteInProgressLabel(d)}</option>
                                ))
                            }
                        </FormControl>
                        <FormControl.Feedback />
                    </FormGroup>
                </div>
                <Link onClick={this.modeSetter('quiz')} className={this.isSelectedClass('quiz')} to="/">Quiz</Link>
                <Link onClick={this.modeSetter('results')} className={this.isSelectedClass('results')} to="/results">Results</Link>
                {
                    _.get(this.props, 'sidebar.userInfo.user.isAdmin') ? (
                        <Link onClick={this.modeSetter('mv')} className={this.isSelectedClass('mv')} to="/edit">Manage Vignettes</Link>
                    ) : ""
                }
                {
                    _.get(this.props, 'sidebar.userInfo.user.isAdmin') ? (
                        <Link onClick={this.modeSetter('ms')} className={this.isSelectedClass('ms')} to="/editSpecialties">Manage Specialties</Link>
                    ) : ""
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        sidebar: _.get(state, 'sidebar'),
        specialties: _.get(state, 'specialties'),
        vignettes: _.get(state, 'vignettes')
    };
}

export default connect(mapStateToProps)(Sidebar);


