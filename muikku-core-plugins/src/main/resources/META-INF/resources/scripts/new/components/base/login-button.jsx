//TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

import PropTypes from 'prop-types';
import Link from '../general/link.jsx';

class LoginButton extends React.Component {
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired
  }
  constructor(props){
    super(props);
    
    this.login = this.login.bind(this);
  }
  login(){
    //TODO please let's find a better way to do this rather than the emulated way
    window.location.replace($("#login").attr("href"));
  }
  render(){
    return (<Link className={`${this.props.classNameExtension} button ${this.props.classNameExtension}-button-login`} onClick={this.login}>
      <span>{this.props.i18n.text.get('plugin.login.buttonLabel')}</span>
    </Link>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton);