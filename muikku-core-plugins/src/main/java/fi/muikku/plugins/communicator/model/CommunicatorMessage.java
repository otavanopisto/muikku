package fi.muikku.plugins.communicator.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.PersistenceException;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.tranquil.TagEntityResolver;
import fi.muikku.tranquil.UserEntityResolver;
import fi.tranquil.TranquilityEntityField;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class CommunicatorMessage {

  public Long getId() {
    return id;
  }
  
  public CommunicatorMessageId getCommunicatorMessageId() {
    return communicatorMessageId;
  }

  public void setCommunicatorMessageId(CommunicatorMessageId communicatorMessageId) {
    this.communicatorMessageId = communicatorMessageId;
  }

  public String getCaption() {
    return caption;
  }

  public void setCaption(String caption) {
    this.caption = caption;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getSender() {
    return sender;
  }

  public void setSender(Long sender) {
    this.sender = sender;
  }

  public Boolean getArchivedBySender() {
    return archivedBySender;
  }

  public void setArchivedBySender(Boolean archivedBySender) {
    this.archivedBySender = archivedBySender;
  }

  public List<Long> getTags() {
    return tags;
  }
  
  public void setTags(List<Long> tags) {
    this.tags = tags;
  }
  
  public void addTag(Long tagId) {
    if (!tags.contains(tagId)) {
      tags.add(tagId);
    } else {
      throw new PersistenceException("Entity already has this tag");
    }
  }
  
  public void removeTag(Long tagId) {
    if (tags.contains(tagId)) {
      tags.remove(tagId);
    } else {
      throw new PersistenceException("Entity does not have this tag");
    }
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private CommunicatorMessageId communicatorMessageId;

  @Column (name = "sender_id")
  @TranquilityEntityField(UserEntityResolver.class)
  private Long sender;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false, length = 1024)
  private String caption;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  @Lob
  private String content;

  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archivedBySender = Boolean.FALSE;
  
  @ElementCollection
  @CollectionTable (name="communicatormessage_tags", joinColumns=@JoinColumn(name="communicatorMessage"))
  @Column
  @TranquilityEntityField(TagEntityResolver.class)
  private List<Long> tags = new ArrayList<Long>();
}
