import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ZoomInIcon from 'material-ui-icons/ZoomIn';
import ZoomOutIcon from 'material-ui-icons/ZoomOut';
import TableIcon from 'material-ui-icons/Reorder';
import PrintIcon from 'material-ui-icons/Print';
import SaveIcon from 'material-ui-icons/Save';
import GridIcon from 'material-ui-icons/GridOn';
import OrderedSortIcon from 'material-ui-icons/SortByAlpha';
import RandomSortIcon from 'material-ui-icons/Shuffle';
import CenterMapIcon from 'material-ui-icons/CenterFocusStrong';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import ApplicationFrame from 'components/ApplicationFrame';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Grid from 'components/Grid';
import Frame from 'react-frame-component';
import { fromJS, OrderedMap } from 'immutable';
import classNames from 'classnames';
import Random from 'random-js';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

const injectBorder = (elem) => (props) => {
  const newProps = { ...props };
  delete newProps.children;
  return elem({ ...props, style: { ...props.style, border: 'solid 2px black', padding: '5px' } }, props.children);
};

const Th = injectBorder(React.createFactory('th'));

const Td = injectBorder(React.createFactory('td'));

class EditSchoolYear extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    updateLockers: PropTypes.func.isRequired,
    loadInitialData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
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
      lastUsedLockerId: null,
      isTable: false,
      tableShuffleSeed: null,
    };

    this.initialize();

    this.mapMove = this.mapMove.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.lockerSelect = this.lockerSelect.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.save = this.save.bind(this);
    this.wheel = this.wheel.bind(this);
    this.changeLockerOccupation = this.changeLockerOccupation.bind(this);
    this.changeLockerNote = this.changeLockerNote.bind(this);
    this.printTable = this.printTable.bind(this);
    this.showMap = this.showMap.bind(this);
    this.showTable = this.showTable.bind(this);
    this.sortTable = this.sortTable.bind(this);
    this.shuffleTable = this.shuffleTable.bind(this);
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

  changeLockerOccupation(lockerId) {
    return (event) => {
      const occupation = event.target.value;
      this.props.updateLockers(
        this.props.lockers
          .setIn([lockerId, 'occupation'], occupation)
      );
    };
  }

  changeLockerNote(lockerId) {
    return (event) => {
      const note = event.target.value;
      this.props.updateLockers(
        this.props.lockers
          .setIn([lockerId, 'note'], note)
      );
    };
  }

  clearLockers(lockers) {
    return lockers.map((locker) =>
      locker.delete('isActive')
    );
  }

  printTable() {
    window.frames.listFrame.print();
  }

  showMap() {
    this.setState((prevState) => ({
      ...prevState,
      isTable: false,
    }));
  }

  showTable() {
    this.setState((prevState) => ({
      ...prevState,
      isTable: true,
    }));
  }

  sortTable() {
    this.setState((prevState) => ({
      ...prevState,
      tableShuffleSeed: null,
    }));
  }

  shuffleTable() {
    this.setState((prevState) => ({
      ...prevState,
      tableShuffleSeed: Random.integer(0, 100000)(Random.engines.nativeMath),
    }));
  }

  render() {
    const { classes } = this.props;
    const activeLocker = this.state.lastUsedLockerId !== null && this.props.lockers.get(this.state.lastUsedLockerId)
      ? this.props.lockers.get(this.state.lastUsedLockerId).toJS()
      : null;
    const lockers = this.state.tableShuffleSeed === null
      ?
        this.props.lockers.sort((a, b) =>
          [b.get('name'), a.get('name')].sort()[0] === b.get('name') ? 1 : -1
        )
      :
        Random.shuffle(
          Random.engines.mt19937().seed(this.state.tableShuffleSeed),
          this.props.lockers.map((locker, id) => locker.set('__id', id)).toArray()
        )
        .reduce((acc, locker) =>
          acc.set(locker.get('__id'), locker.delete('__id'))
        , OrderedMap());

    return (
      <ApplicationFrame title="Upravit školní rok">
        <div className={classes.wrapper}>
          <div className={classNames(classes.leftPanel, { [classes.hideLeftPanel]: this.state.isTable })}>
            <Paper className={classes.toolbar}>
              {
                this.state.isTable
                  ? (
                    <div className={classes.toolbarContent}>
                      <Tooltip title="Zobrazit mapu" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.showMap} aria-label="Zobrazit mapu">
                          <GridIcon className={classes.toolbarIcon} />
                        </IconButton>
                      </Tooltip>
                      {
                        this.state.tableShuffleSeed === null
                          ? (
                            <Tooltip title="Seřaddit tabulku náhodně" placement="top">
                              <IconButton className={classes.toolbarIconButton} onClick={this.shuffleTable} aria-label="Seřaddit tabulku náhodně">
                                <RandomSortIcon className={classes.toolbarIcon} />
                              </IconButton>
                            </Tooltip>
                          )
                          : (
                            <Tooltip title="Seřadit tabulku podle abecedy" placement="top">
                              <IconButton className={classes.toolbarIconButton} onClick={this.sortTable} aria-label="Seřadit tabulku podle abecedy">
                                <OrderedSortIcon className={classes.toolbarIcon} />
                              </IconButton>
                            </Tooltip>
                          )
                      }
                    </div>
                  )
                  : (
                    <div className={classes.toolbarContent}>
                      <Tooltip title="Zobrazit seznam" placement="top">
                        <IconButton className={classes.toolbarIconButton} onClick={this.showTable} aria-label="Zobrazit seznam">
                          <TableIcon className={classes.toolbarIcon} />
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
                  )
              }
              <div className={classes.toolbarContent}>
                <Tooltip title="Tisk" placement="top">
                  <IconButton className={classes.toolbarIconButton} onClick={this.printTable} aria-label="Tisk">
                    <PrintIcon className={classes.toolbarIcon} />
                  </IconButton>
                </Tooltip>
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
              <Frame name="listFrame" id="listFrame" style={{ display: 'none' }}>
                <h1 style={{ textAlign: 'center' }}>
                  Seznam skříněk pro školní rok &quot;{this.props.name}&quot;
                </h1>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <Th style={{ width: '25%' }}>
                        Název skříňky
                      </Th>
                      <Th style={{ width: '37.5%' }}>
                        Žák
                      </Th>
                      <Th style={{ width: '37.5%' }}>
                        Poznámka
                      </Th>
                    </tr>
                    {
                      lockers.map((locker, id) => (
                        <tr key={id}>
                          <Td>{locker.get('name')}</Td>
                          <Td>{locker.get('occupation')}</Td>
                          <Td>{locker.get('note')}</Td>
                        </tr>
                      )).toArray()
                    }
                  </tbody>
                </table>
                <div>Dont forget this here</div>
                <div style={{ pageBreakAfter: 'always' }}>&nbsp;</div>
                <div>Dont forget this here</div>
              </Frame>
              {
                this.state.isTable
                  ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            Název skříňky
                          </TableCell>
                          <TableCell>
                            Žák
                          </TableCell>
                          <TableCell>
                            Poznámka
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          lockers.map((locker, id) => (
                            <TableRow key={id}>
                              <TableCell>
                                <Typography>
                                  {locker.get('name')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={locker.get('occupation')}
                                  onChange={this.changeLockerOccupation(id)}
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={locker.get('note')}
                                  onChange={this.changeLockerNote(id)}
                                  multiline
                                  rows={3}
                                  fullWidth
                                />
                              </TableCell>
                            </TableRow>
                          )).toArray()
                        }
                      </TableBody>
                    </Table>
                  )
                  : (
                    <Grid
                      mapOffsetX={this.state.map.get('x')}
                      mapOffsetY={this.state.map.get('y')}
                      boxes={lockers.toJS()}
                      scale={this.state.map.get('scale')}
                      onBoxSelect={this.lockerSelect}
                      onMapMove={this.mapMove}
                      disableBoxMovement
                    />
                  )
              }
            </Paper>
          </div>
          <Paper className={classNames(classes.panel, { [classes.hidePanel]: this.state.isTable })}>
            {
              activeLocker === null
              ? (
                <div>
                  <Typography variant="title" paragraph>Úprava skříňky</Typography>
                  <Typography variant="subheading" paragraph>Vyberte skříňku</Typography>
                </div>
              ) : (
                <div>
                  <Typography variant="title" paragraph>Úprava skříňky: {activeLocker.name}</Typography>
                  <Typography>
                    X: {-activeLocker.x / Grid.boxSize}<br />
                    Y: {-activeLocker.y / Grid.boxSize}
                  </Typography>
                  <TextField
                    label="Žák"
                    margin="normal"
                    value={activeLocker.occupation}
                    onChange={this.changeLockerOccupation(this.state.lastUsedLockerId)}
                  />
                  <TextField
                    margin="normal"
                    label="Poznámka"
                    value={activeLocker.note}
                    onChange={this.changeLockerNote(this.state.lastUsedLockerId)}
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
