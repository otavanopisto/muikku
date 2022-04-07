import * as React from "react";
import { Textarea } from "../text-area";
import { CheckboxGroupItem, ScaleInputGroup } from "../hops-input-groups";
import AnimateHeight from "react-animate-height";
import { InputGroup } from "../hops-input-groups";
import { HopsMotivationAndStudy } from "~/@types/shared";
import { HopsBaseProps } from "..";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { EmptyRow, HopsInputTable, InputRow } from "../hops-input-table";

/**
 * MotivationAndStudySkillsProps
 */
interface HopsMotivationAndStudySkillsProps extends HopsBaseProps {
  onMotivationAndStudyChange: (
    motivationAndStudy: HopsMotivationAndStudy
  ) => void;
  motivationAndStudy: HopsMotivationAndStudy;
}

/**
 * MotivationAndStudySkillsState
 */
interface HopsMotivationAndStudySkillsState {
  someOtherWay: boolean;
  someOtherMethod: boolean;
  somethingElse: boolean;
}

/**
 * MotivationAndStudySkills
 */
class HopsMotivationAndStudySkills extends React.Component<
  HopsMotivationAndStudySkillsProps,
  HopsMotivationAndStudySkillsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: HopsMotivationAndStudySkillsProps) {
    super(props);

    this.state = {
      someOtherWay: false,
      someOtherMethod: false,
      somethingElse: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    /* this.setState({
      someOtherWay: this.props.motivationAndStudy.someOtherWay !== undefined,
      someOtherMethod:
        this.props.motivationAndStudy.someOtherMethod !== undefined,
      somethingElse: this.props.motivationAndStudy.somethingElse !== undefined,
    }); */
  };

  /**
   * Handles textarea changes
   *
   * @param name keyof HopsMotivationAndStudy
   */
  handleTextareaChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: {
          ...this.props.motivationAndStudy[name],
          [e.currentTarget.name]: e.currentTarget.value,
        },
      });
    };

  /**
   * Handles checkbox else changes
   *
   * @param name keyof MotivationAndStudySkillsState
   */
  handleCheckboxElseChanges =
    (name: keyof HopsMotivationAndStudySkillsState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: e.target.checked ? "" : undefined,
      });

      this.setState({
        ...this.state,
        [name]: e.target.checked,
      });
    };

  /**
   * Handles scale range changes depending of property
   *
   * @param name name
   */
  handleScaleRangeChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: {
          ...this.props.motivationAndStudy[name],
          [e.currentTarget.name]: parseInt(e.currentTarget.value),
        },
      });
    };

  /**
   * Handles checkbox item change depending of property
   *
   * @param name keyof HopsMotivationAndStudy
   */
  handleCheckboxItemChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: {
          ...this.props.motivationAndStudy[name],
          [e.target.name]: e.target.checked,
        },
      });
    };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    const { wayToLearn, studySupport, selfImageAsStudent } =
      this.props.motivationAndStudy;

    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Opiskelutavat</legend>

          <div className="hops-container__row">
            <div className="hops-container__table-container">
              <HopsInputTable>
                <InputRow
                  label="Oppimateriaalin lukeminen"
                  selectedValue={wayToLearn.byReadingMaterials}
                  groupName="byReadingMaterials"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Muistiinpanojen tekeminen (esim. miellekartat)"
                  selectedValue={wayToLearn.byTakingNotes}
                  groupName="byTakingNotes"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Tehtävien tekeminen"
                  selectedValue={wayToLearn.byDoingExcercises}
                  groupName="byDoingExcercises"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Asian ulkoa opetteleminen"
                  selectedValue={wayToLearn.byMemorizing}
                  groupName="byMemorizing"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Videoiden katsominen"
                  selectedValue={wayToLearn.byWatchingVideos}
                  groupName="byWatchingVideos"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Opetuksen kuunteleminen"
                  selectedValue={wayToLearn.byListeningTeaching}
                  groupName="byListeningTeaching"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Asian selittäminen toiselle"
                  selectedValue={wayToLearn.byExplaining}
                  groupName="byExplaining"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Muiden kanssa keskusteleminen"
                  selectedValue={wayToLearn.byDiscussing}
                  groupName="byDiscussing"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Toisen tekemisen tai käytännön esimerkkien seuraaminen"
                  selectedValue={wayToLearn.byWatchingOrDoingExamples}
                  groupName="byWatchingOrDoingExamples"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
              </HopsInputTable>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                label="Jos haluat, voit kertoa tarkemmin itsellesi sopivista opiskelutavoista"
                name="someOtherWay"
                value={wayToLearn.someOtherWay}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("wayToLearn")}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Keneltä saat tukea opiskeluusi Nettiperuskoulun ohjaajien ja
            opettajien lisäksi?
          </legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops__label">Perheenjäseneltä</label>
              <input
                type="checkbox"
                name="fromFamilyMember"
                className="hops__input"
                checked={studySupport.fromFamilyMember}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops__label">Ystävältä</label>
              <input
                type="checkbox"
                name="fromFriend"
                className="hops__input"
                checked={studySupport.fromFriend}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops__label">Tukihenkilöltä</label>
              <input
                type="checkbox"
                name="fromSupportPerson"
                className="hops__input"
                checked={studySupport.fromSupportPerson}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops__label">En saa tukea</label>
              <input
                type="checkbox"
                name="noSupport"
                className="hops__input"
                checked={studySupport.noSupport}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops__label">Joku muu</label>
              <input
                type="checkbox"
                name="somethingElse"
                className="hops__input"
                checked={studySupport.somethingElse}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>

          <AnimateHeight height={studySupport.somethingElse ? "auto" : 0}>
            <div className="hops__form-element-container">
              <Textarea
                label="Kerro tarkemmin"
                name="somethingElseWhat"
                value={studySupport.somethingElseWhat}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("studySupport")}
              />
            </div>
          </AnimateHeight>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Arvioi, miten hyvin tai huonosti seuraavat väitteet kuvaavat sinua
            opiskelijana:
          </legend>
          <div className="hops-container__row">
            <div className="hops-container__table-container">
              <HopsInputTable>
                <InputRow
                  label="Opiskeleminen on minusta mukavaa"
                  selectedValue={selfImageAsStudent.likeStudying}
                  groupName="likeStudying"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Minulla on tavoitteita opinnoilleni"
                  selectedValue={selfImageAsStudent.haveGoals}
                  groupName="haveGoals"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Olen valmis tekemään töitä saavuttaakseni tavoitteeni"
                  selectedValue={selfImageAsStudent.readyToAchieveGoals}
                  groupName="readyToAchieveGoals"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Teen aina aloittamani työt loppuun"
                  selectedValue={selfImageAsStudent.alwaysFinishJobs}
                  groupName="alwaysFinishJobs"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Teen annetut tehtävät sovitussa aikataulussa"
                  selectedValue={selfImageAsStudent.bePedantic}
                  groupName="bePedantic"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Ajatukseni ei lähde harhailemaan, kun opiskelen"
                  selectedValue={selfImageAsStudent.studyingConcentration}
                  groupName="studyingConcentration"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Pystyn työskentelemään, vaikka ympärilläni olisi häiriöitä"
                  selectedValue={selfImageAsStudent.affectedByNoise}
                  groupName="affectedByNoise"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Pystyn seuraamaan ohjeita ja toimimaan niiden mukaisesti"
                  selectedValue={selfImageAsStudent.canFollowInstructions}
                  groupName="canFollowInstructions"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Osaan arvioida, missä olen onnistunut ja missä epäonnistunut"
                  selectedValue={selfImageAsStudent.canEvaluateOwnWork}
                  groupName="canEvaluateOwnWork"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Otan mielelläni vastaan myös korjaavaa palautetta"
                  selectedValue={selfImageAsStudent.canTakeFeedback}
                  groupName="canTakeFeedback"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={6} modifiers={["empty"]} />
                <InputRow
                  label="Osaan käyttää tietokoneella yleisimpiä sovelluksia kuten internet-selainta ja sähköpostia"
                  selectedValue={
                    selfImageAsStudent.canUseBasicComputerFunctionalities
                  }
                  groupName="canUseBasicComputerFunctionalities"
                  disabled={false}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
              </HopsInputTable>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                label="Jos haluat, voit kertoa tarkemmin sinusta opiskelijana"
                name="somethingElse"
                value={selfImageAsStudent.somethingElse}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("selfImageAsStudent")}
              />
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                label="Millaista tukea toivot Nettiperuskoulun ohjaajalta ja opettajilta?"
                name="wishesForTeachersAndSupervisors"
                value={selfImageAsStudent.wishesForTeachersAndSupervisors}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("selfImageAsStudent")}
              />
            </div>
          </div>
        </fieldset>

        {/*  <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Muuta?</legend>


        </fieldset> */}
      </div>
    );
  }
}

export default HopsMotivationAndStudySkills;
