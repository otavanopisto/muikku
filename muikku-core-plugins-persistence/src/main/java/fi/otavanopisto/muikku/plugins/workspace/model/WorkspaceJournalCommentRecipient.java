package fi.otavanopisto.muikku.plugins.workspace.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(uniqueConstraints = {
    @UniqueConstraint( columnNames = {"userEntityId", "comment_id"} )
  })

public class WorkspaceJournalCommentRecipient {

  public Long getId() {
    return id;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public WorkspaceJournalComment getComment() {
    return comment;
  }

  public void setComment(WorkspaceJournalComment comment) {
    this.comment = comment;
  }

  public Date getReadDate() {
    return readDate;
  }

  public void setReadDate(Date readDate) {
    this.readDate = readDate;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (nullable=false)
  @NotNull
  private Long userEntityId;
  
  @ManyToOne(optional=false)
  @NotNull
  private WorkspaceJournalComment comment;
  
  @Column
  @Temporal (value = TemporalType.TIMESTAMP)
  private Date readDate;
}
