package fi.otavanopisto.muikku.model.users;

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

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "flag_id", "studentIdentifier_id" })
  }
)
public class FlagStudent {

	public Long getId() {
		return id;
	}
	
	public Flag getFlag() {
    return flag;
  }
	
	public void setFlag(Flag flag) {
    this.flag = flag;
  }

	public UserSchoolDataIdentifier getStudentIdentifier() {
    return studentIdentifier;
  }
	
	public void setStudentIdentifier(UserSchoolDataIdentifier studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }
	
	public Date getCreated() {
    return created;
  }
	
	public void setCreated(Date created) {
    this.created = created;
  }
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
  
  @ManyToOne
  private Flag flag;

	@ManyToOne
  private UserSchoolDataIdentifier studentIdentifier;
  
  @Temporal (TemporalType.TIMESTAMP)
  @Column (nullable = false)
  private Date created;
}