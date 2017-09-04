import React from 'react';

export default class Title extends React.Component {
  constructor(props){
    super(props);
    
    if (props.children !== document.title){
      document.title = props.children;
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.children !== document.title){
      document.title = nextProps.children;
    }
  }
  render(){
    return null;
  }
}