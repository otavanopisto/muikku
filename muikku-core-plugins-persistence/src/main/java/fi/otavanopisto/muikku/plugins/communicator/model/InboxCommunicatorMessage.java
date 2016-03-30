package fi.otavanopisto.muikku.plugins.communicator.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class InboxCommunicatorMessage extends CommunicatorMessage {

}
