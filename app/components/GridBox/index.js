import PropTypes from 'prop-types';
import styled from 'styled-components';

const GridBox = styled.div.attrs({
  style: (props) => ({
    backgroundColor: props.color,
    top: `${props.y}px`,
    left: `${props.x}px`,
    borderWidth: props.active ? `${props.size / 20}px` : 0,
    width: `${props.size}px`,
    height: `${props.size}px`,
    lineHeight: `${props.size}px`,
    fontSize: `${props.size / 2.85714286}px`,
  }),
})`
  position: absolute;
  border: solid black;
  box-sizing: border-box;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
`;


GridBox.propTypes = {
  color: PropTypes.string.isRequired,
  active: PropTypes.bool,
  size: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default GridBox;
