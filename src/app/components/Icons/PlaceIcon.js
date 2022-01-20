import PlaceIcon from '@material-ui/icons/Place';

export default ({ size, color, onClick }) => (
  <PlaceIcon onClick={onClick} style={{ fontSize: size, color }} />
);
