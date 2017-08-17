import PropTypes from 'prop-types';

export default class ScreenContainer extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }
  render(){
    return <div className="screen-container screen-container-full-height">
    <div className="screen-container-wrapper">{this.props.children}</div></div>
  }
}