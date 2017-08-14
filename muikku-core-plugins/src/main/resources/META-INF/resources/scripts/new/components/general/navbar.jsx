import PropTypes from 'prop-types';
import LanguagePicker from './navbar/language-picker.jsx';
import Menu from './navbar/menu.jsx';

export default class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.state = {
      isMenuOpen: false
    }
  }
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired,
    navbarItems: PropTypes.arrayOf(PropTypes.shape({
      classNameSuffix: PropTypes.string,
      item: PropTypes.element.isRequired
    })).isRequired,
    menuItems: PropTypes.arrayOf(PropTypes.element).isRequired,
    defaultOptions: PropTypes.arrayOf(PropTypes.element).isRequired
  }
  openMenu(){
    this.setState({
      isMenuOpen: true
    });
  }
  closeMenu(){
    this.setState({
      isMenuOpen: false
    });
  }
  render(){
    return (
            <div>
              <nav className={`navbar ${this.props.classNameExtension}`}>
                <div className="navbar-wrapper">
                  <div className="navbar-logo"></div>
            
                  <div className="navbar-items">
                    <ul className="navbar-items-container">
                      <li className={`navbar-item ${this.props.classNameExtension}-navbar-item-menu-button`}>
                        <a className="link link-icon link-full" onClick={this.openMenu}>
                          <span className="icon icon-navicon"></span>
                        </a>
                      </li>
                      {this.props.navbarItems.map((item, index)=>{
                        return (<li key={index} className={`navbar-item ${this.props.classNameExtension}-navbar-item-${item.classNameSuffix}`}>
                          {item.item}
                        </li>);
                      })}
                    </ul>
                  </div>
                  <div className="navbar-default-options">
                    <div className="navbar-default-options-container">
                      {this.props.defaultOptions}
                      <LanguagePicker classNameExtension={this.props.classNameExtension} />
                    </div>
                  </div>
                </div>
              </nav>
              <Menu open={this.state.isMenuOpen} onClose={this.closeMenu} items={this.props.menuItems}/>
            </div>
            );
  }
}