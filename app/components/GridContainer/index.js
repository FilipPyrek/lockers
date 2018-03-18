import PropTypes from 'prop-types';
import styled from 'styled-components';

const GridContainer = styled.div.attrs({
  style: (props) => ({
    cursor: props.moving ? 'move' : null,
  }),
})`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;


GridContainer.propTypes = {
  moving: PropTypes.bool,
};

export default GridContainer;
