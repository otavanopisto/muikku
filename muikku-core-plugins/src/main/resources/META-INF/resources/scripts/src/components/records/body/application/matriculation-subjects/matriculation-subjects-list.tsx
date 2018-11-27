import * as React from "react";
import mApi from '~/lib/mApi';

interface MatriculationSubjectsListProps {
  onMatriculationSubjectsChange: (matriculationSubjects: string[]) => void
}

interface MatriculationSubjectsListState {
  matriculationSubjects: MatriculationSubject[]
  selectedMatriculationSubjects: string[]
  loading: boolean
}

interface MatriculationSubject {
  name: string,
  value: string
}

export default class MatriculationSubjectsList extends React.Component<MatriculationSubjectsListProps, MatriculationSubjectsListState> {
  constructor(props: MatriculationSubjectsListProps){
    super(props);
    
    this.state = {
      matriculationSubjects: [],
      selectedMatriculationSubjects: [""],
      loading: false
    }
  }

  handleMatriculationSubjectChange( index: number, e: React.ChangeEvent<HTMLInputElement> ) {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects[index] = e.target.value;

    this.setState({
      selectedMatriculationSubjects: selectedSubjects
    });
    
    this.props.onMatriculationSubjectsChange(selectedSubjects);
  }

  handleMatriculationSubjectRemove(index: number) {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects.splice(index, 1);

    this.setState({
      selectedMatriculationSubjects: selectedSubjects
    });

    this.props.onMatriculationSubjectsChange(selectedSubjects);
  }

  handleMatriculationSubjectAdd() {
    const selectedSubjects = [...this.state.selectedMatriculationSubjects];
    selectedSubjects.push("");

    this.setState({
      selectedMatriculationSubjects: selectedSubjects
    });
  }

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
              loading: false
            });
          }
        });
    }
  }

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