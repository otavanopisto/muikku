import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import { AnnouncementsType, AnnouncementType } from '~/reducers/announcements';
import DeleteAnnouncementDialog from '../../dialogs/delete-announcement';
import NewEditAnnouncement from '../../dialogs/new-edit-announcement';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain, ApplicationPanelToolbarActionsAside } from '~/components/general/application-panel';
import { ButtonPill } from '~/components/general/button';
import { updateAnnouncement, UpdateAnnouncementTriggerType, RemoveFromAnnouncementsSelectedTriggerType, removeFromAnnouncementsSelected } from '~/actions/announcements';

interface AnnouncerToolbarProps {
  i18n: i18nType,
  announcements: AnnouncementsType,
  updateAnnouncement: UpdateAnnouncementTriggerType,
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType
}

interface AnnouncerToolbarState {

}

class AnnouncerToolbar extends React.Component<AnnouncerToolbarProps, AnnouncerToolbarState> {
  constructor( props: AnnouncerToolbarProps ) {
    super( props );
    this.go = this.go.bind( this );
    this.onGoBackClick = this.onGoBackClick.bind( this );
    this.restoreCurrentAnnouncement = this.restoreCurrentAnnouncement.bind(this);
    this.restoreSelectedAnnouncements = this.restoreSelectedAnnouncements.bind(this);
  }
  restoreCurrentAnnouncement(){
    this.props.updateAnnouncement({
      announcement: this.props.announcements.current,
      update: {
        archived: false
      }
    });
  }
  restoreSelectedAnnouncements(){
    this.props.announcements.selected.map((announcement)=>{
      this.props.updateAnnouncement({
        announcement,
        update: {
          archived: false
        },
        cancelRedirect: true,
      });
      this.props.removeFromAnnouncementsSelected(announcement);
    });
  }
  go( announcement: AnnouncementType ) {
    if ( !announcement ) {
      return;
    }

    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if ( history.replaceState ) {
      history.replaceState( '', '', location.hash.split( "/" )[0] + "/" + announcement.id );
      window.dispatchEvent( new HashChangeEvent( "hashchange" ) );
    } else {
      location.hash = location.hash.split( "/" )[0] + "/" + announcement.id;
    }
  }
  onGoBackClick() {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if ( history.replaceState ) {
      let canGoBack = ( document.referrer.indexOf( window.location.host ) !== -1 ) && ( history.length );
      if ( canGoBack ) {
        history.back();
      } else {
        history.replaceState( '', '', location.hash.split( "/" )[0] );
        window.dispatchEvent( new HashChangeEvent( "hashchange" ) );
      }
    } else {
      location.hash = location.hash.split( "/" )[0];
    }
  }
  render() {
    if ( this.props.announcements.current ) {

      //TODO this should be done more efficiently but the information is not included in the announcement
      //this is why we had to have notOverrideCurrent in the reducers, it's such a mess
      let currentIndex: number = this.props.announcements.announcements.findIndex( ( a: AnnouncementType ) => a.id === this.props.announcements.current.id );
      let next: AnnouncementType = null;
      let prev: AnnouncementType = null;

      if ( currentIndex !== -1 ) {
        next = this.props.announcements.announcements[currentIndex + 1];
        prev = this.props.announcements.announcements[currentIndex - 1];
      }

      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill buttonModifiers="go-back" icon="back" onClick={this.onGoBackClick} />

            <div className="application-panel__tool--current-folder">
              <span className="application-panel__tool-icon icon-folder"></span>
              <span className="application-panel__tool-title">{this.props.i18n.text.get( "plugin.announcer.cat." + this.props.announcements.location )}</span>
            </div>

            <NewEditAnnouncement announcement={this.props.announcements.current}>
              <ButtonPill buttonModifiers="edit" icon="pencil" />
            </NewEditAnnouncement>
            {/* Delete announcement button is hidden in archived folder as backend does not support the feature yet */}
            {this.props.announcements.location !== "archived" ?
              <DeleteAnnouncementDialog announcement={this.props.announcements.current} onDeleteAnnouncementSuccess={this.onGoBackClick}>
                <ButtonPill buttonModifiers="delete" icon="trash" />
              </DeleteAnnouncementDialog>
            : null}
            {this.props.announcements.location === "archived" ?
                <ButtonPill buttonModifiers="restore" icon="undo" onClick={this.restoreCurrentAnnouncement}/> : null}
          </ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolbarActionsAside>
            <ButtonPill buttonModifiers="prev-page" disabled={!prev} onClick={this.go.bind( this, prev )} icon="arrow-left" />
            <ButtonPill buttonModifiers="next-page" disabled={!next} onClick={this.go.bind( this, next )} icon="arrow-right" />
          </ApplicationPanelToolbarActionsAside>
        </ApplicationPanelToolbar>
      )
    } else {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div className="application-panel__tool--current-folder">
              <span className="glyph application-panel__tool-icon icon-folder"></span>
              <span className="application-panel__tool-title">{this.props.i18n.text.get( "plugin.announcer.cat." + this.props.announcements.location )}</span>
            </div>
            {/* Delete announcement button is hidden in archived folder as backend does not support the feature yet */}
            {this.props.announcements.location !== "archived" ?
              <DeleteAnnouncementDialog>
                <ButtonPill buttonModifiers="delete" disabled={this.props.announcements.selected.length === 0} icon="trash"/>
              </DeleteAnnouncementDialog>
            : null }
            {this.props.announcements.location === "archived" ?
              <ButtonPill buttonModifiers="restore" icon="undo" disabled={this.props.announcements.selected.length === 0} onClick={this.restoreSelectedAnnouncements}/> : null}
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      )
    }
  }
}

//TODO this is another one that uses the different version of announcements
function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return bindActionCreators({updateAnnouncement, removeFromAnnouncementsSelected}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerToolbar);
