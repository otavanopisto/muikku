const Page1 = (props) => (
  <div>
    <p>Tähän tulee ohjeita lomakkeen täyttämisestä.</p>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat. Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi tortor magna condimentum vel, placerat id blandit sit amet tortor.</p>
    <p>Mauris sed libero. Suspendisse facilisis nulla in lacinia laoreet, lorem velit accumsan velit vel mattis libero nisl et sem. Proin interdum maecenas massa turpis sagittis in, interdum non lobortis vitae massa. Quisque purus lectus, posuere eget imperdiet nec sodales id arcu. Vestibulum elit pede dictum eu, viverra non tincidunt eu ligula.</p>
    <a href="javascript:void(0)" onClick={() => {props.setPage(2);}} className="pure-button pure-button-primary" >
      Seuraava sivu
    </a>
  </div>
);

const SubjectSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Aine</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="AI">Äidinkieli</option>
      <option value="S2">Suomi toisena kielenä</option>
      <option value="ENA">Englanti, A-taso</option>
      <option value="RAA">Ranska, A-taso</option>
      <option value="ESA">Espanja, A-taso</option>
      <option value="SAA">Saksa, A-taso</option>
      <option value="VEA">Venäjä, A-taso</option>
      <option value="UE">Uskonto</option>
      <option value="ET">Elämänkatsomustieto</option>
      <option value="YO">Yhteiskuntaoppi</option>
      <option value="KE">Kemia</option>
      <option value="GE">Geologia</option>
      <option value="TT">Terveystieto</option>
      <option value="ENC">Englanti, C-taso</option>
      <option value="RAC">Ranska, C-taso</option>
      <option value="ESC">Espanja, C-taso</option>
      <option value="SAC">Saksa, C-taso</option>
      <option value="VEC">Venäjä, C-taso</option>
      <option value="ITC">Italia, C-taso</option>
      <option value="POC">Portugali, C-taso</option>
      <option value="LAC">Latina, C-taso</option>
      <option value="SMC">Saame, C-taso</option>
      <option value="RUA">Ruotsi, A-taso</option>
      <option value="RUB">Ruotsi, B-taso</option>
      <option value="PS">Psykologia</option>
      <option value="FI">Filosofia</option>
      <option value="HI">Historia</option>
      <option value="FY">Fysiikka</option>
      <option value="BI">Biologia</option>
      <option value="MAA">Matematiikka, pitkä</option>
      <option value="MAB">Matematiikka, lyhyt</option>
    </select>
  </React.Fragment>
);

const TermSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Ajankohta</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="AUTUMN2018">Syksy 2018</option>
      <option value="SPRING2019">Kevät 2019</option>
      <option value="AUTUMN2019">Syksy 2019</option>
      <option value="SPRING2020">Kevät 2020</option>
      <option value="AUTUMN2020">Syksy 2020</option>
      <option value="SPRING2021">Kevät 2021</option>
    </select>
  </React.Fragment>
);

const MandatorySelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Pakollisuus</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="true">Pakollinen</option>
      <option value="false">Valinnainen</option>
    </select>
  </React.Fragment>
);

const RepeatSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Uusiminen</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="false">Ensimmäinen suorituskerta</option>
      <option value="true">Uusinta</option>
    </select>
  </React.Fragment>
);

const GradeSelect = ({i, value, onChange}) => (
  <React.Fragment>
    {i==0 ? <label>Arvosana</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="IMPROBATUR">I (Improbatur)</option>
      <option value="APPROBATUR">A (Approbatur)</option>
      <option value="LUBENTER_APPROBATUR">B (Lubenter approbatur)</option>
      <option value="CUM_LAUDE_APPROBATUR">C (Cum laude approbatur)</option>
      <option value="MAGNA_CUM_LAUDE_APPROBATUR">M (Magna cum laude approbatur)</option>
      <option value="EXIMIA_CUM_LAUDE_APPROBATUR">E (Eximia cum laude approbatur)</option>
      <option value="LAUDATUR">L (Laudatur)</option>
      <option value="null">Ei vielä tiedossa</option>
    </select>
  </React.Fragment>
);

const Page2 = (props) => (
  <React.Fragment>
    <fieldset>
      <legend>Perustiedot</legend>
      <div className="pure-g">
        <div className="pure-u-1-2">
          <label>Nimi</label>
          <input className="pure-u-23-24" 
            type="text" 
            onChange={(e) => {props.setName(e.target.value);}}
            value={props.name}/>
        </div>
        <div className="pure-u-1-2">
          <label>Henkilötunnus</label>
          <input className="pure-u-1" 
            type="text" 
            onChange={(e) => {props.setSsn(e.target.value);}}
            value={props.ssn} />
        </div>
        <div className="pure-u-1-2">
          <label>Sähköpostiosoite</label>
          <input className="pure-u-23-24" 
            type="text" 
            onChange={(e) => {props.setEmail(e.target.value);}}
            value={props.email} />
        </div>
        <div className="pure-u-1-2">
          <label>Puhelinnumero</label>
          <input className="pure-u-1" 
            type="text" 
            onChange={(e) => {props.setPhone(e.target.value);}}
            value={props.phone} />
        </div>
        <div className="pure-u-1-1">
          <label>Osoite</label>
          <input className="pure-u-1-1" 
            type="text" 
            onChange={(e) => {props.setAddress(e.target.value);}}
            value={props.address} />
        </div>
        <div className="pure-u-1-2">
          <label>Postinumero</label>
          <input className="pure-u-23-24" 
            type="text" 
            onChange={(e) => {props.setPostalCode(e.target.value);}}
            value={props.postalCode} />
        </div>
        <div className="pure-u-1-2">
          <label>Postitoimipaikka</label>
          <input className="pure-u-1" 
            type="text" 
            onChange={(e) => {props.setCity(e.target.value);}}
            value={props.city} />
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Opiskelijatiedot</legend>
      <div>
        <div className="pure-u-1-2">
          <label>Oppijanumero</label>
          <input className="pure-u-23-24"
            type="text" 
            value="12345" />
        </div>
        <div className="pure-u-1-2">
          <label>Ohjaaja</label>
          <input className="pure-u-1"
            type="text"
            value={props.guidanceCounselor} />
        </div>

        <div className="pure-u-1-2">
          <label>Ilmoittautuminen</label>
          <select onChange={(ev) => {props.setSchoolType(ev.target.value);}}
                  value={props.enrollAs} className="pure-u-23-24">
            <option value="UPPERSECONDARY">Lukion opiskelijana</option>
            <option value="VOCATIONAL">Ammatillisten opintojen perusteella</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          { props.enrollAs === "UPPERSECONDARY" ?
          <React.Fragment>
            <label>Pakollisia kursseja suoritettuna</label>
            <input className="pure-u-1" type="text" value={props.mandatoryCourses} />
          </React.Fragment> : null }
        </div>
        {props.enrollAs === "UPPERSECONDARY" ?
          <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid red", backgroundColor: "pink"}} className="pure-u-22-24">
           Sinulla ei ole tarpeeksi pakollisia kursseja suoritettuna. Jos haluat
           silti ilmoittautua ylioppilaskokeeseen, ota yhteyttä ohjaajaan.
          </div>: null}
        <div className="pure-u-1-2">
          <label style={{paddingTop: "0.7rem"}} >Aloitan tutkinnon suorittamisen uudelleen&nbsp;
            <input type="checkbox" />
          </label>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Ilmoittaudun suorittamaan kokeen seuraavissa aineissa <b>Syksyllä 2018</b></legend>
      <div className="pure-g">
      {props.enrolledAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-4">
          <SubjectSelect i={i} value={attendance.subject} />
        </div>
        <div className="pure-u-1-4">
          <MandatorySelect i={i} value={attendance.mandatory} />
        </div>
        <div className="pure-u-1-4">
          <RepeatSelect i={i} value={attendance.repeat} />
        </div>
        <div className="pure-u-1-4">
          <button style={{marginTop: i==0 ? "1.7rem" : "0.3rem"}}  class="pure-button" onClick={() => {props.deleteEnrolledAttendance(i);}}>
            Poista
          </button>
        </div>
      </React.Fragment>
      )}
      </div>
      <button className="pure-button" onClick={props.newEnrolledAttendance}>
        Lisää uusi rivi
      </button>
    </fieldset>
    <fieldset>
      <legend>Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
      <div className="pure-g">
      {props.finishedAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-5">
          <TermSelect i={i} value={attendance.term} />
        </div>
        <div className="pure-u-1-5">
          <SubjectSelect i={i} value={attendance.subject} />
        </div>
        <div className="pure-u-1-5">
          <MandatorySelect i={i} value={attendance.mandatory} />
        </div>
        <div className="pure-u-1-5">
          <GradeSelect i={i} value={attendance.grade} />
        </div>
        <div className="pure-u-1-5">
          <button style={{marginTop: i==0 ? "1.7rem" : "0.3rem"}}  class="pure-button" onClick={() => {props.deleteFinishedAttendance(i);}}>
            Poista
          </button>
        </div>
      </React.Fragment>
      )}
      </div>
      <button className="pure-button" onClick={props.newFinishedAttendance}>
        Lisää uusi rivi
      </button>
    </fieldset>
    <fieldset>
      <legend>Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa</legend>
      <div className="pure-g">
      {props.plannedAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-4">
          <TermSelect i={i} value={attendance.term} />
        </div>
        <div className="pure-u-1-4">
          <SubjectSelect i={i} value={attendance.subject} />
        </div>
        <div className="pure-u-1-4">
          <MandatorySelect i={i} value={attendance.mandatory} />
        </div>
        <div className="pure-u-1-4">
          <button style={{marginTop: i==0 ? "1.7rem" : "0.3rem"}} class="pure-button" onClick={() => {props.deletePlannedAttendance(i);}}>
            Poista
          </button>
        </div>
      </React.Fragment>
      )}
      </div>
      <button className="pure-button" onClick={props.newPlannedAttendance}>
        Lisää uusi rivi
      </button>
    </fieldset>
    {props.conflictingAttendances ?
      <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid red", backgroundColor: "pink"}} >
      Olet valinnut aineet, jotka järjestetään samana päivänä. Jos siitä huolimatta haluat osallistua näihin aineisiin, ota yhteyttä ohjaajaan.
      </div>: null}
    <a href="javascript:void(0)" onClick={() => {props.setPage(1);}} className="pure-button" >
      Edellinen sivu
    </a>
    <a style={{marginLeft: "1rem"}} href="javascript:void(0)" onClick={() => {props.setPage(3);}} className="pure-button pure-button-primary" disabled={props.conflictingAttendances} >
      Seuraava sivu
    </a>
  </React.Fragment>
);

const Page3 = (props) => (
  <div>
    <fieldset>
      <legend>Kokeen suorittaminen</legend>
      <div className="pure-g">
        <div className="pure-u-1-2">
          <label>Suorituspaikka</label>
          <select onChange={(ev) => {props.changeLoc(ev.target.value);}}
                  value={props.location}
                  className="pure-u-23-24">
            <option>Otavan Opisto</option>
            <option>Muu</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          {props.location !== "Otavan Opisto" ?
          <React.Fragment>
            <label>&nbsp;</label>
            <input type="text" placeholder="Kirjoita tähän oppilaitoksen nimi" className="pure-u-1" />
          </React.Fragment>: null}
        </div>
        {props.location !== "Otavan Opisto" ?
          <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid burlywood", backgroundColor: "beige"}} className="pure-u-1-1">
            Jos haluat suorittaa kokeen muualla, siitä on sovittava ensin kyseisen
            oppilaitoksen kanssa.
          </div>: null}
        <div className="pure-u-1-1">
          <label>Lisätietoa ohjaajalle</label>
          <textarea rows={5} className="pure-u-1-1" />
        </div>
        <div className="pure-u-1-1">
          <label>Julkaisulupa</label>
          <select className="pure-u-1">
            <option>Haluan nimeni julkaistavan valmistujalistauksissa</option>
            <option>En halua nimeäni julkaistavan valmistujaislistauksissa</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          <label>Nimi</label>
          <input readOnly={true} className="pure-u-23-24" type="text" value="Olli Oppija" />
        </div>
        <div className="pure-u-1-2">
          <label>Päivämäärä</label>
          <input readOnly={true} className="pure-u-1" type="text" value="13.8.2018" />
        </div>
      </div>
    </fieldset>
    <a href="javascript:void(0)" onClick={() => {props.setPage(2);}} className="pure-button" >
      Edellinen sivu
    </a>
    <a style={{marginLeft: "1rem"}}
      onClick={() => {props.submit(); props.setPage(4);}}
      className="pure-button pure-button-primary">
      Hyväksy ilmoittautuminen
    </a>
  </div>
);

const Page4 = ({}) => (
  <div>
    Ilmoittautumisesi on lähetetty hyväksyttäväksi. Jos haluat peruuttaa
    ilmoittautumisesi, ota yhteyttä XXX.
  </div>
);

class App extends React.Component {

  constructor() {
    super({});
    this.state = {
      page: 1,
      name: "",
      ssn: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      nationalStudentNumber: "",
      guider: "",
      enrollAs: "UPPERSECONDARY",
      numMandatoryCourses: 0,
      location: "Otavan Opisto",
      message: "",
      studentId: 0,
      initialized: false,
      enrolledAttendances: [],
      plannedAttendances: [],
      finishedAttendances: []
    };
  }

  componentDidMount() {
    fetch("/rest/matriculation/initialData/PYRAMUS-STUDENT-4")
      .then((response) => {
        console.log("gotten response");
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log("data");
        console.log(data);
        this.setState(data);
        this.setState({initialized: true});
      });
  }

  newEnrolledAttendance() {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances.push({
      subject: "AI",
      mandatory: false,
      repeat: false,
      status: "ENROLLED"
    });
    this.setState({enrolledAttendances});
  }

  deleteEnrolledAttendance(i) {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances.splice(i, 1);
    this.setState({enrolledAttendances});
  }

  newFinishedAttendance() {
    const finishedAttendances = this.state.finishedAttendances;
    finishedAttendances.push({
      term: "SPRING2018",
      subject: "AI",
      mandatory: false,
      grade: "APPROBATUR",
      status: "FINISHED"
    });
    this.setState({finishedAttendances});
  }

  deleteFinishedAttendance(i) {
    const finishedAttendances = this.state.finishedAttendances;
    finishedAttendances.splice(i, 1);
    this.setState({finishedAttendances});
  }

  newPlannedAttendance() {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances.push({
      term: "SPRING2018",
      subject: "AI",
      mandatory: false,
      status: "PLANNED"
    });
    this.setState({plannedAttendances});
  }

  deletePlannedAttendance(i) {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances.splice(i, 1);
    this.setState({plannedAttendances});
  }

  isConflictingAttendances() {
    const conflictingGroups = [
      ['AI', 'S2'],
      ['UE', 'ET', 'YO', 'KE', 'GE', 'TT'],
      ['RUA', 'RUB'],
      ['PS', 'FI', 'HI', 'FY', 'BI'],
      ['MAA', 'MAB']
    ];
    const subjects = [];
    for (let attendance of this.state.enrolledAttendances) {
      subjects.push(attendance.subject);
    }

    for (let group of conflictingGroups) {
      for (let subject1 of subjects) {
        for (let subject2 of subjects) {
          if (subject1 !== subject2
                && group.includes(subject1)
                && group.includes(subject2)) {
              return true;
          }
        }
      }
    }

    return false;
  }

  submit() {
    fetch("/rest/matriculation/enrollments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(
        {
          name: this.state.name,
          ssn: this.state.ssn,
          email: this.state.email,
          phone: this.state.phone,
          address: this.state.address,
          postalCode: this.state.postalCode,
          city: this.state.city,
          nationalStudentNumber: this.state.nationalStudentNumber,
          guider: this.state.guider,
          enrollAs: this.state.enrollAs,
          numMandatoryCourses: this.state.numMandatoryCourses,
          location: this.state.location,
          message: this.state.message,
          studentId: this.state.studentId,
          attendances: ([
            ...this.state.enrolledAttendances,
            ...this.state.plannedAttendances,
            ...this.state.finishedAttendances
          ]).map((attendance) => ({
            subject: attendance.subject,
            mandatory: attendance.mandatory === 'true',
            repeat: attendance.repeat === 'true',
            year: attendance.term ? Number(attendance.term.substring(6)) : null,
            term: attendance.term ? attendance.term.substring(0,6) : null,
            status: attendance.status,
            grade: attendance.grade
          })),
          state: null
        }
      )
    }).then(function (response) {
      if (!response.ok) {
        this.setState({error: response.text()});
      }
    });
  }

  render() {
    if (!this.state.initialized) {
      return <React.Fragment />;
    }
    return (
      <React.Fragment>
        <div className="header">
          <a href="/">Takaisin etusivulle</a>
        </div>
        {this.state.error
          ? <div class="error">{this.state.error}</div>
          : null}
        <form className="pure-form pure-form-stacked matriculation-form" onSubmit={(e) => {e.preventDefault();}}>
          { this.state.page === 1
              ? <Page1
                setPage={(page) => {this.setState({page});}}
                />
              : null }
          { this.state.page === 2
              ? <Page2 {...this.state}
                  setName={(value) => { this.setState({name : value}); }}
                  setSsn={(value) => { this.setState({ssn : value}); }}
                  setEmail={(value) => { this.setState({email : value}); }}
                  setPhone={(value) => { this.setState({phone : value}); }}
                  setAddress={(value) => { this.setState({address : value}); }}
                  setPostalCode={(value) => { this.setState({postalCode : value}); }}
                  setCity={(value) => { this.setState({city : value}); }}
                  setNationalStudentNumber={(value) => { this.setState({nationalStudentNumber : value}); }}
                  setGuider={(value) => { this.setState({guider : value}); }}
                  setEnrollAs={(value) => { this.setState({enrollAs : value}); }}
                  setNumMandatoryCourses={(value) => { this.setState({numMandatoryCourses : value}); }}
                  enrollAs={this.state.enrollAs} 
                  setSchoolType={(enrollAs) => {this.setState({enrollAs});}}
                  setPage={(page) => {this.setState({page});}}
                  newEnrolledAttendance={() => {this.newEnrolledAttendance();}}
                  newPlannedAttendance={() => {this.newPlannedAttendance();}}
                  newFinishedAttendance={() => {this.newFinishedAttendance();}}
                  deleteEnrolledAttendance={(i) => {this.deleteEnrolledAttendance(i);}}
                  deletePlannedAttendance={(i) => {this.deletePlannedAttendance(i);}}
                  deleteFinishedAttendance={(i) => {this.deleteFinishedAttendance(i);}}
                  conflictingAttendances={this.isConflictingAttendances()}
                />
              : null }
          { this.state.page === 3
              ? <Page3 {...this.state}
                location={this.state.location} 
                setLocation={(location) => {this.setState({location});}}
                submit={() => {this.submit();}}
                setPage={(page) => {this.setState({page});}}
                />
              : null }
          { this.state.page === 4
              ? <Page4
                />
              : null }
        </form>
      </React.Fragment>
    );
  }

}

ReactDOM.render(<App />, document.getElementById("react-root"));