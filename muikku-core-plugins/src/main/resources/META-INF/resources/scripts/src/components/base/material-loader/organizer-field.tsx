import * as React from "react";
import { shuffle } from "~/util/modifiers";

interface FieldType {
  name: string,
  text: string
}

interface OrganizerFieldProps {
  type: string,
  content: {
    name: string
  }
}

interface OrganizerFieldState {
  
}

export default class OrganizerField extends React.Component<OrganizerFieldProps, OrganizerFieldState> {
  constructor(props: OrganizerFieldProps){
    super(props);
    
    this.state = {

    }
  }
  componentWillReceiveProps(nextProps: OrganizerFieldProps){
    if (JSON.stringify(nextProps.content) !== JSON.stringify(this.props.content)){
      
    }
  }
  
  render(){
    return <div className="muikku-organizer-field muikku-field">
      {JSON.stringify(this.props.content)}
    </div>
  }
}