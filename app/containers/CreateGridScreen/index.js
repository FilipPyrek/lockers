import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Grid from 'components/Grid';
import GridBox from 'components/GridBox';
import GridContainer from 'components/GridContainer';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class CreateGridScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      boxes: {
        a: {
          x: 0,
          y: 0,
          color: 'red',
          name: 'A123'
        },
        b: {
          x: 100,
          y: 100,
          color: 'blue',
          name: 'B456',
        },
      },
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <Helmet
            title="Nové rozmístění"
          />
          <Grid boxes={this.state.boxes} onBoxMove={(id, { x, y }) => { const boxes = { ...this.state.boxes }; boxes[id].x = x; boxes[id].y = y; this.setState({ ...this.state, boxes }); }} />
        </Paper>
        <Paper className={classes.toolbar}>

        </Paper>
      </div>
    );
  }

}

const withConnect = connect(null, actions);

const withReducer = injectReducer({ key: 'createGrid', reducer });

const withSaga = injectSaga({ key: 'createGrid', saga });

const withStyle = withStyles(styles);

export default compose(withStyle, withReducer, withSaga, withConnect)(CreateGridScreen);
