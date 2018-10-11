"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var Page1 = function Page1(props) {
  return React.createElement("div", null, React.createElement("p", null, "Ilmoittautuminen ylioppilaskirjoituksiin on nyt auki. Voit ilmoittautua yo-kirjoituksiin, jos t\xE4yt\xE4t abistatuksen. Lue lis\xE4\xE4 tiedotteesta."), React.createElement("p", null, "T\xE4yt\xE4 puuttuvat tiedot huolellisesti ja tarkista lomake ennen sen l\xE4hett\xE4mist\xE4."), React.createElement("p", null, "Ilmoittautuminen sulkeutuu:"), React.createElement("ul", null, React.createElement("li", null, "Kev\xE4\xE4n kirjoitusten osalta 20.11."), React.createElement("li", null, "Syksyn kirjoitusten osalta 20.5.")), React.createElement("p", null, "Jos sinulla on kysytt\xE4v\xE4\xE4, ota yhteytt\xE4 Riikka Turpeiseen (riikka.turpeinen@otavanopisto.fi)"), React.createElement("a", {
    href: "javascript:void(0)",
    onClick: function onClick() {
      props.setPage(2);
    },
    className: "pure-button pure-button-primary"
  }, "Seuraava sivu"));
};

var SubjectSelect = function SubjectSelect(_ref) {
  var i = _ref.i,
      value = _ref.value,
      onChange = _ref.onChange;
  return React.createElement(React.Fragment, null, i == 0 ? React.createElement("label", null, "Aine") : null, React.createElement("select", {
    value: value,
    onChange: onChange,
    className: "pure-u-23-24"
  }, React.createElement("option", {
    value: "AI"
  }, "\xC4idinkieli"), React.createElement("option", {
    value: "S2"
  }, "Suomi toisena kielen\xE4"), React.createElement("option", {
    value: "ENA"
  }, "Englanti, A-taso"), React.createElement("option", {
    value: "RAA"
  }, "Ranska, A-taso"), React.createElement("option", {
    value: "ESA"
  }, "Espanja, A-taso"), React.createElement("option", {
    value: "SAA"
  }, "Saksa, A-taso"), React.createElement("option", {
    value: "VEA"
  }, "Ven\xE4j\xE4, A-taso"), React.createElement("option", {
    value: "UE"
  }, "Uskonto"), React.createElement("option", {
    value: "ET"
  }, "El\xE4m\xE4nkatsomustieto"), React.createElement("option", {
    value: "YO"
  }, "Yhteiskuntaoppi"), React.createElement("option", {
    value: "KE"
  }, "Kemia"), React.createElement("option", {
    value: "GE"
  }, "Maantiede"), React.createElement("option", {
    value: "TT"
  }, "Terveystieto"), React.createElement("option", {
    value: "ENC"
  }, "Englanti, C-taso"), React.createElement("option", {
    value: "RAC"
  }, "Ranska, C-taso"), React.createElement("option", {
    value: "ESC"
  }, "Espanja, C-taso"), React.createElement("option", {
    value: "SAC"
  }, "Saksa, C-taso"), React.createElement("option", {
    value: "VEC"
  }, "Ven\xE4j\xE4, C-taso"), React.createElement("option", {
    value: "ITC"
  }, "Italia, C-taso"), React.createElement("option", {
    value: "POC"
  }, "Portugali, C-taso"), React.createElement("option", {
    value: "LAC"
  }, "Latina, C-taso"), React.createElement("option", {
    value: "SMC"
  }, "Saame, C-taso"), React.createElement("option", {
    value: "RUA"
  }, "Ruotsi, A-taso"), React.createElement("option", {
    value: "RUB"
  }, "Ruotsi, B-taso"), React.createElement("option", {
    value: "PS"
  }, "Psykologia"), React.createElement("option", {
    value: "FI"
  }, "Filosofia"), React.createElement("option", {
    value: "HI"
  }, "Historia"), React.createElement("option", {
    value: "FY"
  }, "Fysiikka"), React.createElement("option", {
    value: "BI"
  }, "Biologia"), React.createElement("option", {
    value: "MAA"
  }, "Matematiikka, pitk\xE4"), React.createElement("option", {
    value: "MAB"
  }, "Matematiikka, lyhyt")));
};

var TermSelect = function TermSelect(_ref2) {
  var i = _ref2.i,
      value = _ref2.value,
      onChange = _ref2.onChange;
  return React.createElement(React.Fragment, null, i == 0 ? React.createElement("label", null, "Ajankohta") : null, React.createElement("select", {
    value: value,
    onChange: onChange,
    className: "pure-u-23-24"
  }, React.createElement("option", {
    value: "AUTUMN2018"
  }, "Syksy 2018"), React.createElement("option", {
    value: "SPRING2019"
  }, "Kev\xE4t 2019"), React.createElement("option", {
    value: "AUTUMN2019"
  }, "Syksy 2019"), React.createElement("option", {
    value: "SPRING2020"
  }, "Kev\xE4t 2020"), React.createElement("option", {
    value: "AUTUMN2020"
  }, "Syksy 2020"), React.createElement("option", {
    value: "SPRING2021"
  }, "Kev\xE4t 2021")));
};

var MandatorySelect = function MandatorySelect(_ref3) {
  var i = _ref3.i,
      value = _ref3.value,
      onChange = _ref3.onChange;
  return React.createElement(React.Fragment, null, i == 0 ? React.createElement("label", null, "Pakollisuus") : null, React.createElement("select", {
    value: value,
    onChange: onChange,
    className: "pure-u-23-24"
  }, React.createElement("option", {
    value: "true"
  }, "Pakollinen"), React.createElement("option", {
    value: "false"
  }, "Valinnainen")));
};

var RepeatSelect = function RepeatSelect(_ref4) {
  var i = _ref4.i,
      value = _ref4.value,
      onChange = _ref4.onChange;
  return React.createElement(React.Fragment, null, i == 0 ? React.createElement("label", null, "Uusiminen") : null, React.createElement("select", {
    value: value,
    onChange: onChange,
    className: "pure-u-23-24"
  }, React.createElement("option", {
    value: "false"
  }, "Ensimm\xE4inen suorituskerta"), React.createElement("option", {
    value: "true"
  }, "Uusinta")));
};

var GradeSelect = function GradeSelect(_ref5) {
  var i = _ref5.i,
      value = _ref5.value,
      onChange = _ref5.onChange;
  return React.createElement(React.Fragment, null, i == 0 ? React.createElement("label", null, "Arvosana") : null, React.createElement("select", {
    value: value,
    onChange: onChange,
    className: "pure-u-23-24"
  }, React.createElement("option", {
    value: "IMPROBATUR"
  }, "I (Improbatur)"), React.createElement("option", {
    value: "APPROBATUR"
  }, "A (Approbatur)"), React.createElement("option", {
    value: "LUBENTER_APPROBATUR"
  }, "B (Lubenter approbatur)"), React.createElement("option", {
    value: "CUM_LAUDE_APPROBATUR"
  }, "C (Cum laude approbatur)"), React.createElement("option", {
    value: "MAGNA_CUM_LAUDE_APPROBATUR"
  }, "M (Magna cum laude approbatur)"), React.createElement("option", {
    value: "EXIMIA_CUM_LAUDE_APPROBATUR"
  }, "E (Eximia cum laude approbatur)"), React.createElement("option", {
    value: "LAUDATUR"
  }, "L (Laudatur)"), React.createElement("option", {
    value: "UNKNOWN"
  }, "Ei viel\xE4 tiedossa")));
};

var Page2 = function Page2(props) {
  return React.createElement(React.Fragment, null, React.createElement("fieldset", null, React.createElement("legend", null, "Perustiedot"), React.createElement("div", {
    className: "pure-g"
  }, React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Nimi"), React.createElement("input", {
    className: "pure-u-23-24",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setName(e.target.value);
    },
    value: props.name
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Henkil\xF6tunnus"), React.createElement("input", {
    className: "pure-u-1",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setSsn(e.target.value);
    },
    value: props.ssn
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "S\xE4hk\xF6postiosoite"), React.createElement("input", {
    className: "pure-u-23-24",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setEmail(e.target.value);
    },
    value: props.email
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Puhelinnumero"), React.createElement("input", {
    className: "pure-u-1",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setPhone(e.target.value);
    },
    value: props.phone
  })), React.createElement("div", {
    className: "pure-u-1-1"
  }, React.createElement("label", null, "Osoite"), React.createElement("input", {
    className: "pure-u-1-1",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setAddress(e.target.value);
    },
    value: props.address
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Postinumero"), React.createElement("input", {
    className: "pure-u-23-24",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setPostalCode(e.target.value);
    },
    value: props.postalCode
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Postitoimipaikka"), React.createElement("input", {
    className: "pure-u-1",
    readOnly: true,
    type: "text",
    onChange: function onChange(e) {
      props.setLocality(e.target.value);
    },
    value: props.locality
  })))), React.createElement("fieldset", null, React.createElement("legend", null, "Opiskelijatiedot"), React.createElement("div", null, React.createElement("div", {
    className: "pure-u-1-1"
  }, React.createElement("label", null, "Ohjaaja"), React.createElement("input", {
    className: "pure-u-1",
    type: "text",
    value: props.guidanceCounselor
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Ilmoittautuminen"), React.createElement("select", {
    onChange: function onChange(ev) {
      props.setSchoolType(ev.target.value);
    },
    value: props.enrollAs,
    className: "pure-u-23-24"
  }, React.createElement("option", {
    value: "UPPERSECONDARY"
  }, "Lukion opiskelijana"), React.createElement("option", {
    value: "VOCATIONAL"
  }, "Ammatillisten opintojen perusteella"))), React.createElement("div", {
    className: "pure-u-1-2"
  }, props.enrollAs === "UPPERSECONDARY" ? React.createElement(React.Fragment, null, React.createElement("label", null, "Pakollisia kursseja suoritettuna"), React.createElement("input", {
    className: "pure-u-1",
    type: "text",
    readOnly: true,
    value: props.mandatoryCourses
  })) : null), props.enrollAs === "UPPERSECONDARY" && props.mandatoryCourses < 44 ? React.createElement("div", {
    style: {
      margin: "1rem",
      padding: "0.5rem",
      border: "1px solid red",
      backgroundColor: "pink"
    },
    className: "pure-u-22-24"
  }, "Sinulla ei ole tarpeeksi pakollisia kursseja suoritettuna. Jos haluat silti ilmoittautua ylioppilaskokeeseen, ota yhteytt\xE4 ohjaajaan.") : null, React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", {
    style: {
      paddingTop: "0.7rem"
    }
  }, "Aloitan tutkinnon suorittamisen uudelleen\xA0", React.createElement("input", {
    type: "checkbox"
  }))))), React.createElement("fieldset", null, React.createElement("legend", null, "Ilmoittaudun suorittamaan kokeen seuraavissa aineissa ", React.createElement("b", null, "Syksyll\xE4 2018")), React.createElement("div", {
    className: "pure-g"
  }, props.enrolledAttendances.map(function (attendance, i) {
    return React.createElement(React.Fragment, {
      key: i
    }, React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement(SubjectSelect, {
      i: i,
      value: attendance.subject,
      onChange: function onChange(_ref6) {
        var target = _ref6.target;
        props.modifyEnrolledAttendance(i, "subject", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement(MandatorySelect, {
      i: i,
      value: attendance.mandatory,
      onChange: function onChange(_ref7) {
        var target = _ref7.target;
        props.modifyEnrolledAttendance(i, "mandatory", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement(RepeatSelect, {
      i: i,
      value: attendance.repeat,
      onChange: function onChange(_ref8) {
        var target = _ref8.target;
        props.modifyEnrolledAttendance(i, "repeat", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement("button", {
      style: {
        marginTop: i == 0 ? "1.7rem" : "0.3rem"
      },
      class: "pure-button",
      onClick: function onClick() {
        props.deleteEnrolledAttendance(i);
      }
    }, "Poista")));
  })), React.createElement("button", {
    className: "pure-button",
    onClick: props.newEnrolledAttendance
  }, "Lis\xE4\xE4 uusi rivi")), React.createElement("fieldset", null, React.createElement("legend", null, "Olen jo suorittanut seuraavat ylioppilaskokeet"), React.createElement("div", {
    className: "pure-g"
  }, props.finishedAttendances.map(function (attendance, i) {
    return React.createElement(React.Fragment, {
      key: i
    }, React.createElement("div", {
      className: "pure-u-1-5"
    }, React.createElement(TermSelect, {
      i: i,
      value: attendance.term,
      onChange: function onChange(_ref9) {
        var target = _ref9.target;
        props.modifyFinishedAttendance(i, "term", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-5"
    }, React.createElement(SubjectSelect, {
      i: i,
      value: attendance.subject,
      onChange: function onChange(_ref10) {
        var target = _ref10.target;
        props.modifyFinishedAttendance(i, "subject", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-5"
    }, React.createElement(MandatorySelect, {
      i: i,
      value: attendance.mandatory,
      onChange: function onChange(_ref11) {
        var target = _ref11.target;
        props.modifyFinishedAttendance(i, "mandatory", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-5"
    }, React.createElement(GradeSelect, {
      i: i,
      value: attendance.grade,
      onChange: function onChange(_ref12) {
        var target = _ref12.target;
        props.modifyFinishedAttendance(i, "grade", target.value);
      }
    })), React.createElement("div", {
      className: "pure-u-1-5"
    }, React.createElement("button", {
      style: {
        marginTop: i == 0 ? "1.7rem" : "0.3rem"
      },
      class: "pure-button",
      onClick: function onClick() {
        props.deleteFinishedAttendance(i);
      }
    }, "Poista")));
  })), React.createElement("button", {
    className: "pure-button",
    onClick: props.newFinishedAttendance
  }, "Lis\xE4\xE4 uusi rivi")), React.createElement("fieldset", null, React.createElement("legend", null, "Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa"), React.createElement("div", {
    className: "pure-g"
  }, props.plannedAttendances.map(function (attendance, i) {
    return React.createElement(React.Fragment, {
      key: i
    }, React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement(TermSelect, {
      i: i,
      onChange: function onChange(_ref13) {
        var target = _ref13.target;
        props.modifyPlannedAttendance(i, "term", target.value);
      },
      value: attendance.term
    })), React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement(SubjectSelect, {
      i: i,
      onChange: function onChange(_ref14) {
        var target = _ref14.target;
        props.modifyPlannedAttendance(i, "subject", target.value);
      },
      value: attendance.subject
    })), React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement(MandatorySelect, {
      i: i,
      onChange: function onChange(_ref15) {
        var target = _ref15.target;
        props.modifyPlannedAttendance(i, "mandatory", target.value);
      },
      value: attendance.mandatory
    })), React.createElement("div", {
      className: "pure-u-1-4"
    }, React.createElement("button", {
      style: {
        marginTop: i == 0 ? "1.7rem" : "0.3rem"
      },
      class: "pure-button",
      onClick: function onClick() {
        props.deletePlannedAttendance(i);
      }
    }, "Poista")));
  })), React.createElement("button", {
    className: "pure-button",
    onClick: props.newPlannedAttendance
  }, "Lis\xE4\xE4 uusi rivi")), props.conflictingAttendances ? React.createElement("div", {
    style: {
      margin: "1rem",
      padding: "0.5rem",
      border: "1px solid red",
      backgroundColor: "pink"
    }
  }, "Olet valinnut aineet, joita ei voi valita samanaikaisesti. Jos siit\xE4 huolimatta haluat osallistua n\xE4ihin aineisiin, ota yhteytt\xE4 ohjaajaan.") : null, React.createElement("a", {
    href: "javascript:void(0)",
    onClick: function onClick() {
      props.setPage(1);
    },
    className: "pure-button"
  }, "Edellinen sivu"), React.createElement("a", {
    style: {
      marginLeft: "1rem"
    },
    href: "javascript:void(0)",
    onClick: function onClick() {
      props.setPage(3);
    },
    className: "pure-button pure-button-primary",
    disabled: props.conflictingAttendances
  }, "Seuraava sivu"));
};

var Page3 = function Page3(props) {
  return React.createElement("div", null, React.createElement("fieldset", null, React.createElement("legend", null, "Kokeen suorittaminen"), React.createElement("div", {
    className: "pure-g"
  }, React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Suorituspaikka"), React.createElement("select", {
    onChange: function onChange(ev) {
      props.setLocation(ev.target.value);
    },
    value: props.location == 'Otavan Opisto' ? 'Otavan Opisto' : '',
    className: "pure-u-23-24"
  }, React.createElement("option", null, "Otavan Opisto"), React.createElement("option", {
    value: ""
  }, "Muu"))), React.createElement("div", {
    className: "pure-u-1-2"
  }, props.location !== "Otavan Opisto" ? React.createElement(React.Fragment, null, React.createElement("label", null, "\xA0"), React.createElement("input", {
    type: "text",
    placeholder: "Kirjoita t\xE4h\xE4n oppilaitoksen nimi",
    value: props.location,
    onChange: function onChange(ev) {
      props.setLocation(ev.target.value);
    },
    className: "pure-u-1"
  })) : null), props.location !== "Otavan Opisto" ? React.createElement("div", {
    style: {
      margin: "1rem",
      padding: "0.5rem",
      border: "1px solid burlywood",
      backgroundColor: "beige"
    },
    className: "pure-u-1-1"
  }, "Jos haluat suorittaa kokeen muualla, siit\xE4 on sovittava ensin kyseisen oppilaitoksen kanssa.") : null, React.createElement("div", {
    className: "pure-u-1-1"
  }, React.createElement("label", null, "Lis\xE4tietoa ohjaajalle"), React.createElement("textarea", {
    value: props.message,
    onChange: function onChange(_ref16) {
      var target = _ref16.target;
      props.setMessage(target.value);
    },
    rows: 5,
    className: "pure-u-1-1"
  })), React.createElement("div", {
    className: "pure-u-1-1"
  }, React.createElement("label", null, "Julkaisulupa"), React.createElement("select", {
    value: props.canPublishName,
    onChange: function onChange(_ref17) {
      var target = _ref17.target;
      props.setCanPublishName(target.value);
    },
    className: "pure-u-1"
  }, React.createElement("option", {
    value: "true"
  }, "Haluan nimeni julkaistavan valmistujalistauksissa"), React.createElement("option", {
    value: "false"
  }, "En halua nime\xE4ni julkaistavan valmistujaislistauksissa"))), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "Nimi"), React.createElement("input", {
    readOnly: true,
    className: "pure-u-23-24",
    type: "text",
    value: props.name
  })), React.createElement("div", {
    className: "pure-u-1-2"
  }, React.createElement("label", null, "P\xE4iv\xE4m\xE4\xE4r\xE4"), React.createElement("input", {
    readOnly: true,
    className: "pure-u-1",
    type: "text",
    value: props.date
  })))), React.createElement("a", {
    href: "javascript:void(0)",
    onClick: function onClick() {
      props.setPage(2);
    },
    className: "pure-button"
  }, "Edellinen sivu"), React.createElement("a", {
    style: {
      marginLeft: "1rem"
    },
    onClick: function onClick() {
      props.submit();
      props.setPage(4);
    },
    className: "pure-button pure-button-primary"
  }, "Hyv\xE4ksy ilmoittautuminen"));
};

var Page4 = function Page4(_ref18) {
  _objectDestructuringEmpty(_ref18);

  return React.createElement("div", null, React.createElement("p", null, "Ilmoittautumisesi ylioppilaskirjoituksiin on l\xE4hetetty onnistuneesti. Saat lomakkeesta kopion s\xE4hk\xF6postiisi."), React.createElement("p", null, "Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteytt\xE4."));
};

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, {}));
    var date = new Date();
    _this.state = {
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
      finishedAttendances: [],
      canPublishName: "true",
      date: date.getDate() + "." + date.getMonth() + "." + date.getFullYear()
    };
    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      fetch("/rest/matriculation/initialData/".concat(MUIKKU_LOGGED_USER)).then(function (response) {
        return response.json();
      }).then(function (data) {
        _this2.setState(data);

        _this2.setState({
          initialized: true
        });
      });
    }
  }, {
    key: "newEnrolledAttendance",
    value: function newEnrolledAttendance() {
      var enrolledAttendances = this.state.enrolledAttendances;
      enrolledAttendances.push({
        subject: "AI",
        mandatory: false,
        repeat: false,
        status: "ENROLLED"
      });
      this.setState({
        enrolledAttendances: enrolledAttendances
      });
    }
  }, {
    key: "modifyEnrolledAttendance",
    value: function modifyEnrolledAttendance(i, param, value) {
      var enrolledAttendances = this.state.enrolledAttendances;
      enrolledAttendances[i][param] = value;
      this.setState({
        enrolledAttendances: enrolledAttendances
      });
    }
  }, {
    key: "deleteEnrolledAttendance",
    value: function deleteEnrolledAttendance(i) {
      var enrolledAttendances = this.state.enrolledAttendances;
      enrolledAttendances.splice(i, 1);
      this.setState({
        enrolledAttendances: enrolledAttendances
      });
    }
  }, {
    key: "newFinishedAttendance",
    value: function newFinishedAttendance() {
      var finishedAttendances = this.state.finishedAttendances;
      finishedAttendances.push({
        term: "SPRING2018",
        subject: "AI",
        mandatory: false,
        grade: "APPROBATUR",
        status: "FINISHED"
      });
      this.setState({
        finishedAttendances: finishedAttendances
      });
    }
  }, {
    key: "modifyFinishedAttendance",
    value: function modifyFinishedAttendance(i, param, value) {
      var finishedAttendances = this.state.finishedAttendances;
      finishedAttendances[i][param] = value;
      this.setState({
        finishedAttendances: finishedAttendances
      });
    }
  }, {
    key: "deleteFinishedAttendance",
    value: function deleteFinishedAttendance(i) {
      var finishedAttendances = this.state.finishedAttendances;
      finishedAttendances.splice(i, 1);
      this.setState({
        finishedAttendances: finishedAttendances
      });
    }
  }, {
    key: "newPlannedAttendance",
    value: function newPlannedAttendance() {
      var plannedAttendances = this.state.plannedAttendances;
      plannedAttendances.push({
        term: "SPRING2018",
        subject: "AI",
        mandatory: false,
        status: "PLANNED"
      });
      this.setState({
        plannedAttendances: plannedAttendances
      });
    }
  }, {
    key: "modifyPlannedAttendance",
    value: function modifyPlannedAttendance(i, param, value) {
      var plannedAttendances = this.state.plannedAttendances;
      plannedAttendances[i][param] = value;
      this.setState({
        plannedAttendances: plannedAttendances
      });
    }
  }, {
    key: "deletePlannedAttendance",
    value: function deletePlannedAttendance(i) {
      var plannedAttendances = this.state.plannedAttendances;
      plannedAttendances.splice(i, 1);
      this.setState({
        plannedAttendances: plannedAttendances
      });
    }
  }, {
    key: "isConflictingAttendances",
    value: function isConflictingAttendances() {
      var conflictingGroups = [['AI', 'S2'], ['UE', 'ET', 'YO', 'KE', 'GE', 'TT'], ['RUA', 'RUB'], ['PS', 'FI', 'HI', 'FY', 'BI'], ['MAA', 'MAB']];
      var subjects = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.enrolledAttendances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var attendance = _step.value;
          subjects.push(attendance.subject);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      for (var _i = 0; _i < conflictingGroups.length; _i++) {
        var group = conflictingGroups[_i];

        for (var _i2 = 0; _i2 < subjects.length; _i2++) {
          var subject1 = subjects[_i2];

          for (var _i3 = 0; _i3 < subjects.length; _i3++) {
            var subject2 = subjects[_i3];

            if (subject1 !== subject2 && group.includes(subject1) && group.includes(subject2)) {
              return true;
            }
          }
        }
      }

      return false;
    }
  }, {
    key: "submit",
    value: function submit() {
      fetch("/rest/matriculation/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          name: this.state.name,
          ssn: this.state.ssn,
          email: this.state.email,
          phone: this.state.phone,
          address: this.state.address,
          postalCode: this.state.postalCode,
          city: this.state.locality,
          guider: this.state.guider,
          enrollAs: this.state.enrollAs,
          numMandatoryCourses: this.state.numMandatoryCourses,
          location: this.state.location,
          message: this.state.message,
          studentId: this.state.studentId,
          canPublishName: this.state.canPublishName === 'true',
          attendances: _toConsumableArray(this.state.enrolledAttendances).concat(_toConsumableArray(this.state.plannedAttendances), _toConsumableArray(this.state.finishedAttendances)).map(function (attendance) {
            return {
              subject: attendance.subject,
              mandatory: attendance.mandatory === 'true',
              repeat: attendance.repeat === 'true',
              year: attendance.term ? Number(attendance.term.substring(6)) : null,
              term: attendance.term ? attendance.term.substring(0, 6) : null,
              status: attendance.status,
              grade: attendance.grade
            };
          }),
          state: null
        })
      }).then(function (response) {
        if (!response.ok) {
          this.setState({
            error: response.text()
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      if (!this.state.initialized) {
        return React.createElement(React.Fragment, null);
      }

      return React.createElement(React.Fragment, null, React.createElement("div", {
        className: "header"
      }, React.createElement("a", {
        href: "/"
      }, "Takaisin etusivulle")), this.state.error ? React.createElement("div", {
        class: "error"
      }, this.state.error) : null, React.createElement("form", {
        className: "pure-form pure-form-stacked matriculation-form",
        onSubmit: function onSubmit(e) {
          e.preventDefault();
        }
      }, this.state.page === 1 ? React.createElement(Page1, {
        setPage: function setPage(page) {
          _this3.setState({
            page: page
          });
        }
      }) : null, this.state.page === 2 ? React.createElement(Page2, _extends({}, this.state, {
        setName: function setName(value) {
          _this3.setState({
            name: value
          });
        },
        setSsn: function setSsn(value) {
          _this3.setState({
            ssn: value
          });
        },
        setEmail: function setEmail(value) {
          _this3.setState({
            email: value
          });
        },
        setPhone: function setPhone(value) {
          _this3.setState({
            phone: value
          });
        },
        setAddress: function setAddress(value) {
          _this3.setState({
            address: value
          });
        },
        setPostalCode: function setPostalCode(value) {
          _this3.setState({
            postalCode: value
          });
        },
        setLocality: function setLocality(value) {
          _this3.setState({
            locality: value
          });
        },
        setNationalStudentNumber: function setNationalStudentNumber(value) {
          _this3.setState({
            nationalStudentNumber: value
          });
        },
        setGuider: function setGuider(value) {
          _this3.setState({
            guider: value
          });
        },
        setEnrollAs: function setEnrollAs(value) {
          _this3.setState({
            enrollAs: value
          });
        },
        setNumMandatoryCourses: function setNumMandatoryCourses(value) {
          _this3.setState({
            numMandatoryCourses: value
          });
        },
        enrollAs: this.state.enrollAs,
        setSchoolType: function setSchoolType(enrollAs) {
          _this3.setState({
            enrollAs: enrollAs
          });
        },
        setPage: function setPage(page) {
          _this3.setState({
            page: page
          });
        },
        newEnrolledAttendance: function newEnrolledAttendance() {
          _this3.newEnrolledAttendance();
        },
        newPlannedAttendance: function newPlannedAttendance() {
          _this3.newPlannedAttendance();
        },
        newFinishedAttendance: function newFinishedAttendance() {
          _this3.newFinishedAttendance();
        },
        deleteEnrolledAttendance: function deleteEnrolledAttendance(i) {
          _this3.deleteEnrolledAttendance(i);
        },
        deletePlannedAttendance: function deletePlannedAttendance(i) {
          _this3.deletePlannedAttendance(i);
        },
        deleteFinishedAttendance: function deleteFinishedAttendance(i) {
          _this3.deleteFinishedAttendance(i);
        },
        modifyEnrolledAttendance: function modifyEnrolledAttendance(i, param, value) {
          _this3.modifyEnrolledAttendance(i, param, value);
        },
        modifyPlannedAttendance: function modifyPlannedAttendance(i, param, value) {
          _this3.modifyPlannedAttendance(i, param, value);
        },
        modifyFinishedAttendance: function modifyFinishedAttendance(i, param, value) {
          _this3.modifyFinishedAttendance(i, param, value);
        },
        conflictingAttendances: this.isConflictingAttendances()
      })) : null, this.state.page === 3 ? React.createElement(Page3, _extends({}, this.state, {
        setLocation: function setLocation(location) {
          _this3.setState({
            location: location
          });
        },
        setMessage: function setMessage(message) {
          _this3.setState({
            message: message
          });
        },
        setCanPublishName: function setCanPublishName(canPublishName) {
          _this3.setState({
            canPublishName: canPublishName
          });
        },
        submit: function submit() {
          _this3.submit();
        },
        setPage: function setPage(page) {
          _this3.setState({
            page: page
          });
        }
      })) : null, this.state.page === 4 ? React.createElement(Page4, null) : null));
    }
  }]);

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("react-root"));

