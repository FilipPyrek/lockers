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
import { withStyles } from 'material-ui/styles';
import ApplicationFrame from 'components/ApplicationFrame';
import Grid from 'components/Grid';
import { SketchPicker } from 'react-color';
import { fromJS } from 'immutable';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class EditSchoolYear extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    updateLockers: PropTypes.func.isRequired,
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
      schoolYearName: '',
      lastUsedLockerId: null,
    };

    this.initialize();

    this.mapMove = this.mapMove.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.lockerSelect = this.lockerSelect.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.save = this.save.bind(this);
    this.wheel = this.wheel.bind(this);
    this.openColorPicker = this.openColorPicker.bind(this);
    this.closeColorPicker = this.closeColorPicker.bind(this);
    this.lockerColorChange = this.lockerColorChange.bind(this);
    this.changeLockerOccupation = this.changeLockerOccupation.bind(this);
    this.changeLockerNote = this.changeLockerNote.bind(this);
  }

  initialize() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.loadInitialData(id);
    }
  }

  lockerSelect(id) {
    this.setState((prevState) => {
      this.props.updateLockers(
        this.props.lockers
          .map((locker, bid) =>
            locker.set('isActive', bid === id)
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

  zoomIn() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') * EditSchoolYear.zoomCoefficient),
    }));
  }

  zoomOut() {
    this.setState((prevState) => ({
      ...prevState,
      map: prevState.map
        .set('scale', prevState.map.get('scale') / EditSchoolYear.zoomCoefficient),
    }));
  }

  save(event) {
    event.preventDefault();

    this.props.edit(
      this.props._id,
      this.clearLockers(this.props.lockers).toJS()
    );
  }

  wheel(event) {
    if (event.nativeEvent.deltaY < 0) {
      this.zoomOut();
      return;
    }
    this.zoomIn();
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

  lockerColorChange({ hex }) {
    this.props.updateLockers(
      this.props.lockers
        .setIn([this.state.lastUsedLockerId, 'color'], hex)
    );
  }

  changeLockerOccupation(event) {
    const occupation = event.target.value;
    this.props.updateLockers(
      this.props.lockers
        .setIn([this.state.lastUsedLockerId, 'occupation'], occupation)
    );
  }

  changeLockerNote(event) {
    const note = event.target.value;
    this.props.updateLockers(
      this.props.lockers
        .setIn([this.state.lastUsedLockerId, 'note'], note)
    );
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

    return (
      <ApplicationFrame title="Upravit školního roku">
        <div className={classes.wrapper}>
          <div className={classes.leftPanel}>
            <Paper className={classes.toolbar}>
              <div className={classes.toolbarContent}>
                <Button onClick={this.zoomIn}>Přiblížit</Button>
                <Button onClick={this.zoomOut}>Oddálit</Button>
                <Button onClick={this.centerMap}>Vrátit na střed</Button>
              </div>
              <div className={classes.toolbarContent}>
                <Button color="primary" onClick={this.save}>Uložit</Button>
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
                onBoxSelect={this.lockerSelect}
                onMapMove={this.mapMove}
                disableBoxMovement
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
                    X: {activeLocker.x / Grid.boxSize}<br />
                    Y: {activeLocker.y / Grid.boxSize}
                  </Typography>
                  <TextField
                    label="Název skříňky"
                    margin="normal"
                    value={activeLocker.name}
                    onChange={() => {}}
                  />
                  <TextField
                    label="Žák"
                    margin="normal"
                    value={activeLocker.occupation}
                    onChange={this.changeLockerOccupation}
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
                  <TextField
                    margin="normal"
                    label="Poznámka"
                    value={activeLocker.note}
                    onChange={this.changeLockerNote}
                    multiline
                    rows={3}
                  />
                </div>
              )
            }
          </Paper>
        </div>
      </ApplicationFrame>
    );
  }

}

const withConnect = connect((state) => state.get('editSchoolYear').toObject(), actions);

const withReducer = injectReducer({ key: 'editSchoolYear', reducer });

const withSaga = injectSaga({ key: 'editSchoolYear', saga });

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(EditSchoolYear);
