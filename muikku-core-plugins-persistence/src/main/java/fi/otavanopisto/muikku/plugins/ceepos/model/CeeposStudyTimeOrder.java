package fi.otavanopisto.muikku.plugins.ceepos.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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

  @Temporal (value=TemporalType.DATE)
  private Date preStudyTimeEnd;

  @Temporal (value=TemporalType.DATE)
  private Date postStudyTimeEnd;

}