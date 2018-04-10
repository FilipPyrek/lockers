import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link as RawLink } from 'react-router-dom';
import KeyHandler, { KEYUP } from 'react-key-handler';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import UsersIcon from 'material-ui-icons/People';
import LayoutListIcon from 'material-ui-icons/GridOn';
import SchoolYearListIcon from 'material-ui-icons/Folder';
import LoginIcon from 'material-ui-icons/LockOpen';
import LogoutIcon from 'material-ui-icons/ExitToApp';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import styles from './styles';

const Link = styled(RawLink)`
  text-decoration: none;
`;

class ApplicationFrame extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    isLoggenIn: PropTypes.bool.isRequired,
    title: PropTypes.string,
  }

  static defaultProps = {
    title: 'Purkyňka Lockers',
  }

  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Helmet
          title={this.props.title}
        />
        <KeyHandler keyEventName={KEYUP} keyValue="Escape" onKeyHandle={this.handleDrawerClose} />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              {this.props.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          {
            !this.props.isLoggenIn
            ? (
              <div>
                <Divider />
                <List>
                  <Link to="/login">
                    <ListItem button className={classes.button}>
                      <ListItemIcon>
                        <LoginIcon titleAccess="Přihlásit se" />
                      </ListItemIcon>
                      <ListItemText primary="Přhlásit se" />
                    </ListItem>
                  </Link>
                </List>
              </div>
            ) : null
          }
          {
            this.props.isLoggenIn
            ? (
              <div>
                <Divider />
                <List>
                  <Link to="/school-years" title="Školní roky">
                    <ListItem button className={classes.button}>
                      <ListItemIcon>
                        <SchoolYearListIcon />
                      </ListItemIcon>
                      <ListItemText primary="Školní roky" />
                    </ListItem>
                  </Link>
                  <Link to="/maps" title="Mapy">
                    <ListItem button className={classes.button}>
                      <ListItemIcon>
                        <LayoutListIcon />
                      </ListItemIcon>
                      <ListItemText primary="Mapy" />
                    </ListItem>
                  </Link>
                  <Link to="/users" title="Uživatelé">
                    <ListItem button className={classes.button}>
                      <ListItemIcon>
                        <UsersIcon />
                      </ListItemIcon>
                      <ListItemText primary="Uživatelé" />
                    </ListItem>
                  </Link>
                  <Link to="/logout" title="Odhlásit se">
                    <ListItem button className={classes.button}>
                      <ListItemIcon>
                        <LogoutIcon title="logout" titleAccess="Odhlásit se" />
                      </ListItemIcon>
                      <ListItemText primary="Odhlásit se" />
                    </ListItem>
                  </Link>
                </List>
              </div>
            ) : null
          }
        </Drawer>
        <main className={classes.content}>
          {/* <div className={classes.toolbar} /> */}
          {this.props.children}
        </main>
      </div>
    );
  }
}

const ConnectedAppFrame = connect(
  (state) => ({
    isLoggenIn: Boolean(state.getIn(['global', 'token'])),
  })
  , null)(ApplicationFrame);

const AppWithStyles = withStyles(styles, { withTheme: true })(ConnectedAppFrame);

export default AppWithStyles;
