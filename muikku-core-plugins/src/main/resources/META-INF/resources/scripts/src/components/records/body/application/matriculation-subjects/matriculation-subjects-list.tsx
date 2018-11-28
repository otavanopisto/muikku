import * as React from "react";
import mApi from '~/lib/mApi';

/**
 * Interface representing MatriculationSubjectsList component properties
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
interface MatriculationSubjectsListProps {
  initialMatriculationSubjects?: string[],
  onMatriculationSubjectsChange: (matriculationSubjects: string[]) => void
}

/**
 * Interface representing MatriculationSubjectsList component state
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
interface MatriculationSubjectsListState {
  matriculationSubjects: MatriculationSubject[]
  selectedMatriculationSubjects: string[]
  loading: boolean
}

/**
 * Interface representing matriculation subject REST model 
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
interface MatriculationSubject {
  name: string,
  value: string
}

/**
 * MatriculationSubjectsList component
 * 
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
export default class MatriculationSubjectsList extends React.Component<MatriculationSubjectsListProps, MatriculationSubjectsListState> {
  constructor(props: MatriculationSubjectsListProps){
    super(props);
    
    this.state = {
      matriculationSubjects: [],
      selectedMatriculationSubjects: [""],
      loading: false
    }
  }
  
  /**
   * Method for notifying about matriculation subject changes 
   * 
   * Method filters out empty values from input array
   * 
   * @param selectedSubjects selected subjects
   */
  notifyMatriculationSubjectChange(selectedSubjects: string[]) {
    this.props.onMatriculationSubjectsChange(selectedSubjects.filter((selectedSubject) => {
      return !!selectedSubject;
    }));
  }

  /**
   * Event handler for matriculation subject change
   * 
   * @param index list index
   * @param e event 
   */
  handleMatriculationSubjectChange(index: number, e: React.ChangeEvent<HTMLInputElement> ) {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects[index] = e.target.value;

    this.setState({
      selectedMatriculationSubjects: selectedSubjects
    });
    
    this.notifyMatriculationSubjectChange(selectedSubjects);
  }

  /**
   * Event handler for handling matriculation subject removals
   * 
   * @param index index number
   */
  handleMatriculationSubjectRemove(index: number) {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects.splice(index, 1);

    this.setState({
      selectedMatriculationSubjects: selectedSubjects
    });

    this.notifyMatriculationSubjectChange(selectedSubjects);
  }

  /**
   * Event handler for handling matriculation subject additions
   */
  handleMatriculationSubjectAdd() {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects.push("");

    this.setState({
      selectedMatriculationSubjects: selectedSubjects
    });
  }

  /**
   * Component did mount life-cycle method  
   * 
   * Reads available matriculation subjects from REST API
   */
  componentDidMount() {
    if (!this.state.loading) {
      this.setState({
        loading: true
      });

      mApi().records.matriculationSubjects.read()
        .callback((err: Error, matriculationSubjects: MatriculationSubject[])=>{
          if (!err) {
            this.setState({
              matriculationSubjects: matriculationSubjects,
              loading: false,
              selectedMatriculationSubjects: this.props.initialMatriculationSubjects || [""]
            });
          }
        });
    }
  }

  /**
   * Component render method  
   * 
   * Renders component
   */
  render(){
    if (this.state.loading) {
      return (<div className="loader">Ladataan...</div>);
    }

    const matriculationSubjectInputs = this.state.selectedMatriculationSubjects.map((subject: string, index: number) => {
      return (
        <div>
          <select className="form-element__select form-element__select--hops-selector" value={subject} onChange={this.handleMatriculationSubjectChange.bind( this, index )}>
            <option disabled value="">Valitse...</option>
            {this.state.matriculationSubjects.map(( subject: MatriculationSubject, index: number ) => {
              return <option key={index} value={subject.value}>{subject.name}</option>
            })}
          </select>
          <button onClick={this.handleMatriculationSubjectRemove.bind(this, index)}>Poista</button>
        </div>
      );
    });

    return (
      <div>
        {matriculationSubjectInputs}
        <button onClick={this.handleMatriculationSubjectAdd.bind(this)}>Lisää</button>
      </div>
    );
  }
}