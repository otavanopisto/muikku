const WARNING_STYLE = {margin: "1rem", padding: "0.5rem", border: "1px solid red", backgroundColor: "pink"};
const ACADEMIC_SUBJECTS = ['UE', 'ET', 'YO', 'KE', 'GE', 'TT', 'PS', 'FI', 'HI', 'FY', 'BI'];
const ADVANCED_SUBJECTS = ['MAA', 'RUA', 'ENA', 'RAA', 'ESA', 'SAA', 'VEA'];
const FINNISH_SUBJECTS = ['AI', 'S2'];
const REQUIRED_FINNISH_ATTENDANCES = 1;
const REQUIRED_MANDATORY_ATTENDANCES = 4;
const REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN = 2;
const REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN = 0;
const SUBJECT_MAP = {
  "AI": "Äidinkieli",
  "S2": "Suomi toisena kielenä",
  "ENA": "Englanti, A-taso",
  "RAA": "Ranska, A-taso",
  "ESA": "Espanja, A-taso",
  "SAA": "Saksa, A-taso",
  "VEA": "Venäjä, A-taso",
  "RUA": "Ruotsi, A-taso",
  "RUB": "Ruotsi, B-taso",
  "MAA": "Matematiikka, pitkä",
  "MAB": "Matematiikka, lyhyt",
  "UE": "Uskonto",
  "ET": "Elämänkatsomustieto",
  "YO": "Yhteiskuntaoppi",
  "KE": "Kemia",
  "GE": "Maantiede",
  "TT": "Terveystieto",
  "PS": "Psykologia",
  "FI": "Filosofia",
  "HI": "Historia",
  "FY": "Fysiikka",
  "BI": "Biologia",
  "ENC": "Englanti, C-taso",
  "RAC": "Ranska, C-taso",
  "ESC": "Espanja, C-taso",
  "SAC": "Saksa, C-taso",
  "VEC": "Venäjä, C-taso",
  "ITC": "Italia, C-taso",
  "POC": "Portugali, C-taso",
  "LAC": "Latina, C-taso",
  "SMC": "Saame, C-taso"
};

const Page1 = (props) => (
  <div>
    <h1>Ylioppilaskirjoituksiin ilmoittautuminen</h1>
    <p>Ilmoittautuminen ylioppilaskirjoituksiin on nyt auki. Voit ilmoittautua yo-kirjoituksiin, jos täytät abistatuksen. Lue lisää tiedotteesta.</p>
    <p>Täytä puuttuvat tiedot huolellisesti ja tarkista lomake ennen sen lähettämistä.</p>
    <p>Ilmoittautuminen sulkeutuu</p>
    <ul>
      <li>kevään kirjoitusten osalta 20.11.</li>
      <li>syksyn kirjoitusten osalta 20.5.</li>
    </ul>
    <p>Jos sinulla on kysyttävää, ota yhteyttä Riikka Turpeiseen (riikka.turpeinen@otavia.fi).</p>
    <p><b>Ilmoittautuminen on sitova.</b></p>
    {props.enrollmentSent ?
      <div style={ WARNING_STYLE } className="pure-u-22-24">
        Olet jo ilmoittautunut ylioppilaskokeeseen. Jos haluat muokata ilmoittautumistasi,
        ota yhteyttä Riikka Turpeiseen.
      </div>: null}
    <a href="javascript:void(0)" disabled={props.enrollmentSent} onClick={() => {props.setPage(2);}} className="pure-button pure-button-primary" >
      Seuraava sivu
    </a>
  </div>
);

const SubjectSelect = ({i, value, onChange, disabledValues}) => (
  <React.Fragment>
    {i==0 ? <label>Aine</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      {
        Object.keys(SUBJECT_MAP).map((subjectCode) => {
          const subjectName = SUBJECT_MAP[subjectCode];
          const disabled = disabledValues.indexOf(subjectCode) != -1;
          return <option value={subjectCode} disabled={disabled}> { subjectName } </option>
        })
      }
    </select>
  </React.Fragment>
);

const TermSelect = ({i, value, onChange, options}) => (
  <React.Fragment>
    {i==0 ? <label>Ajankohta</label> : null}
    <select
        value={value}
        onChange={onChange}
        className="pure-u-23-24">
      <option value="">Valitse...</option>
      <React.Fragment>{options}</React.Fragment>
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
      <option value="">Valitse...</option>
      <option value="true">Pakollinen</option>
      <option value="false">Ylimääräinen</option>
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
      <option value="">Valitse...</option>
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
      <option value="UNKNOWN">Ei vielä tiedossa</option>
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
            readOnly
            type="text" 
            value={props.name}/>
        </div>
        <div className="pure-u-1-2">
          <label>Henkilötunnus</label>
          <input className="pure-u-1" 
            readOnly
            type="text" 
            value={props.ssn} />
        </div>
        <div className="pure-u-1-2">
          <label>Sähköpostiosoite</label>
          <input className="pure-u-23-24" 
            readOnly
            type="text" 
            value={props.email} />
        </div>
        <div className="pure-u-1-2">
          <label>Puhelinnumero</label>
          <input className="pure-u-1" 
            readOnly
            type="text" 
            value={props.phone} />
        </div>
        <div className="pure-u-1-1">
          <label>Osoite</label>
          <input className="pure-u-1-1" 
            readOnly
            type="text" 
            value={props.address} />
        </div>
        <div className="pure-u-1-2">
          <label>Postinumero</label>
          <input className="pure-u-23-24" 
            readOnly
            type="text" 
            value={props.postalCode} />
        </div>
        <div className="pure-u-1-2">
          <label>Postitoimipaikka</label>
          <input className="pure-u-1" 
            readOnly
            type="text" 
            value={props.locality} />
        </div>
      </div>
      <div className="pure-g">
        <div className="pure-u-1">
          <label>Jos tietosi ovat muuttuneet, ilmoita siitä tässä</label>
          <textarea
            style={{width: "100%"}}
            value={props.changedContactInfo}
            onChange={({target}) => {props.setChangedContactInfo(target.value);}} />
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Opiskelijatiedot</legend>
      <div>
        <div className="pure-u-1-1">
          <label>Ohjaaja</label>
          <input className="pure-u-1"
            type="text"
            onChange={({target}) => {props.setGuider(target.value);}}
            value={props.guider} />
        </div>

        <div className="pure-u-1-2">
          <label>Ilmoittautuminen</label>
          <select onChange={({target}) => {props.setEnrollAs(target.value);}}
                  value={props.enrollAs} className="pure-u-23-24">
            <option value="UPPERSECONDARY">Lukion opiskelijana</option>
            <option value="VOCATIONAL">Ammatillisten opintojen perusteella</option>
            <option value="UNKNOWN">Muu tausta</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          { props.enrollAs === "UPPERSECONDARY" ?
          <React.Fragment>
            <label>Pakollisia kursseja suoritettuna</label>
            <input className="pure-u-1"
                   type="number"
                   min="0"
                   onChange={({target}) => {props.setNumMandatoryCourses(target.value);}}
                   value={props.numMandatoryCourses} />
          </React.Fragment> : null }
        </div>
        {props.enrollAs === "UPPERSECONDARY" && props.numMandatoryCourses === "" ?
          <div style={ WARNING_STYLE } className="pure-u-22-24">
          Ole hyvä ja täytä suoritettujen pakollisten kurssien lukumäärä.
          </div>: null}
        {props.enrollAs === "UPPERSECONDARY" && props.numMandatoryCourses !== "" && props.numMandatoryCourses < 20 ?
          <div style={ WARNING_STYLE } className="pure-u-22-24">Sinulla ei ole tarpeeksi pakollisia kursseja suoritettuna. Tarkistamme ilmoittautumisesi ja otamme sinuun yhteyttä.</div>: null}
        <div className="pure-u-1-1">
          <label>Tutkintotyyppi</label>
          <select onChange={({target}) => {props.setDegreeType(target.value);}}
                  value={props.degreeType} className="pure-u-23-24">
            <option value="MATRICULATIONEXAMINATION">Yo-tutkinto</option>
            <option value="MATRICULATIONEXAMINATIONSUPPLEMENT">Tutkinnon korottaja tai täydentäjä</option>
            <option value="SEPARATEEXAM">Erillinen koe (ilman yo-tutkintoa)</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          <label style={{paddingTop: "0.7rem"}} >Aloitan tutkinnon suorittamisen uudelleen&nbsp;
            <input onClick={({target}) => {props.setRestartExam(target.checked);}} checked={props.restartExam} type="checkbox" />
          </label>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Ilmoittaudun suorittamaan kokeen seuraavissa aineissa <b>{ props.currentTerm ? props.currentTerm.adessive : "Virhe" }</b></legend>
      <div className="pure-g">
      {props.enrolledAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-4"
          style={(attendance.subject === "") ? {"background": "pink"} : {}}>
          <SubjectSelect
            i={i}
            value={attendance.subject}
            disabledValues={ props.enrolledSubjects.filter((subject) => { return subject != attendance.subject }) }
            onChange={({target}) => {props.modifyEnrolledAttendance(i, "subject", target.value);}}
            />
        </div>
        <div className="pure-u-1-4"
          style={(attendance.mandatory === "" || props.isConflictingMandatory(attendance)) ? {"background": "pink"} : {}}>
          <MandatorySelect
            i={i}
            value={attendance.mandatory}
            onChange={({target}) => {props.modifyEnrolledAttendance(i, "mandatory", target.value);}}
          />
        </div>
        <div className="pure-u-1-4"
          style={(attendance.repeat === "" || props.isConflictingRepeat(attendance)) ? {"background": "pink"} : {}}>
          <RepeatSelect
            i={i}
            value={attendance.repeat}
            onChange={({target}) => {props.modifyEnrolledAttendance(i, "repeat", target.value);}}
          />
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
    {props.conflictingAttendances ?
      <div style={ WARNING_STYLE } >
      Olet ilmoittautumassa kokeisiin, joita ei voi valita samanaikaisesti. Kysy tarvittaessa lisää ohjaajalta.
      </div>: null}
    <fieldset>
      <legend>Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
      <div className="pure-g">
      {props.finishedAttendances.map((attendance, i) =>
      <React.Fragment key={i}>
        <div className="pure-u-1-5">
          <TermSelect
            i={i}
            value={attendance.term} 
            options={props.pastTermOptions}
            onChange={({target}) => {props.modifyFinishedAttendance(i, "term", target.value);}}

          />
        </div>
        <div className="pure-u-1-5">
          <SubjectSelect 
            i={i} 
            value={attendance.subject}
            disabledValues={ props.finishedSubjects.filter((subject) => { return subject != attendance.subject }) }
            onChange={({target}) => {props.modifyFinishedAttendance(i, "subject", target.value);}}
          />
        </div>
        <div className="pure-u-1-5"
            style={ ( props.enrolledAttendances.filter((era) => { return (era.subject === attendance.subject) && (era.mandatory != attendance.mandatory) }).length > 0 ) ? {"background": "pink"} : {}}>
          <MandatorySelect 
            i={i} 
            value={attendance.mandatory} 
            onChange={({target}) => {props.modifyFinishedAttendance(i, "mandatory", target.value);}}
          />
        </div>
        <div className="pure-u-1-5">
          <GradeSelect 
            i={i} 
            value={attendance.grade} 
            onChange={({target}) => {props.modifyFinishedAttendance(i, "grade", target.value);}}
          />
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
          <TermSelect 
          i={i} 
          options={props.nextTermOptions}
          onChange={({target}) => {props.modifyPlannedAttendance(i, "term", target.value);}}
          value={attendance.term} 
          />
        </div>
        <div className="pure-u-1-4">
          <SubjectSelect 
            i={i} 
            onChange={({target}) => {props.modifyPlannedAttendance(i, "subject", target.value);}}
            disabledValues={ props.plannedSubjects.filter((subject) => { return subject != attendance.subject }) }
            value={attendance.subject} 
          />
        </div>
        <div className="pure-u-1-4">
          <MandatorySelect 
            i={i} 
            onChange={({target}) => {props.modifyPlannedAttendance(i, "mandatory", target.value);}}
            value={attendance.mandatory} 
          />
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
    {props.incompleteAttendances ?
      <div style={ WARNING_STYLE } className="pure-u-22-24">
      Ole hyvä ja täytä kaikki rivit
      </div>: null}
        
    {
      props.mandatoryConflicts ?
      <div style={ WARNING_STYLE } className="pure-u-22-24">
        Ainetta uusittaessa pakollisuustiedon on oltava sama kuin aiemmalla suorituskerralla
      </div>: null
    }

    {
      props.conflictingRepeats ?
      <div style={ WARNING_STYLE } className="pure-u-22-24">
        Aine on merkittävä uusittavaksi, kun siitä on aiempi suorituskerta
      </div>: null
    }
    
    {
      props.amountOfFinnishAttendances == REQUIRED_FINNISH_ATTENDANCES && props.amountOfMandatoryAttendances == REQUIRED_MANDATORY_ATTENDANCES && props.amountOfAcademicSubjectAttendances < REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN && props.amountOfMandatoryAdvancedSubjectAttendances > REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN
        ? null
        : <div style={ WARNING_STYLE } className="pure-u-22-24">
          <p>Ylioppilastutkintoon tulee sisältyä</p> 
          <ul>
            <li>äidinkieli / suomi toisena kielenä { props.amountOfFinnishAttendances == REQUIRED_FINNISH_ATTENDANCES ? "" : "(ei valittuna)" }</li>
            <li>neljä pakollista koetta { props.amountOfMandatoryAttendances == REQUIRED_MANDATORY_ATTENDANCES ? "" : `(valittuna ${props.amountOfMandatoryAttendances})` }</li>
            <li>vähintään yksi A-tason koe { props.amountOfMandatoryAdvancedSubjectAttendances > 0 ? "" : `(valittuna ${props.amountOfMandatoryAdvancedSubjectAttendances})` }</li>
            <li>vain yksi pakollinen reaaliaine, jos kirjoitat yhden tai useamman reaaliaineen. { props.amountOfAcademicSubjectAttendances < 2 ? "" : `(valittuna ${props.amountOfAcademicSubjectAttendances})` }</li>
          </ul>
        </div>
    }

    <a href="javascript:void(0)" onClick={() => {props.setPage(1);}} className="pure-button" >
      Edellinen sivu
    </a>
    <a
      style={{marginLeft: "1rem"}}
      href="javascript:void(0)"
      onClick={() => {props.setPage(3);}}
      className="pure-button pure-button-primary"
      disabled={props.invalid}>
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
          <select onChange={(ev) => {props.setLocation(ev.target.value);}}
                  value={props.location == 'Mikkeli'
                         ? 'Mikkeli'
                         : ''}
                  className="pure-u-23-24">
            <option>Mikkeli</option>
            <option value="">Muu</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          {props.location !== "Mikkeli" ?
          <React.Fragment>
            <label>&nbsp;</label>
            <input type="text" placeholder="Kirjoita tähän oppilaitoksen nimi" value={props.location} onChange={(ev) => {props.setLocation(ev.target.value);}}className="pure-u-1" />
          </React.Fragment>: null}
        </div>
        {props.location !== "Mikkeli" ?
          <div style={{margin: "1rem", padding: "0.5rem", border: "1px solid burlywood", backgroundColor: "beige"}} className="pure-u-1-1">
            Jos haluat suorittaa kokeen muualla, siitä on sovittava ensin kyseisen
            oppilaitoksen kanssa.
          </div>: null}
        <div className="pure-u-1-1">
          <label>Lisätietoa ohjaajalle</label>
          <textarea
            value={props.message}
            onChange={({target}) => {props.setMessage(target.value);}}
            rows={5}
            className="pure-u-1-1" />
        </div>
        <div className="pure-u-1-1">
          <label>Julkaisulupa</label>
          <select
            value={props.canPublishName}
            onChange={({target}) => {props.setCanPublishName(target.value);}}
            className="pure-u-1">
            <option value="true">Haluan nimeni julkaistavan valmistujalistauksissa</option>
            <option value="false">En halua nimeäni julkaistavan valmistujaislistauksissa</option>
          </select>
        </div>
        <div className="pure-u-1-2">
          <label>Nimi</label>
          <input readOnly={true} className="pure-u-23-24" type="text" value={props.name} />
        </div>
        <div className="pure-u-1-2">
          <label>Päivämäärä</label>
          <input readOnly={true} className="pure-u-1" type="text" value={props.date} />
        </div>
      </div>
    </fieldset>
    <a href="javascript:void(0)" onClick={() => {props.setPage(2);}} className="pure-button" >
      Edellinen sivu
    </a>
    <a style={{marginLeft: "1rem"}}
      onClick={() => {props.submit(); props.setPage(4);}}
      className="pure-button pure-button-primary">
      Ilmoittaudu ylioppilaskirjoituksiin
    </a>
  </div>
);

const Page4 = ({}) => (
  <div>
    <h1>Ilmoittautuminen ylioppilaskirjoituksiin lähetetty</h1>
    <p>Ilmoittautumisesi ylioppilaskirjoituksiin on lähetetty onnistuneesti. Saat lomakkeesta kopion sähköpostiisi.</p>
    <p>Tulosta lomake, allekirjoita ja päivää se ja lähetä skannattuna riikka.turpeinen@otavia.fi tai kirjeitse Otavia/Nettilukio, Otavantie 2B, 50670 Otava.</p>
    <p>Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteyttä.</p>
  </div>
);

class App extends React.Component {

  constructor() {
    super({});
    const date = new Date();
    // Use strings for boolean choices because they work well with <select>s
    this.state = {
      page: 1,
      name: "",
      ssn: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      changedContactInfo: "",
      nationalStudentNumber: "",
      guider: "",
      enrollAs: "UPPERSECONDARY",
      degreeType: "MATRICULATIONEXAMINATION",
      numMandatoryCourses: "",
      restartExam: false,
      location: "Mikkeli",
      message: "",
      studentIdentifier: "",
      initialized: false,
      enrolledAttendances: [],
      plannedAttendances: [],
      finishedAttendances: [],
      canPublishName: "true",
      date: date.getDate() + "."
            + (date.getMonth() + 1) + "."
            + date.getFullYear(),
      draftTimeout: undefined
    };
    
    this.isConflictingMandatory = this.isConflictingMandatory.bind(this);
    this.isConflictingRepeat = this.isConflictingRepeat.bind(this);
  }

  componentDidMount() {
    fetch(`/rest/matriculation/initialData/${MUIKKU_LOGGED_USER}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState(data);
        this.setState({initialized: true});
        this.fetchSavedEnrollment();
      });
  }

  fetchSavedEnrollment() {
    fetch(`/rest/matriculation/savedEnrollments/${MUIKKU_LOGGED_USER}`)
      .then((response) => {
        if (response.status == 404) {
          return "{}";
        } else {
          return response.json();
        }
      })
      .then((data) => {
        super.setState(data);
      });
  }

  resetDraftTimeout() {
    if (this.state.draftTimeout) {
      clearTimeout(this.state.draftTimeout);
      this.state.draftTimeout = undefined;
    }
    this.state.draftTimeout = setTimeout(() => {
      this.saveDraft();
      this.state.draftTimeout = undefined;
    },
    5000);
  }
  
  saveDraft() {
    fetch(`/rest/matriculation/savedEnrollments/${MUIKKU_LOGGED_USER}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        changedContactInfo: this.state.changedContactInfo,
        guider: this.state.guider,
        enrollAs: this.state.enrollAs,
        degreeType: this.state.degreeType,
        numMandatoryCourses: this.state.numMandatoryCourses,
        restartExam: this.state.restartExam,
        enrolledAttendances: this.state.enrolledAttendances,
        plannedAttendances: this.state.plannedAttendances,
        finishedAttendances: this.state.finishedAttendances
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // TODO why is this here at all? - it also triggers resetDraftTimeout.. 
//      this.setState(data);
    });
  }
  
  newEnrolledAttendance() {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances.push({
      subject: this.getDefaultSubject(this.getEnrolledSubjects()),
      mandatory: "true",
      repeat: "false",
      status: "ENROLLED"
    });
    this.setState({enrolledAttendances});
  }

  modifyEnrolledAttendance(i, param, value) {
    const enrolledAttendances = this.state.enrolledAttendances;
    enrolledAttendances[i][param] = value;
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
      term: this.getDefaultPastTerm().value,
      subject: this.getDefaultSubject(this.getFinishedSubjects()),
      mandatory: "true",
      grade: "UNKNOWN",
      status: "FINISHED"
    });
    this.setState({finishedAttendances});
  }

  modifyFinishedAttendance(i, param, value) {
    const finishedAttendances = this.state.finishedAttendances;
    finishedAttendances[i][param] = value;
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
      term: this.getDefaultNextTerm().value,
      subject: this.getDefaultSubject(this.getPlannedSubjects()),
      mandatory: "true",
      status: "PLANNED"
    });
    this.setState({plannedAttendances});
  }

  modifyPlannedAttendance(i, param, value) {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances[i][param] = value;
    this.setState({plannedAttendances});
  }

  deletePlannedAttendance(i) {
    const plannedAttendances = this.state.plannedAttendances;
    plannedAttendances.splice(i, 1);
    this.setState({plannedAttendances});
  }
  
  /**
   * Returns list of enrolled subjects from enrolled attendances lists
   * 
   * @returns list of enrolled subjects from enrolled attendances lists
   */
  getEnrolledSubjects() {
    return this.state.enrolledAttendances.map((attendance) => {
      return attendance.subject;
    });
  }

  /**
   * Returns list of planned subjects from planned attendances lists
   * 
   * @returns list of planned subjects from planned attendances lists
   */
  getPlannedSubjects() {
    return this.state.plannedAttendances.map((attendance) => {
      return attendance.subject;
    });
  }

  /**
   * Returns list of finished subjects from finished attendances lists
   * 
   * @returns list of finished subjects from finished attendances lists
   */
  getFinishedSubjects() {
    return this.state.finishedAttendances.map((attendance) => {
      return attendance.subject;
    });
  }

  /**
   * Returns next non selected subject from subjects list
   * 
   * @param selectedSubjects list of selected subjects 
   * @return next non selected subject from subjects list
   */
  getDefaultSubject(selectedSubjects) {
    const subjects = Object.keys(SUBJECT_MAP);

    for (let i = 0; i < subjects.length; i++) {
      if (selectedSubjects.indexOf(subjects[i]) === -1) {
        return subjects[i];
      }
    }

    return null;
  }

  /**
   * Returns list of all user's selected attendances, including enrolled, planned and finished lists
   * 
   * @returns list of all user's selected attendances
   */
  getAttendances() {
    return [].concat(this.state.enrolledAttendances,this.state.plannedAttendances, this.state.finishedAttendances);
  }

  /**
   * Returns an array of attendances which includes enrolledAttendances, plannedAttendances
   * and such finishedAttendances that have subjects not yet included from the previous
   * two lists.
   * 
   * I.e. the array is missing the duplicates (repeated exams) which come from finished list.
   */
  getNonDuplicateAttendances() {
    const attendances = [].concat(this.state.enrolledAttendances,this.state.plannedAttendances);
    const attendedSubjects = attendances.map((attendance) => {
      return attendance.subject;
    });
    
    this.state.finishedAttendances.forEach((finishedAttendance) => {
      if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
        attendances.push(finishedAttendance);
      }
    });
    
    return attendances;
  }
  
  /**
   * Returns count of attendances in finnish courses.
   * 
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   * 
   * @returns count of attendances in finnish courses
   */
  getAmountOfFinnishAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return FINNISH_SUBJECTS.indexOf(attendance.subject) !== -1;
    }).length;
  }
  
  /**
   * Returns count of attendances in mandatory courses 
   * 
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   * 
   * @returns count of attendances in mandatory courses
   */
  getAmountOfMandatoryAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return attendance.mandatory === "true";
    }).length;
  }

  /**
   * Returns count of attendances in academic subjects 
   * 
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   * 
   * @returns count of attendances in academic subjects
   */
  getAmountOfAcademicSubjectAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return attendance.mandatory === "true" && ACADEMIC_SUBJECTS.indexOf(attendance.subject) !== -1;
    }).length;
  }

  /**
   * Returns whether user has valid amount of attendances in mandatory advanced subjects 
   * 
   * Attendances with grade IMPROBATUR are ignored while counting attendances
   * 
   * @returns whether user has valid amount of attendances in mandatory advanced subjects
   */
  getAmountOfMandatoryAdvancedSubjectAttendances() {
    return this.getNonDuplicateAttendances().filter((attendance) => {
      return attendance.mandatory === "true" && ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1;
    }).length;
  }

  /**
   * Returns whether attendance details are valid
   * 
   * @returns whether attendance details are valid 
   */
  isValidAttendances() {
    return this.getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES && 
      this.getAmountOfMandatoryAttendances() == REQUIRED_MANDATORY_ATTENDANCES &&
      this.getAmountOfAcademicSubjectAttendances() < REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN &&
      this.getAmountOfMandatoryAdvancedSubjectAttendances() > REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN; 
  }

  isConflictingAttendances() {
    // Can't enroll to two subjects that are in the same group
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

    // can't have duplicate subjects
    for (let i=0; i<subjects.length; i++) {
      for (let j=0; j<i; j++) {
        if (subjects[i] == subjects[j]) {
          return true;
        }
      }
    }

    return false;
  }

  isIncompleteAttendances() {
    for (let attendance of this.state.enrolledAttendances) {
      if (attendance.subject === ""
          || attendance.mandatory === ""
          || attendance.repeat === "") {
        return true;
      }
    }
    for (let attendance of this.state.finishedAttendances) {
      if (attendance.term === ""
          || attendance.subject === ""
          || attendance.mandatory === ""
          || attendance.grade === "") {
        return true;
      }
    }
    for (let attendance of this.state.plannedAttendances) {
      if (attendance.term === ""
          || attendance.subject === ""
          || attendance.mandatory === "") {
        return true;
      }
    }
  }

  /**
   * Returns true if enrolled attendance is not a repeat but there is a 
   * previous exam with the same subject.
   */
  isConflictingRepeat(attendance) {
    if (attendance.repeat === "false") {
      return this.getFinishedSubjects().indexOf(attendance.subject) != -1;
    } else {
      return false;
    }
  }

  /**
   * Returns true if there are any conflicting repeats; see isConflictingRepeat.
   */
  hasConflictingRepeats() {
    const finishedSubjects = this.getFinishedSubjects();
    
    return this.state.enrolledAttendances.filter((attendance) => { 
      return attendance.repeat === "false" && finishedSubjects.indexOf(attendance.subject) != -1;
    }).length > 0;
  }
  
  /**
   * Returns true if there is a finished attendance with the same subject but different mandatory.
   */
  isConflictingMandatory(attendance) {
    return this.state.finishedAttendances.filter((fin) => { 
      return (fin.subject === attendance.subject) && (fin.mandatory != attendance.mandatory) 
    }).length > 0;
  }
    
  /**
   * Returns true if there are any conflicting mandatories; see isConflictingMandatory.
   */
  hasMandatoryConflicts() {
    const attendances = [].concat(this.state.enrolledAttendances, this.state.plannedAttendances);
    return attendances.filter((attendance) => { 
      return this.state.finishedAttendances.filter((fin) => { 
        return (fin.subject === attendance.subject) && (fin.mandatory != attendance.mandatory) 
      }).length > 0;
    }).length > 0;
  }

  currentTerm() {
    let now = new Date();
    let year, term;
    if (now.getMonth() < 5) {
      year = new Date().getFullYear();
      term = "AUTUMN";
    } else {
      year = new Date().getFullYear() + 1;
      term = "SPRING";
    }
    return `${year}${term}`;
  }
  
  isInvalid() {
    return this.isConflictingAttendances()
      || this.hasConflictingRepeats()
      || this.hasMandatoryConflicts()
      || this.isIncompleteAttendances()
      || !this.isValidAttendances();
  }

  submit() {
    let message = this.state.message;
    if (this.state.changedContactInfo) {
      message = "Yhteystiedot:\n"
        + this.state.changedContactInfo
        + "\n\n"
        + this.state.message;
    }
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
          city: this.state.locality,
          guider: this.state.guider,
          enrollAs: this.state.enrollAs,
          degreeType: this.state.degreeType,
          restartExam: this.state.restartExam,
          numMandatoryCourses: this.state.numMandatoryCourses ? Number(this.state.numMandatoryCourses) : null,
          location: this.state.location,
          message: message,
          studentIdentifier: this.state.studentIdentifier,
          canPublishName: this.state.canPublishName === 'true',
          state: "PENDING",
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
          }))
        }
      )
    }).then(function (response) {
      if (!response.ok) {
        this.setState({error: response.text()});
      }
    });
  }

  setState(state) {
    super.setState(
        state,
        () => {
          // Reset draft timer after setState returns
          this.resetDraftTimeout();
        }
    );
  }

  render() {
    if (!this.state.initialized) {
      return <React.Fragment />;
    }
    return (
      <React.Fragment>
        {this.state.error
          ? <div class="error">{this.state.error}</div>
          : null}
        <form className="pure-form pure-form-stacked matriculation-form" onSubmit={(e) => {e.preventDefault();}}>
          {/* Page 1 of the wizard contains an introductory text */}
          { this.state.page === 1
              ? <Page1 {...this.state}
                setPage={(page) => {this.setState({page});}}
                />
              : null }
          {/* Page 2 contains basic contact information and input for the exams the student enrolls into */}
          { this.state.page === 2
              ? <Page2 {...this.state}
                  setChangedContactInfo={(value) => { this.setState({changedContactInfo: value});}}
                  setGuider={(value) => { this.setState({guider : value}); }}
                  setEnrollAs={(value) => { this.setState({enrollAs : value}); }}
                  setDegreeType={(value) => { this.setState({degreeType : value}); }}
                  setRestartExam={(value) => { this.setState({restartExam : value}); }}
                  setNumMandatoryCourses={(value) => { this.setState({numMandatoryCourses : value}); }}
                  setPage={(page) => {this.setState({page});}}
                  newEnrolledAttendance={() => {this.newEnrolledAttendance();}}
                  newPlannedAttendance={() => {this.newPlannedAttendance();}}
                  newFinishedAttendance={() => {this.newFinishedAttendance();}}
                  deleteEnrolledAttendance={(i) => {this.deleteEnrolledAttendance(i);}}
                  deletePlannedAttendance={(i) => {this.deletePlannedAttendance(i);}}
                  deleteFinishedAttendance={(i) => {this.deleteFinishedAttendance(i);}}
                  modifyEnrolledAttendance={(i, param, value) => {this.modifyEnrolledAttendance(i, param, value);}}
                  modifyPlannedAttendance={(i, param, value) => {this.modifyPlannedAttendance(i, param, value);}}
                  modifyFinishedAttendance={(i, param, value) => {this.modifyFinishedAttendance(i, param, value);}}
                  amountOfFinnishAttendances={ this.getAmountOfFinnishAttendances() }
                  amountOfMandatoryAttendances={ this.getAmountOfMandatoryAttendances() }
                  amountOfAcademicSubjectAttendances={ this.getAmountOfAcademicSubjectAttendances() }
                  amountOfMandatoryAdvancedSubjectAttendances = { this.getAmountOfMandatoryAdvancedSubjectAttendances() }
                  isConflictingMandatory={this.isConflictingMandatory}
                  conflictingAttendances={this.isConflictingAttendances()}
                  isConflictingRepeat={this.isConflictingRepeat}
                  conflictingRepeats={this.hasConflictingRepeats()}
                  incompleteAttendances={this.isIncompleteAttendances()}
                  mandatoryConflicts={this.hasMandatoryConflicts()}
                  invalid={this.isInvalid()}
                  pastTermOptions={this.getPastTermOptions()}
                  nextTermOptions={this.getNextTermOptions()}
                  currentTerm={ this.resolveCurrentTerm() }
                  finishedSubjects={ this.getFinishedSubjects() }
                  plannedSubjects={ this.getPlannedSubjects() }
                  enrolledSubjects={ this.getEnrolledSubjects() }
                />
              : null }
          {/* Page 3 contains practical choices for doing the exam (location, extra info etc) */}
          { this.state.page === 3
              ? <Page3 {...this.state}
                setLocation={(location) => {this.setState({location});}}
                setMessage={(message) => {this.setState({message});}}
                setCanPublishName={(canPublishName) => {this.setState({canPublishName});}}
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
  
  /**
   * Resolves term for given date
   * 
   * @param {moment} from from date 
   * @returns {object} term details
   */
  resolveTerm (from) {
    const quarter = from.quarter();
    return {
      value: (quarter < 3 ? "SPRING" : "AUTUMN") + from.year(),
      name: (quarter < 3 ? "Kevät " : "Syksy ") + from.year(),
      adessive: (quarter < 3 ? "keväällä " : "syksyllä ") + from.year()
    }
  }

  /**
   * Resolves current term 
   * @returns {object} term details
   */
  resolveCurrentTerm () {
    return this.resolveTerm(moment().add(6, "months"));
  }

  /**
   * Resolves given number of terms starting from given date
   * 
   * @param {moment} from from date 
   * @param {number} count count of terms to be resolved 
   * @returns {array} terms
   */
  resolveTerms(from, count) {
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(this.resolveTerm(from));
      from.add(6, "months");
    }
    
    return result;
  }

  /**
   * Returns term options for term
   * 
   * @param {array} terms terms
   * @returns {array} term options
   */
  getTermOptions (terms) {
    return terms.map((term) => {
      return <option value={term.value}>{term.name}</option>;
    });
  }

  /**
   * Resolves past 6 terms
   * 
   * @param {number} count count of terms to be resolved 
   * @returns {array} terms
   */
  getPastTerms() {
    return this.resolveTerms(moment().subtract(2.5, "years"), 6);
  }

  /**
   * Resolves next 3 terms
   * 
   * @param {number} count count of terms to be resolved 
   * @returns {array} terms
   */
  getNextTerms() {
    return this.resolveTerms(moment().add(1, "years"), 3);
  }

  /**
   * Resolves past 6 term options
   * 
   * @param {number} count count of terms to be resolved 
   * @returns {array} term options
   */
  getPastTermOptions() {
    return this.getTermOptions(this.getPastTerms());
  }

  /**
   * Resolves next 3 term options
   * 
   * @param {number} count count of terms to be resolved 
   * @returns {array} term options
   */
  getNextTermOptions() {
    return this.getTermOptions(this.getNextTerms());
  }

  /**
   * Returns default past term
   * 
   * @return default past term
   */
  getDefaultPastTerm() {
    return this.getPastTerms()[0];
  }

  /**
   * Returns default next term
   * 
   * @return default next term
   */
  getDefaultNextTerm() {
    return this.getNextTerms()[0];
  }

}

ReactDOM.render(<App />, document.getElementById("react-root"));