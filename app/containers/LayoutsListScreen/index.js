import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
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
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

const Link = styled(RawLink)`
  text-decoration: none;
`;


class LayoutsListScreen extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    duplicate: PropTypes.func.isRequired,
    layouts: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    layouts: [],
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
    const layouts = this.props.layouts.sort((a, b) =>
      new Date(b.lastUpdate) - new Date(a.lastUpdate)
    );

    return (
      <ApplicationFrame title="Seznam rozložení">
        <div className={classes.wrapper}>
          <div className={classes.leftPanel}>
            <Paper className={classes.toolbar}>
              <div>
                {
                  this.state.selectedRows.size > 0
                  ? (
                    <div>
                      <Tooltip title="Smazat vybrané" placement="top" id="create-new-layout">
                        <IconButton
                          onClick={this.removeRows}
                          aria-label="Smazat vybrané"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplikovat rozložení" placement="top" id="create-new-layout">
                        <IconButton
                          onClick={this.duplicateRows}
                          aria-label="Duplikovat rozložení"
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )
                  : (
                    <Link to="/layouts/create">
                      <Tooltip title="Vytvořit nové rozložení" placement="top" id="create-new-layout">
                        <IconButton aria-label="Vytvořit nové rozložení">
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  )
                }
              </div>
              <div>
                <Tooltip title="Obnovit" placement="top" id="create-new-layout">
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
                      layouts.map((layout) => (
                        <TableRow
                          key={layout._id}
                          data-id={layout._id}
                          onClick={() => this.clickRow(layout._id)}
                          role="checkbox"
                          aria-checked={selectedRows.contains(layout._id)}
                          hover
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedRows.contains(layout._id)} />
                          </TableCell>
                          <TableCell>
                            {layout.name}
                          </TableCell>
                          <TableCell>
                            {moment(layout.lastUpdate).format('D.M.YYYY HH:mm')}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Smazat" placement="top" id="create-new-layout">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.removeRow(layout._id);
                                }}
                                aria-label="Vytvořit nové rozložení"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Duplikovat rozložení" placement="top" id="create-new-layout">
                              <IconButton
                                onClick={(event) => {
                                  event.stopPropagation();
                                  this.duplicateRow(layout._id);
                                }}
                                aria-label="Duplikovat rozložení"
                              >
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Upravit rozložení" placement="top" id="create-new-layout">
                              <Link to={`/layouts/edit/${layout._id}`}>
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  aria-label="Upravit rozložení"
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

const withConnect = connect((state) => state.getIn(['listLayouts']).toJS(), actions);

const withReducer = injectReducer({ key: 'listLayouts', reducer });

const withSaga = injectSaga({ key: 'listLayouts', saga });

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(LayoutsListScreen);
