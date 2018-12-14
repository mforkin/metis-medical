import * as _ from 'lodash';
import * as React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Actions from '../actions';

class Sidebar extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.handleSpecChange = this.handleSpecChange.bind(this);
        this.handleVigChange = this.handleVigChange.bind(this);
        this.isVignetteCompleted = this.isVignetteCompleted.bind(this);
        this.isVignetteInProgressLabel = this.isVignetteInProgressLabel.bind(this);
    }

    public handleSpecChange (e) {
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

        const vignette = _.find(
            _.get(this.props, 'vignettes.availableVignettes'),
            (v) => v.id === parseInt(e.target.value, 10)
        );
        const progress = _.get(vignette, 'inProgress')
        if (progress) {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                this.getNextQuestionIdxFromSeq(_.get(progress, '_2')),
                this.getNextStageIdxFromSeq(_.get(progress, '_1'), _.get(progress, '_2'))
            ));
        } else {
            _.get(this.props, 'dispatch')(Actions.SIDEBAR_NEXT_QUESTION(
                0,
                0
            ));
        }
    }

    // @TODO Make these functions work
    public getNextStageIdxFromSeq (stageSeq, questionSeq) {
        return 0;
    }

    public getNextQuestionIdxFromSeq (questionSeq) {
        return 0;
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
                <ul>
                    <li>
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
                                        <option value={id}>{name}</option>
                                    ))
                                }
                            </FormControl>
                            <FormControl.Feedback />
                        </FormGroup>
                    </li>
                    <li>
                        <FormGroup controlId="vigMenu">
                            <ControlLabel>Choose Vignette</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={_.get(this.props, 'sidebar.vignetteId')}
                                placeholder="Select Vignette"
                                onChange={this.handleVigChange}
                            >
                                {
                                    _.map(_.get(this.props, 'vignettes.availableVignettes'), (d) => (
                                        <option disabled={this.isVignetteCompleted(d)} value={d.id}>{d.data.name + this.isVignetteInProgressLabel(d)}</option>
                                    ))
                                }
                            </FormControl>
                            <FormControl.Feedback />
                        </FormGroup>
                    </li>
                    <li>
                      <Link to="/edit">Manage Vignettes</Link>
                    </li>
                    <li>
                      <Link to="/editSpecialties">Manage Specialties</Link>
                    </li>
                    <li>
                      <Link to="/topics">Specialties</Link>
                    </li>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                  </ul>
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


