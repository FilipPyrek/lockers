import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link as RawLink } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import BuildIcon from 'material-ui-icons/Build';
import LoginIcon from 'material-ui-icons/LockOpen';
import LogoutIcon from 'material-ui-icons/ExitToApp';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';

const Link = styled(RawLink)`
  text-decoration: none;
`;

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    whiteSpace: 'nowrap',
    position: 'relative',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

class ApplicationFrame extends React.Component {
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
              Purkyňka Lockers
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
                    <ListItem button>
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
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
          {
            this.props.isLoggenIn
            ? (
              <div>
                <Divider />
                <List>
                  <Link to="/logout">
                    <ListItem button>
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

ApplicationFrame.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isLoggenIn: PropTypes.bool.isRequired,
};

const ConnectedAppFrame = connect(
  (state) => ({
    isLoggenIn: Boolean(state.getIn(['global', 'token'])),
  })
  , null)(ApplicationFrame);

const AppWithStyles = withStyles(styles, { withTheme: true })(ConnectedAppFrame);

export default AppWithStyles;
