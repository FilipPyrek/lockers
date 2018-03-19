import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import { SketchPicker } from 'react-color';
import Grid from 'components/Grid';
import { fromJS } from 'immutable';
import { generate } from 'randomstring';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class CreateGridScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
  }

  static zoomCoefficient = 1.1;

  constructor(props) {
    super(props);
    this.state = {
      boxes: fromJS({
        a: {
          x: 0,
          y: 0,
          color: 'red',
          name: 'A123',
          isActive: true,
        },
      }),
      map: fromJS({
        scale: 1,
        x: 0,
        y: 0,
      }),
      layoutName: '',
      isLayoutNameDialogOpen: false,
      lastUsedBoxId: null,
      isColorPickerOpen: false,
    };

    this.boxNameChange = this.boxNameChange.bind(this);
    this.boxColorChange = this.boxColorChange.bind(this);
    this.openColorPicker = this.openColorPicker.bind(this);
    this.closeColorPicker = this.closeColorPicker.bind(this);
    this.mapMove = this.mapMove.bind(this);
    this.addBox = this.addBox.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.boxMove = this.boxMove.bind(this);
    this.boxSelect = this.boxSelect.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.save = this.save.bind(this);
    this.changeLayoutName = this.changeLayoutName.bind(this);
    this.calcelLayoutNameDialog = this.calcelLayoutNameDialog.bind(this);
  }

  boxNameChange(event) {
    const newName = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes
        .setIn([prevState.lastUsedBoxId, 'name'], newName),
    }));
  }

  boxColorChange({ hex }) {
    this.setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes
        .setIn([prevState.lastUsedBoxId, 'color'], hex),
    }));
  }

  boxMove(id, { x, y }) {
    this.setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes
        .setIn([id, 'x'], x)
        .setIn([id, 'y'], y),
    }));
  }

  boxSelect(id) {
    this.setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes
        .map((box, bid) =>
          box.set('isActive', bid === id)
            .set('name', box.get('name').trim())
        ),
      lastUsedBoxId: id,
    }));
  }

  mapMove({ x, y }) {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('x', x)
        .set('y', y),
    }));
  }

  centerMap() {
    this.mapMove({ x: 0, y: 0 });
  }

  openColorPicker() {
    this.setState((prevState) => ({
      ...prevState,
      isColorPickerOpen: true,
    }));
  }

  closeColorPicker() {
    this.setState((prevState) => ({
      ...prevState,
      isColorPickerOpen: false,
    }));
  }

  addBox() {
    this.setState((prevState) => ({
      ...prevState,
      boxes: prevState.boxes
        .set(generate(6), fromJS({
          x: Math.round(this.state.map.get('x') / Grid.boxSize) * Grid.boxSize,
          y: Math.round(this.state.map.get('y') / Grid.boxSize) * Grid.boxSize,
          color: '#00a9ff',
          name: `S${Math.round((Math.random() * 100))}`,
          isActive: false,
        })),
    }));
  }

  zoomIn() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') * CreateGridScreen.zoomCoefficient),
    }));
  }

  zoomOut() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') / CreateGridScreen.zoomCoefficient),
    }));
  }

  save() {
    if (this.state.layoutName) {
      this.props.save(this.state.layoutName, this.state.boxes.toJS());
      this.setState((prevState) => ({
        ...prevState,
        layoutName: '',
        isLayoutNameDialogOpen: false,
      }));
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      isLayoutNameDialogOpen: true,
    }));
  }

  changeLayoutName(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      layoutName: value.trim(),
    }));
  }

  calcelLayoutNameDialog() {
    this.setState((prevState) => ({
      ...prevState,
      isLayoutNameDialogOpen: false,
    }));
  }

  render() {
    const { classes } = this.props;
    const activeBox = this.state.lastUsedBoxId !== null
      ? this.state.boxes.get(this.state.lastUsedBoxId).toJS()
      : null;

    return (
      <div className={classes.wrapper}>
        <Helmet
          title="Nové rozmístění"
        />
        <div className={classes.leftPanel}>
          <Paper className={classes.toolbar}>
            <Button color="primary" onClick={this.addBox}>Přidat skříňku</Button>
            <Button color="primary" onClick={this.zoomIn}>Přiblížit</Button>
            <Button color="primary" onClick={this.zoomOut}>Oddálit</Button>
            <Button color="primary" onClick={this.centerMap}>Vrátit na střed</Button>
            <Button color="primary" variant="raised" onClick={this.save}>Uložit</Button>
          </Paper>
          <Paper
            className={classes.grid}
            onWheel={(event) => event.nativeEvent.deltaY < 0 ? this.zoomOut() : this.zoomIn()}
          >
            <Grid
              mapOffsetX={this.state.map.get('x')}
              mapOffsetY={this.state.map.get('y')}
              boxes={this.state.boxes.toJS()}
              scale={this.state.map.get('scale')}
              onBoxMove={this.boxMove}
              onBoxSelect={this.boxSelect}
              onMapMove={this.mapMove}
            />
          </Paper>
        </div>
        <Paper className={classes.panel}>
          <Typography variant="title" paragraph>Úprava skříňky</Typography>
          {
            activeBox === null
            ? (
              <div>
                <Typography variant="subheading" paragraph>Vyberte skříňku</Typography>
              </div>
            ) : (
              <div>
                <TextField
                  label="Název skříňky"
                  margin="normal"
                  value={activeBox.name}
                  onChange={this.boxNameChange}
                />
                <TextField
                  label="Barva"
                  margin="normal"
                  value={activeBox.color}
                  onFocus={this.openColorPicker}
                  onBlur={this.closeColorPicker}
                />
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute' }}>
                    {
                      this.state.isColorPickerOpen
                      ? (
                        <SketchPicker
                          color={activeBox.color}
                          onChange={this.boxColorChange}
                        />
                      )
                      : null
                    }
                  </div>
                </div>
              </div>
            )
          }
        </Paper>
        <Dialog
          open={this.state.isLayoutNameDialogOpen}
          aria-labelledby="save-dialog-title"
        >
          <DialogTitle id="save-dialog-title">Název rozložení</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Zadejte název rozložení:
            </DialogContentText>
            <TextField
              margin="dense"
              label="Název rozložení"
              value={this.state.layoutName}
              onChange={this.changeLayoutName}
              autoFocus
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.calcelLayoutNameDialog} color="primary">
              Zrušit
            </Button>
            <Button onClick={this.save} color="primary" disabled={!this.state.layoutName}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

}

const withConnect = connect(null, actions);

const withReducer = injectReducer({ key: 'createGrid', reducer });

const withSaga = injectSaga({ key: 'createGrid', saga });

const withStyle = withStyles(styles);

export default compose(withStyle, withReducer, withSaga, withConnect)(CreateGridScreen);
