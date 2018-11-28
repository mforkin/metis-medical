import * as _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {
    public render() {
        return (
            <div className='sidebar'>
                <Menu />
            </div>
        );
    }
}

const Menu = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
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
  </ul>
);


export default Sidebar;


