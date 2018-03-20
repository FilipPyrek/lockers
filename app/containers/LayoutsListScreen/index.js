import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
// import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui-icons/Refresh';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';
import { withStyles } from 'material-ui/styles';
import { Link as RawLink } from 'react-router-dom';
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
    layouts: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: Set(),
    };

    this.removeRows = this.removeRows.bind(this);
  }

  componentWillMount() {
    this.props.load();
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
  }

  removeRows() {
    this.props.remove(
      this.state.selectedRows.toArray()
    );
  }

  render() {
    const { classes, layouts = [] } = this.props;
    const { selectedRows } = this.state;

    return (
      <div className={classes.wrapper}>
        <Helmet
          title="Seznam rozmístění"
        />
        <div className={classes.leftPanel}>
          <Paper className={classes.toolbar}>
            <div>
              {
                this.state.selectedRows.size > 0
                ? (
                  <Tooltip title="Smazat" placement="top" id="create-new-layout">
                    <IconButton
                      onClick={this.removeRows}
                      aria-label="Vytvořit nové rozložení"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
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
                  <TableCell>Datum vytvoření</TableCell>
                  <TableCell>Akce</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
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
                        {moment(layout.creationDate).format('D.M.YYYY HH:mm')}
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
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }

}

const withConnect = connect((state) => state.getIn(['listLayouts']).toJS(), actions);

const withReducer = injectReducer({ key: 'listLayouts', reducer });

const withSaga = injectSaga({ key: 'listLayouts', saga });

const withStyle = withStyles(styles);

export default compose(withStyle, withReducer, withSaga, withConnect)(LayoutsListScreen);
