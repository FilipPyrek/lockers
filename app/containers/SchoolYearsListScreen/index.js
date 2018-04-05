import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import CopyIcon from 'material-ui-icons/ContentCopy';
import EditIcon from 'material-ui-icons/Edit';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { Link as RawLink } from 'react-router-dom';
import ApplicationFrame from 'components/ApplicationFrame';
import moment from 'moment';
import { Set } from 'immutable';
import { load as loadLayoutsList } from 'containers/LayoutsListScreen/actions';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

const Link = styled(RawLink)`
  text-decoration: none;
`;


class SchoolYearsListScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    loadLayoutsList: PropTypes.func.isRequired,
    create: PropTypes.func.isRequired,
    layoutsList: PropTypes.array,
    schoolYears: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    schoolYears: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: Set(),
      isDialogOpen: false,
      selectedLayout: '_',
      schoolYearName: '',
    };

    this.removeRows = this.removeRows.bind(this);
    this.duplicateRows = this.duplicateRows.bind(this);
    this.selectLayout = this.selectLayout.bind(this);
    this.createSchoolYear = this.createSchoolYear.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.changeSchoolYearName = this.changeSchoolYearName.bind(this);
  }

  componentWillMount() {
    this.props.load();
  }

  resetSelectedRows() {
    this.setState((prevState) => ({
      ...prevState,
      selectedRows: Set(),
    }));
  }

  clickRow(id) {
    this.setState((prevState) => ({
      ...prevState,
      selectedRows: prevState.selectedRows
        .includes(id)
          ? prevState.selectedRows.remove(id)
          : prevState.selectedRows.add(id),
    }));
  }

  removeRow(id) {
    this.props.remove([id]);
    this.resetSelectedRows();
  }

  removeRows() {
    this.props.remove(
      this.state.selectedRows.toArray()
    );
    this.resetSelectedRows();
  }

  duplicateRow(id) {
    this.props.duplicate([id]);
    this.resetSelectedRows();
  }

  duplicateRows() {
    this.props.duplicate(
      this.state.selectedRows.toArray()
    );
    this.resetSelectedRows();
  }

  openDialog() {
    this.props.loadLayoutsList();
    this.setState((prevState) => ({
      ...prevState,
      isDialogOpen: true,
    }));
  }

  closeDialog() {
    this.setState((prevState) => ({
      ...prevState,
      selectedLayout: '_',
      schoolYearName: '',
      isDialogOpen: false,
    }));
  }

  changeSchoolYearName(event) {
    const schoolYearName = event.target.value;
    this.setState((prevState) => ({
      ...prevState,
      schoolYearName,
    }));
  }

  selectLayout(event) {
    this.setState((prevState) => ({
      ...prevState,
      selectedLayout: event.target.value,
    }));
  }

  canCreateSchoolYear() {
    return this.state.selectedLayout !== '_' && !!this.state.schoolYearName;
  }

  createSchoolYear(event) {
    event.preventDefault();
    if (!this.canCreateSchoolYear()) {
      return;
    }
    this.props.create(this.state.selectedLayout, this.state.schoolYearName);
    this.closeDialog();
  }

  render() {
    const { classes } = this.props;
    const { selectedRows } = this.state;
    const schoolYears = this.props.schoolYears.sort((a, b) =>
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );
    const layouts = this.props.layoutsList.sort((a, b) =>
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );

    return (
      <ApplicationFrame title="Seznam školních roků">
        <div className={classes.wrapper}>
          <div className={classes.leftPanel}>
            <Paper className={classes.toolbar}>
              <div>
                {
                  this.state.selectedRows.size > 0
                  ? (
                    <div>
                      <Tooltip title="Smazat vybrané" placement="top" id="remove-school-year">
                        <IconButton
                          onClick={this.removeRows}
                          aria-label="Smazat vybrané"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplikovat vybrané" placement="top" id="duplicate-school-year">
                        <IconButton
                          onClick={this.duplicateRows}
                          aria-label="Duplikovat vybrané"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
                  : (
                    <Tooltip title="Vytvořit nový školní rok" placement="top" id="create-new-school-year">
                      <IconButton
                        onClick={this.openDialog}
                        aria-label="Vytvořit nový školní rok"
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
              </div>
              <div>
                <Tooltip title="Obnovit" placement="top" id="refresh">
                  <IconButton onClick={this.props.load} aria-label="Obnovit">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
            <Paper className={classes.grid}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Vybráno</TableCell>
                    <TableCell>Název</TableCell>
                    <TableCell>Datum posledn úpravy</TableCell>
                    <TableCell>Akce</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.props.error
                    ? (
                      <TableRow>
                        <TableCell colSpan="4">
                          <Typography align="center" color="error">
                            Chyba: <span />
                            {
                              typeof this.props.error === 'string'
                                ? this.props.error
                                : JSON.stringify(this.props.error)
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null
                  }
                  {
                    this.props.loading
                    ? (
                      <TableRow>
                        <TableCell colSpan="4">
                          <Typography align="center">
                            Načítání...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      schoolYears.map((schoolYear) => (
                        <TableRow
                          key={schoolYear._id}
                          data-id={schoolYear._id}
                          onClick={() => this.clickRow(schoolYear._id)}
                          role="checkbox"
                          aria-checked={selectedRows.contains(schoolYear._id)}
                          hover
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedRows.contains(schoolYear._id)} />
                          </TableCell>
                          <TableCell>
                            {schoolYear.name}
                          </TableCell>
                          <TableCell>
                            {moment(schoolYear.lastUpdate).format('D.M.YYYY HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Smazat školní rok" placement="top" id="remove-school-year">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.removeRow(schoolYear._id);
                                }}
                                aria-label="Smazat školní rok"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplikovat školní rok" placement="top" id="duplicate-school-year">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.duplicateRow(schoolYear._id);
                                }}
                                aria-label="Duplikovat školní rok"
                              >
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Upravit školní rok" placement="top" id="edit-school-year">
                              <Link to={`/school-year/edit/${schoolYear._id}`}>
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  aria-label="Upravit školní rok"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Link>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  }
                </TableBody>
              </Table>
            </Paper>
            <Dialog
              open={this.state.isDialogOpen}
              onClose={this.closeDialog}
              fullWidth
              aria-labelledby="create-school-year"
            >
              <form onSubmit={this.createSchoolYear}>
                <DialogTitle id="create-school-year">Vytvořit školní rok</DialogTitle>
                <DialogContent>
                  <TextField
                    margin="normal"
                    label="Název školního roku"
                    placeholder="2064/2065"
                    value={this.state.schoolYearName}
                    onChange={this.changeSchoolYearName}
                    autoFocus
                    fullWidth
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      value={this.state.selectedLayout}
                      onChange={this.selectLayout}
                    >
                      <MenuItem value="_">
                        <em>Zvolte mapu - šablonu</em>
                      </MenuItem>
                      {
                        layouts.map((layout) => (
                          <MenuItem
                            key={layout._id}
                            value={layout._id}
                          >
                            {layout.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.closeDialog} color="primary">
                    Zrušit
                  </Button>
                  <Button type="submit" color="primary" disabled={!this.canCreateSchoolYear()}>
                    OK
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </div>
        </div>
      </ApplicationFrame>
    );
  }

}

const withConnect = connect((state) =>
    state.getIn(['schoolYearsList'])
      .set('layoutsList', state.getIn(['layoutsList', 'layouts']))
      .toJS()
, { ...actions, loadLayoutsList });

const withReducer = injectReducer({ key: 'schoolYearsList', reducer });

const withSaga = injectSaga({ key: 'schoolYearsList', saga });

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(SchoolYearsListScreen);
