import React from 'react';
import PropTypes from 'prop-types';
import GridBox from 'components/GridBox';
import GridContainer from 'components/GridContainer';
import { Map, fromJS } from 'immutable';
import { WindowResizeListener } from 'react-window-resize-listener';

class Grid extends React.Component {

  static propTypes = {
    boxes: PropTypes.object,
    scale: PropTypes.number,
    disableMapMovement: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    disableBoxMovement: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    onBoxMove: PropTypes.func,
    onMapMove: PropTypes.func,
    onBoxSelect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onBoxDeselect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    scale: 1,
    onBoxMove: () => {},
    onMapMove: () => {},
    onBoxSelect: () => {},
    onBoxDeselect: () => {},
  }

  static boxSize = 40;

  constructor(props) {
    super(props);
    this.state = {
      map: fromJS({
        activeMovement: false,
        offsetX: 0,
        offsetY: 0,
      }),
      boxes: fromJS({
        activeBoxKey: null,
        activeMovement: false,
        movementOffsetX: null,
        movementOffsetY: null,
      }),
      container: fromJS({
        offsetX: 0,
        offsetY: 0,
      }),
    };

    this.mapMouseMove = this.mapMouseMove.bind(this);
    this.mapMouseDown = this.mapMouseDown.bind(this);
    this.boxMouseDown = this.boxMouseDown.bind(this);
    this.mapMouseUp = this.mapMouseUp.bind(this);
    this.bindContainer = this.bindContainer.bind(this);
    this.reloadContainerSize = this.reloadContainerSize.bind(this);
  }

  calculateMousePosition(event) {
    const isGridBox = !!event.target.dataset.boxid;

    const additonalOffsetX = isGridBox ? event.target.offsetLeft : 0;
    const additonalOffsetY = isGridBox ? event.target.offsetTop : 0;

    return {
      x: additonalOffsetX + event.nativeEvent.offsetX,
      y: additonalOffsetY + event.nativeEvent.offsetY,
    };
  }

  mapMouseDown() {
    this.setState((prevState, props) => ({
      ...prevState,
      map: prevState.map.set('activeMovement', !props.disableMapMovement),
    }));
  }

  boxMouseDown(event) {
    event.stopPropagation();
    const { offsetX, offsetY } = event.nativeEvent;
    const { boxid } = event.target.dataset;

    this.setState((prevState, props) => {
      props.onBoxSelect(boxid);
      return {
        ...prevState,
        boxes: prevState.boxes
          .set('activeBoxKey', boxid)
          .set('activeMovement', !props.disableBoxMovement)
          .set('movementOffsetX', offsetX)
          .set('movementOffsetY', offsetY),
      };
    });
  }

  mapMouseUp() {
    this.setState((prevState, props) => {
      props.onBoxDeselect(prevState.boxes.get('activeBoxKey'));
      return {
        ...prevState,
        map: prevState.map.set('activeMovement', false),
        boxes: prevState.boxes.set('activeMovement', false),
      };
    });
  }

  mapMouseMove(event) {
    event.preventDefault();

    if (this.state.map.get('activeMovement')) {
      const { movementX, movementY } = event.nativeEvent;
      const { onMapMove } = this.props;
      this.setState((prevState) => {
        const newOffsetX = prevState.map.get('offsetX') - movementX;
        const newOffsetY = prevState.map.get('offsetY') - movementY;
        onMapMove({ x: newOffsetX, y: newOffsetY });
        return {
          ...prevState,
          map: prevState.map
            .set('offsetX', newOffsetX)
            .set('offsetY', newOffsetY),
        };
      });
      return;
    }

    if (this.state.boxes.get('activeMovement')) {
      const { x, y } = this.calculateMousePosition(event);
      const { movementOffsetX, movementOffsetY } = this.state.boxes.toJS();
      const map = this.state.map.toJS();
      const container = this.state.container.toJS();
      const { scale, onBoxMove } = this.props;

      const id = this.state.boxes.get('activeBoxKey');
      onBoxMove(
        id,
        {
          x: Math.round(((x + (map.offsetX * scale)) - movementOffsetX - container.offsetX) / Grid.boxSize / scale) * Grid.boxSize,
          y: Math.round(((y + (map.offsetY * scale)) - movementOffsetY - container.offsetY) / Grid.boxSize / scale) * Grid.boxSize,
        }
      );
    }
  }

  reloadContainerSize() {
    if (!this.container) {
      return;
    }

    const { offsetX, offsetY } = this.state.container.toJS();
    const { clientWidth, clientHeight } = this.container;
    if (offsetX === clientWidth / 2 && offsetY === clientHeight / 2) {
      return;
    }

    this.setState((prevState) => ({
      ...prevState,
      container: prevState.container
        .set('offsetX', clientWidth / 2)
        .set('offsetY', clientHeight / 2),
    }));
  }

  bindContainer(container) {
    this.container = container;
    this.reloadContainerSize();
  }

  render() {
    const map = this.state.map.toJS();
    const boxes = this.state.boxes.toJS();
    const container = this.state.container.toJS();

    return (
      <div
        style={{ wdith: '100%', height: '100%' }}
        ref={this.bindContainer}
      >
        <WindowResizeListener onResize={this.reloadContainerSize} />
        <GridContainer
          onMouseDown={this.mapMouseDown}
          onMouseUp={this.mapMouseUp}
          onMouseMove={this.mapMouseMove}
          moving={boxes.activeMovement || map.activeMovement}
        >
          <GridBox
            x={(((-Grid.boxSize / 20) - map.offsetX) * this.props.scale) + container.offsetX}
            y={(((-Grid.boxSize / 20) - map.offsetY) * this.props.scale) + container.offsetY}
            color="black"
            size={Grid.boxSize / 10}
          />
          {
            Map(this.props.boxes).map((box, key) => (
              <GridBox
                key={key}
                data-boxid={key}
                active={box.isActive}
                moving={boxes.activeMovement || map.activeMovement}
                x={((box.x - map.offsetX) * this.props.scale) + container.offsetX}
                y={((box.y - map.offsetY) * this.props.scale) + container.offsetY}
                color={box.color}
                size={Grid.boxSize * this.props.scale}
                onMouseDown={this.boxMouseDown}
              >
                {box.name}
              </GridBox>
            )).toArray()
          }
        </GridContainer>
      </div>
    );
  }

}

export default Grid;
