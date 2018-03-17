import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
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
    this.state = { active: false, x: 0, y: 0, blockX: 0, blockY: 0 };

    this.handleSubmission = this.handleSubmission.bind(this);
  }

  handleSubmission(event) {
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <Helmet
            title="Vytvoření rozložení"
          />
          <form onSubmit={this.handleSubmission}>
            <Typography variant="headline">Přihlášení</Typography>
            x: {this.state.x}<br />
            y: {this.state.y}
            <div
              style={{ width: 500, height: 500, position: 'relative' }}
              onMouseUp={() => this.setState({ ...this.state, active: false })}
              onMouseMove={(e) => {
                const isChild = e.nativeEvent.target.id === 'abc';
                const l = isChild ? e.nativeEvent.target.offsetLeft : 0;
                const t = isChild ? e.nativeEvent.target.offsetTop : 0;
                this.setState({
                  ...this.state,
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
                  blockX: this.state.active ? e.nativeEvent.offsetX + l - this.state.offsetX : this.state.blockX,
                  blockY: this.state.active ? e.nativeEvent.offsetY + t - this.state.offsetY : this.state.blockY,
                })
              }}
            >
              <div
                id="abc"
                style={{ width: 50, height: 50, background: '#F00', position: 'absolute', top: this.state.blockY, left: this.state.blockX }}
                onMouseDown={(e) => this.setState({ ...this.state, active: true, offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY })}
              />
            </div>
          </form>
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
