import React, { createElement } from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources, Responsive } from 'react-admin';
import { withRouter } from 'react-router-dom';
// import LabelIcon from '@material-ui/icons/Label';

import Divider from '@material-ui/core/Divider';

//import decodeJwt from 'jwt-decode';

const Menu = ({ resources, onMenuClick, logout }) => {
  // const user = decodeJwt(localStorage.getItem('token'));
  return (
    <div>
      {resources.map((resource, id) => (
        <MenuItemLink
          key={id}
          to={`/${resource.name}`}
          primaryText={resource.options.label}
          leftIcon={createElement(resource.icon)}
          onClick={onMenuClick}
        />
      ))}
      <Divider />
      {/*user.status !== 'accepted' &&
      <React.Fragment>
        <MenuItemLink
          to={'/login'}
          primaryText={'Login'}
          leftIcon={<LabelIcon />}
          onClick={onMenuClick}
        />
      </React.Fragment>
    */}
      <Responsive xsmall={logout} />
    </div>
  );
};

const mapStateToProps = state => ({
  resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(Menu));
