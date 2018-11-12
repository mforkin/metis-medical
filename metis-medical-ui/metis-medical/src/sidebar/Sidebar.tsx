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
      <Link to="/edit">Edit</Link>
    </li>
    <li>
      <Link to="/topics">Specialities</Link>
    </li>
  </ul>
);


export default Sidebar;


