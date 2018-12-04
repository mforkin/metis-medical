import * as _ from 'lodash';
import * as React from 'react';
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {
    constructor (props, context) {
        super(props, context);
        const me = this;

        this.handleSpecChange = this.handleSpecChange.bind(this);
        this.handleVigChange = this.handleVigChange.bind(this);
        this.selectNewVig = this.selectNewVig.bind(this);

        this.state = {
            specialties: [],
            specialtyId: 1,
            vignetteId: 1,
            vignettes: []
        };

        this.getSpecialties()
            .then(d => {
                me.handleSpecChange({target: {value: 1}});
            });

        this.selectNewVig(1);
    }

    public handleSpecChange (e) {
        const me = this;
        const sId = parseInt(e.target.value, 10);
        this.setState({
            ...this.state,
            specialtyId: sId
        });

        fetch("/api/vignette/specialty/" + sId)
            .then(r => r.json())
            .then(d => {
                me.setState({
                    ...me.state,
                    vignettes: d
                })
            });
    }

    public selectNewVig(id) {
        console.log(id);
    }

    public handleVigChange (e) {
        this.setState({
            ...this.state,
            vignetteId: parseInt(e.target.value, 10)
        });

        this.selectNewVig(parseInt(e.target.value, 10));
    }

    public getSpecialties () {
        const me = this;
        return fetch("/api/specialty")
            .then(r => r.json())
            .then(d => me.setState({
                ...me.state,
                specialties: d
            }));
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
                                value={_.get(this.state, 'specialtyId')}
                                placeholder="Select Specialty"
                                onChange={this.handleSpecChange}
                            >
                                <option value="-1"/>
                                {
                                    _.map(_.get(this.state, 'specialties'), (name, id) => (
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
                                value={_.get(this.state, 'vignetteId')}
                                placeholder="Select Vignette"
                                onChange={this.handleVigChange}
                            >
                                {
                                    _.map(_.get(this.state, 'vignettes'), (d) => (
                                        <option value={d.id}>{d.data.name}</option>
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

export default Sidebar;


