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
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import ApplicationFrame from 'components/ApplicationFrame';
import Grid from 'components/Grid';
import { fromJS } from 'immutable';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';

class EditSchoolYear extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    updateBoxes: PropTypes.func.isRequired,
    loadInitialData: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    boxes: PropTypes.object,
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
      layoutName: '',
      isLayoutNameDialogOpen: false,
      lastUsedBoxId: null,
      isColorPickerOpen: false,
    };

    this.initialize();

    this.mapMove = this.mapMove.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.boxSelect = this.boxSelect.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.save = this.save.bind(this);
    this.cancelLayoutNameDialog = this.cancelLayoutNameDialog.bind(this);
    this.wheel = this.wheel.bind(this);
  }

  initialize() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.loadInitialData(id);
    }
  }

  boxSelect(id) {
    this.setState((prevState) => {
      this.props.updateBoxes(
        this.props.boxes
          .map((box, bid) =>
            box.set('isActive', bid === id)
              .set('name', box.get('name').trim())
          )
      );

      return {
        ...prevState,
        lastUsedBoxId: id,
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

    if (this.props._id) {
      this.props.edit(this.props._id, this.props.boxes.toJS());
      return;
    }

    if (this.state.layoutName) {
      this.props.save(this.state.layoutName, this.props.boxes.toJS());
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

  cancelLayoutNameDialog() {
    this.setState((prevState) => ({
      ...prevState,
      isLayoutNameDialogOpen: false,
    }));
  }

  wheel(event) {
    if (event.nativeEvent.deltaY < 0) {
      this.zoomOut();
      return;
    }
    this.zoomIn();
  }

  render() {
    const { classes } = this.props;
    const activeBox = this.state.lastUsedBoxId !== null && this.props.boxes.get(this.state.lastUsedBoxId)
      ? this.props.boxes.get(this.state.lastUsedBoxId).toJS()
      : null;
    const isEdit = !!this.props.match.params.id;

    return (
      <ApplicationFrame title={isEdit ? 'Upravit školního roku' : 'Vytvoření školního roku'} >
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
                boxes={this.props.boxes.toJS()}
                scale={this.state.map.get('scale')}
                onBoxSelect={this.boxSelect}
                onMapMove={this.mapMove}
                disableBoxMovement
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
                  <Typography>
                    X: {activeBox.x / Grid.boxSize}<br />
                    Y: {activeBox.y / Grid.boxSize}
                  </Typography>
                  <TextField
                    label="Název skříňky"
                    margin="normal"
                    value={activeBox.name}
                    onChange={() => {}}
                  />
                </div>
              )
            }
          </Paper>
          <Dialog
            open={this.state.isLayoutNameDialogOpen}
            onClose={this.cancelLayoutNameDialog}
            aria-labelledby="save-dialog-title"
          >
            <form onSubmit={this.save}>
              <DialogTitle id="save-dialog-title">Název rozložení</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Zadejte školní rok:
                </DialogContentText>
                <TextField
                  margin="dense"
                  label="Školní rok"
                  value={this.state.layoutName}
                  onChange={this.changeLayoutName}
                  autoFocus
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.cancelLayoutNameDialog} color="primary">
                  Zrušit
                </Button>
                <Button type="submit" color="primary" disabled={!this.state.layoutName}>
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

const withConnect = connect((state) => state.get('EditSchoolYear').toObject(), actions);

const withReducer = injectReducer({ key: 'EditSchoolYear', reducer });

const withSaga = injectSaga({ key: 'EditSchoolYear', saga });

const withStyle = withStyles(styles, { withTheme: true });

export default compose(withStyle, withReducer, withSaga, withConnect)(EditSchoolYear);
