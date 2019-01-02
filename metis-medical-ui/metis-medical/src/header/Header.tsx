import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';

import './header.css';

class Header extends React.Component {
    public render() {
        return (
            <div className="header">
                <FontAwesomeIcon icon="notes-medical" />
                METIS MEDICAL
                <div className="user-info">
                    {_.get(this.props, 'sidebar.userInfo.user.username')}
                    <FontAwesomeIcon icon="user-md" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        sidebar: _.get(state, 'sidebar')
    };
};

export default connect(mapStateToProps)(Header);