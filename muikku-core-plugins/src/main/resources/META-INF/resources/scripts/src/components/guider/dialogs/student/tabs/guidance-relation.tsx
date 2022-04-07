import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";

/**
 * GuidanceRelationProps
 */
interface GuidanceRelationProps {
  i18n: i18nType;
}

/**
 * GuidanceReleation
 * @param props GuidanceRelationProps
 * @returns JSX.element
 */
const GuidanceRelation: React.FC<GuidanceRelationProps> = (props) => {
  const { i18n } = props;
  return (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Header> Ohjussuhde</ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body modifier="guidance-relation">
        <div className="application-sub-panel__section application-sub-panel__section--guidance-relation-contact-info">
          <ApplicationSubPanelItem title="Muu">
            <ApplicationSubPanelItem.Content>
              Suxisuxieiluistamihingän
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem title="Huu">
            <ApplicationSubPanelItem.Content>
              Warsinkinkunneiniitäole ensingän
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        </div>
        <div className="application-sub-panel__section  application-sub-panel__section--guidance-relation-contact-events">
          <div className="application-sub-panel__section-header"></div>
          <div className="application-sub-panel__section-content">
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem>
              asdasd
            </ApplicationSubPanelItem.SubItem>
          </div>
        </div>
        <div className="application-sub-panel__body-section application-sub-panel__body-section--guidance-relation-guidance-events">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu
          ullamcorper leo. Sed interdum eros quis elementum vehicula. Fusce et
          ante lacus. Proin nisl nulla, pellentesque vel lectus in, porta
          dapibus velit. Vivamus interdum posuere purus, et pulvinar dui
          ullamcorper ut. Aenean eu justo tempor, aliquam orci eu, fermentum
          lectus. Praesent eget pretium sapien, sed placerat augue. Maecenas
          nibh metus, sagittis ut nisl ac, feugiat molestie quam. Suspendisse ut
          ipsum arcu. Morbi vitae nisi imperdiet, hendrerit lacus sit amet,
          interdum odio. Fusce lectus arcu, hendrerit eget varius ut, egestas
          vitae elit. In aliquam tincidunt justo, eu efficitur orci pellentesque
          sit amet. Duis odio nisl, dapibus a varius ac, sagittis at ante. Fusce
          tristique facilisis lacus et mollis. Morbi ultricies sapien in purus
          ornare pulvinar. Quisque vehicula sed ligula et aliquet. Cras euismod
          sapien id dictum ultrices. Aliquam volutpat, sem nec tempor consequat,
          arcu augue convallis urna, ut gravida neque enim ultricies metus.
        </div>
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

export default connect(mapStateToProps)(GuidanceRelation);
