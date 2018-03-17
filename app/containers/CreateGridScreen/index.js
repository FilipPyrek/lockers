import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from 'classnames';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
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
    this.state = {
      boxes: [
        {
          name: 'first',
          x: 0,
          y: 0,
          color: 0,
        },
      ],
      active: null,
      lastActive: null,
      activeMapMovement: false,
      mapOffsetX: 0,
      mapOffsetY: 0,
      scale: 2,
    };

    this.handleSubmission = this.handleSubmission.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.addBox = this.addBox.bind(this);
    this.changeName = this.changeName.bind(this);
  }

  handleSubmission(event) {
    event.preventDefault();
  }

  mouseDown(event) {
    event.preventDefault();
    const { key } = event.target.dataset;

    if (!key) {
      this.setState({
        ...this.state,
        activeMapMovement: true,
      });
      return;
    }

    this.setState({
      ...this.state,
      active: key,
      lastActive: key,
    });
  }

  mouseUp() {
    this.setState({
      ...this.state,
      active: null,
      activeMapMovement: false,
    });
  }

  mouseMove({ nativeEvent: event }) {
    if (this.state.activeMapMovement) {
      this.setState({
        ...this.state,
        mapOffsetX: this.state.mapOffsetX + event.movementX,
        mapOffsetY: this.state.mapOffsetY + event.movementY,
      });
      return;
    }

    if (this.state.active === null) {
      return;
    }
    const boxes = [...this.state.boxes];
    boxes[this.state.active].x += event.movementX / this.state.scale;
    boxes[this.state.active].y += event.movementY / this.state.scale;

    this.setState({
      ...this.state,
      boxes,
    });
  }

  addBox() {
    const boxes = [...this.state.boxes];
    const key = -1 + boxes.push({
      name: `${Math.round(Math.random() * 100)}`,
      x: 0,
      y: 0,
      color: Math.round(Math.random() * 360),
    });
    this.setState({
      ...this.state,
      boxes,
      lastActive: key,
    });
  }

  changeName(event) {
    const boxes = [...this.state.boxes];
    boxes[this.state.lastActive].name = event.target.value;

    this.setState({
      ...this.state,
      boxes,
    });
  }

  render() {
    const { classes } = this.props;
    const { boxes } = this.state;

    return (
      <div className={classes.wrapper}>
        <Paper className={classes.paper}>
          <Helmet
            title="Nové rozmístění"
          />
          <Button color="primary" onClick={this.addBox}>
            Přidat skříňku
          </Button>
          <div
            className={classNames(classes.container, { [classes.active]: this.state.active !== null || this.state.activeMapMovement })}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
            role="presentation"
          >
            {boxes.map((box, key) => (
              <div
                key={key}
                data-key={key}
                onMouseDown={this.mouseDown}
                className={classes.box}
                style={{
                  left: ((Math.round(box.x / 40) * 40) + this.state.mapOffsetX) * this.state.scale,
                  top: ((Math.round(box.y / 40) * 40) + this.state.mapOffsetY) * this.state.scale,
                  background: `hsl(${box.color}, 100%, 50%)`,
                  borderWidth: this.state.lastActive === `${key}` ? '2px' : 0,
                  transform: `scale(${this.state.scale})`,
                }}
                role="presentation"
              >
                {box.name}
              </div>
            ))}
          </div>
        </Paper>
        <Paper className={classes.toolbar}>
          lastActive: {this.state.lastActive}
          {
            this.state.lastActive !== null
            ? (
              <TextField
                label="Název skříňky"
                margin="normal"
                value={boxes[this.state.lastActive].name}
                onChange={this.changeName}
              />
            )
            : null
          }
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
