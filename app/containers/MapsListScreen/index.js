import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
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
import * as actions from './actions';
import styles from './styles';

const Link = styled(RawLink)`
  text-decoration: none;
`;


class MapsListScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    maps: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    maps: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: Set(),
    };

    this.removeRows = this.removeRows.bind(this);
    this.duplicateRows = this.duplicateRows.bind(this);
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

  render() {
    const { classes } = this.props;
    const { selectedRows } = this.state;
    const maps = this.props.maps.sort((a, b) =>
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );
    console.log(maps);

    return (
      <ApplicationFrame title="Seznam map">
        <div className={classes.wrapper}>
          <div className={classes.leftPanel}>
            <Paper className={classes.toolbar}>
              <div>
                {
                  this.state.selectedRows.size > 0
                  ? (
                    <div>
                      <Tooltip title="Smazat vybrané" placement="top" id="remove-maps">
                        <IconButton
                          onClick={this.removeRows}
                          aria-label="Smazat vybrané"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplikovat vybrané" placement="top" id="duplicate-maps">
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
                    <Link to="/map/create">
                      <Tooltip title="Vytvořit novou mapu" placement="top" id="create-new-map">
                        <IconButton aria-label="Vytvořit novou mapu">
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>
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
                      maps.map((map) => (
                        <TableRow
                          key={map._id}
                          data-id={map._id}
                          onClick={() => this.clickRow(map._id)}
                          role="checkbox"
                          aria-checked={selectedRows.contains(map._id)}
                          hover
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedRows.contains(map._id)} />
                          </TableCell>
                          <TableCell>
                            {map.name}
                          </TableCell>
                          <TableCell>
                            {moment(map.lastUpdate).format('D.M.YYYY HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Smazat mapu" placement="top" id="remove-map">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.removeRow(map._id);
                                }}
                                aria-label="Smazat mapu"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplikovat mapu" placement="top" id="duplicate-map">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.duplicateRow(map._id);
                                }}
                                aria-label="Duplikovat mapu"
                              >
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Upravit mapu" placement="top" id="edit-map">
                              <Link to={`/map/edit/${map._id}`}>
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  aria-label="Upravit mapu"
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
          </div>
        </div>
      </ApplicationFrame>
    );
  }

}

const withConnect = connect((state) => state.getIn(['mapsList']).toJS(), actions);

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withConnect, withStyle)(MapsListScreen);
