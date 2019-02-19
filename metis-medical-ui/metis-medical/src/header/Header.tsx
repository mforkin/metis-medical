import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as _ from 'lodash';
import * as React from 'react';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { connect } from 'react-redux';

import './header.css';

class Header extends React.Component {
    public render() {
        return (
            <div className="header">
                <FontAwesomeIcon icon="notes-medical" />
                METIS MEDICAL
                <div className="user-info">
                    {_.get(this.props, 'content.userInfo.user.username')}
                    <FontAwesomeIcon icon="user-md" />
                    <NavDropdown
                        pullRight
                        eventKey="1"
                        title=""
                        id="nav-dropdown"
                    >
                        <MenuItem
                            href="/j_spring_security_logout"
                            eventKey="2">
                            Logout
                        </MenuItem>
                    </NavDropdown>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        content: _.get(state, 'content')
    };
};

export default connect(mapStateToProps)(Header);