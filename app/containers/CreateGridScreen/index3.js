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
      activeOffsetX: 0,
      activeOffsetY: 0,
      lastActive: null,
      activeMapMovement: false,
      mapOffsetX: 0,
      mapOffsetY: 0,
      mapWidth: 0,
      mapHeight: 0,
      scale: 1,
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
      activeOffsetX: event.nativeEvent.offsetX,
      activeOffsetY: event.nativeEvent.offsetY,
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

    const { offsetX, offsetY } = event;
    const isBox = !!event.target.dataset.key;

    const additionX = isBox ? event.target.offsetLeft : 0;
    const additionY = isBox ? event.target.offsetTop : 0;

    const x = Math.round((offsetX + additionX - this.state.activeOffsetX - this.state.mapOffsetX * this.state.scale - this.state.mapWidth / 2) / this.state.scale / 40) * 40;
    const y = Math.round((offsetY + additionY - this.state.activeOffsetY - this.state.mapOffsetY * this.state.scale - this.state.mapHeight / 2) / this.state.scale / 40) * 40;

    if (this.state.active === null) {
      return;
    }
    const boxes = [...this.state.boxes];
    boxes[this.state.active].x = x;
    boxes[this.state.active].y = y;

    this.setState({
      ...this.state,
      boxes,
    });
  }

  addBox() {
    const boxes = [...this.state.boxes];
    const key = -1 + boxes.push({
      name: `${Math.round(Math.random() * 100)}`,
      x: Math.round((-this.state.mapOffsetX * this.state.scale) / 40) * 40,
      y: Math.round((-this.state.mapOffsetY * this.state.scale) / 40) * 40,
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
          <Button color="primary" onClick={() => this.setState({ ...this.state, scale: this.state.scale * 1.1 })}>
            +
          </Button>
          <Button color="primary" onClick={() => this.setState({ ...this.state, scale: this.state.scale / 1.1 })}>
            -
          </Button>
          <div
            className={classNames(classes.container, { [classes.active]: this.state.active !== null || this.state.activeMapMovement })}
            onMouseDown={this.mouseDown}
            onMouseUp={this.mouseUp}
            onMouseMove={this.mouseMove}
            role="presentation"
            ref={(div) => div && (div.clientWidth !== this.state.mapWidth || div.clientHeight !== this.state.mapHeight) ? this.setState({ ...this.state, mapWidth: div.clientWidth, mapHeight: div.clientHeight }) : null}
          >
            {boxes.map((box, key) => (
              <div
                key={key}
                data-key={key}
                onMouseDown={this.mouseDown}
                className={classes.box}
                style={{
                  left: (box.x + this.state.mapOffsetX) * this.state.scale + this.state.mapWidth / 2,
                  top: (box.y + this.state.mapOffsetY) * this.state.scale + this.state.mapHeight / 2,
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
