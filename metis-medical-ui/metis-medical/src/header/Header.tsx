import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as _ from 'lodash';
import * as React from 'react';

import './header.css';

class Header extends React.Component {
    public render() {
        return (
            <div className="header">
                <FontAwesomeIcon icon="notes-medical" />
                METIS MEDICAL
            </div>
        );
    }
}

export default Header;