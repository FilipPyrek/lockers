import PropTypes from 'prop-types';
import styled from 'styled-components';
import parse from 'parse-color';

const GridBox = styled.div.attrs({
  style: (props) => ({
    backgroundColor: props.color,
    top: `${props.y}px`,
    left: `${props.x}px`,
    borderColor: parse(props.color).hsl[2] > 50 ? 'black' : 'white',
    borderWidth: props.active ? `${props.size / 20}px` : 0,
    width: `${props.size}px`,
    height: `${props.size}px`,
    lineHeight: `${props.size}px`,
    fontSize: `${props.size / 3.5}px`,
    cursor: props.moving ? 'move' : null,
    color: parse(props.color).hsl[2] > 50 ? 'black' : 'white',
  }),
})`
  position: absolute;
  border-style: double;
  box-sizing: border-box;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
`;


GridBox.propTypes = {
  color: PropTypes.string.isRequired,
  active: PropTypes.bool,
  moving: PropTypes.bool,
  size: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default GridBox;
