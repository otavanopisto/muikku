package fi.otavanopisto.muikku.plugins.ceepos.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CeeposStudyTimeOrder extends CeeposOrder {

  public Date getPreStudyTimeEnd() {
    return preStudyTimeEnd;
  }

  public void setPreStudyTimeEnd(Date preStudyTimeEnd) {
    this.preStudyTimeEnd = preStudyTimeEnd;
  }

  public Date getPostStudyTimeEnd() {
    return postStudyTimeEnd;
  }

  public void setPostStudyTimeEnd(Date postStudyTimeEnd) {
    this.postStudyTimeEnd = postStudyTimeEnd;
  }

  public String getStaffEmail() {
    return staffEmail;
  }

  public void setStaffEmail(String staffEmail) {
    this.staffEmail = staffEmail;
  }

  @NotEmpty
  @NotNull
  @Column(nullable = false)
  private String staffEmail;

  @Temporal (value=TemporalType.DATE)
  private Date preStudyTimeEnd;

  @Temporal (value=TemporalType.DATE)
  private Date postStudyTimeEnd;

}