package fi.otavanopisto.muikku.plugins.communicator.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.Formula;

@Entity
public class CommunicatorMessageId {

  public Long getId() {
    return id;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Formula ("(select max(m.created) from communicatormessage m where m.communicatorMessageId_id = id)")
  private Date lastMessage;
}
