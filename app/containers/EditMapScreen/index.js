import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import ZoomInIcon from 'material-ui-icons/ZoomIn';
import ZoomOutIcon from 'material-ui-icons/ZoomOut';
import SaveIcon from 'material-ui-icons/Save';
import AddIcon from 'material-ui-icons/Add';
import CenterMapIcon from 'material-ui-icons/CenterFocusStrong';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { SketchPicker } from 'react-color';
import ApplicationFrame from 'components/ApplicationFrame';
import Grid from 'components/Grid';
import { fromJS } from 'immutable';
import { generate } from 'randomstring';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class EditMapScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    updateLockers: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    loadInitialData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    lockers: PropTypes.object,
    _id: PropTypes.string,
  }

  static zoomCoefficient = 1.1;

  constructor(props) {
    super(props);
    this.state = {
      map: fromJS({
        scale: 1,
        x: 0,
        y: 0,
      }),
      mapName: '',
      isMapNameDialogOpen: false,
      lastUsedLockerId: null,
      isColorPickerOpen: false,
    };

    this.lockerNameChange = this.lockerNameChange.bind(this);
    this.lockerColorChange = this.lockerColorChange.bind(this);
    this.lockerRemove = this.lockerRemove.bind(this);
    this.openColorPicker = this.openColorPicker.bind(this);
    this.closeColorPicker = this.closeColorPicker.bind(this);
    this.mapMove = this.mapMove.bind(this);
    this.addLocker = this.addLocker.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.lockerMove = this.lockerMove.bind(this);
    this.lockerSelect = this.lockerSelect.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.save = this.save.bind(this);
    this.changeMapName = this.changeMapName.bind(this);
    this.cancelMapNameDialog = this.cancelMapNameDialog.bind(this);
    this.wheel = this.wheel.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  initialize() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.loadInitialData(id);
      return;
    }
    this.props.reset();
  }

  lockerNameChange(event) {
    const newName = event.target.value;
    this.props.updateLockers(
      this.props.lockers
        .setIn([this.state.lastUsedLockerId, 'name'], newName)
    );
  }

  lockerColorChange({ hex }) {
    this.props.updateLockers(
      this.props.lockers
        .setIn([this.state.lastUsedLockerId, 'color'], hex)
    );
  }

  lockerRemove() {
    this.setState((prevState) => {
      this.props.updateLockers(
        this.props.lockers
          .delete(this.state.lastUsedLockerId)
      );

      return {
        ...prevState,
        lastUsedLockerId: null,
      };
    });
  }

  lockerMove(id, { x, y }) {
    this.props.updateLockers(
      this.props.lockers
        .setIn([id, 'x'], x)
        .setIn([id, 'y'], y),
    );
  }

  lockerSelect(id) {
    this.setState((prevState) => {
      this.props.updateLockers(
        this.props.lockers
          .map((locker, lid) =>
            locker.set('isActive', lid === id)
              .set('name', locker.get('name').trim())
          )
      );

      return {
        ...prevState,
        lastUsedLockerId: id,
      };
    });
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

  addLocker() {
    const lockerId = generate(6);
    this.setState((prevState) => {
      this.props.updateLockers(
        this.props.lockers
          .map((locker) => locker.set('isActive', false))
          .set(lockerId, fromJS({
            x: Math.round(this.state.map.get('x') / Grid.boxSize) * Grid.boxSize,
            y: Math.round(this.state.map.get('y') / Grid.boxSize) * Grid.boxSize,
            color: '#00a9ff',
            name: `S${Math.round((Math.random() * 100))}`,
            isActive: true,
          }))
      );
      return {
        ...prevState,
        lastUsedLockerId: lockerId,
      };
    });
  }

  zoomIn() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') * EditMapScreen.zoomCoefficient),
    }));
  }

  zoomOut() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') / EditMapScreen.zoomCoefficient),
    }));
  }

  save(event) {
    event.preventDefault();

    if (this.props._id) {
      this.props.edit(
        this.props._id,
        this.clearLockers(this.props.lockers).toJS()
      );
      return;
    }

    if (this.state.mapName) {
      this.props.save(
        this.state.mapName,
        this.clearLockers(this.props.lockers).toJS()
      );
      this.setState((prevState) => ({
        ...prevState,
        mapName: '',
        isMapNameDialogOpen: false,
      }));
      return;
    }
    this.setState((prevState) => ({
      ...prevState,
      isMapNameDialogOpen: true,
    }));
  }

  changeMapName(event) {
    const { value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      mapName: value,
    }));
  }

  cancelMapNameDialog() {
    this.setState((prevState) => ({
      ...prevState,
      mapName: '',
      isMapNameDialogOpen: false,
    }));
  }

  wheel(event) {
    if (event.nativeEvent.deltaY < 0) {
      this.zoomOut();
      return;
    }
    this.zoomIn();
  }

  clearLockers(lockers) {
    return lockers.map((locker) =>
      locker.delete('isActive')
    );
  }

  render() {
    const { classes } = this.props;
    const activeLocker = this.state.lastUsedLockerId !== null && this.props.lockers.get(this.state.lastUsedLockerId)
      ? this.props.lockers.get(this.state.lastUsedLockerId).toJS()
      : null;
    const isEdit = !!this.props.match.params.id;

    return (
      <ApplicationFrame title={isEdit ? 'Upravit mapu' : 'Vytvořit mapu'} >
        <div className={classes.wrapper}>
          <div className={classes.leftPanel}>
            <Paper className={classes.toolbar}>
              <div className={classes.toolbarContent}>
                <Tooltip title="Přidat skříňku" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.addLocker} aria-label="Přidat skříňku">
                    <AddIcon className={classes.toolbarIcon} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Přiblížit" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.zoomIn} aria-label="Přiblížit">
                    <ZoomInIcon className={classes.toolbarIcon} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Oddálit" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.zoomOut} aria-label="Oddálit">
                    <ZoomOutIcon className={classes.toolbarIcon} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Vrátit mapu na střed" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.centerMap} aria-label="Vrátit mapu na střed">
                    <CenterMapIcon className={classes.toolbarIcon} />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={classes.toolbarContent}>
                <Tooltip title="Uložit" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.save} aria-label="Uložit">
                    <SaveIcon className={classes.toolbarIcon} color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
            <Paper
              className={classes.grid}
              onWheel={this.wheel}
            >
              <Grid
                mapOffsetX={this.state.map.get('x')}
                mapOffsetY={this.state.map.get('y')}
                boxes={this.props.lockers.toJS()}
                scale={this.state.map.get('scale')}
                onBoxMove={this.lockerMove}
                onBoxSelect={this.lockerSelect}
                onMapMove={this.mapMove}
              />
            </Paper>
          </div>
          <Paper className={classes.panel}>
            <Typography variant="title" paragraph>Úprava skříňky</Typography>
            {
              activeLocker === null
              ? (
                <div>
                  <Typography variant="subheading" paragraph>Vyberte skříňku</Typography>
                </div>
              ) : (
                <div>
                  <Typography>
                    X: {-activeLocker.x / Grid.boxSize}<br />
                    Y: {-activeLocker.y / Grid.boxSize}
                  </Typography>
                  <TextField
                    label="Název skříňky"
                    margin="normal"
                    value={activeLocker.name}
                    onChange={this.lockerNameChange}
                  />
                  <TextField
                    label="Barva"
                    margin="normal"
                    value={activeLocker.color}
                    onFocus={this.openColorPicker}
                    onBlur={this.closeColorPicker}
                  />
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', zIndex: '999999' }}>
                      {
                        this.state.isColorPickerOpen
                        ? (
                          <SketchPicker
                            color={activeLocker.color}
                            onChange={this.lockerColorChange}
                          />
                        )
                        : null
                      }
                    </div>
                  </div>
                  <Button color="primary" onClick={this.lockerRemove}>Smazat skříňku</Button>
                </div>
              )
            }
          </Paper>
          <Dialog
            open={this.state.isMapNameDialogOpen}
            onClose={this.cancelMapNameDialog}
            aria-labelledby="save-dialog-title"
          >
            <form onSubmit={this.save}>
              <DialogTitle id="save-dialog-title">Uložit mapu</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="Název mapy"
                  value={this.state.mapName}
                  onChange={this.changeMapName}
                  autoFocus
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.cancelMapNameDialog} color="primary">
                  Zrušit
                </Button>
                <Button type="submit" color="primary" disabled={!this.state.mapName}>
                  OK
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
      </ApplicationFrame>
    );
  }

}

const withConnect = connect((state) => state.get('editMap').toObject(), actions);

const withReducer = injectReducer({ key: 'editMap', reducer });

const withSaga = injectSaga({ key: 'editMap', saga });

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(EditMapScreen);
