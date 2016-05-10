package fi.otavanopisto.muikku.model.users;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table (
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "flag_id", "userIdentifier_id" })
  }
)
public class FlagShare {

	public Long getId() {
		return id;
	}
	
	public Flag getFlag() {
    return flag;
  }
	
	public void setFlag(Flag flag) {
    this.flag = flag;
  }
	
	public UserSchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }
	
	public void setUserIdentifier(UserSchoolDataIdentifier userIdentifier) {
    this.userIdentifier = userIdentifier;
  }
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
  
  @ManyToOne
  private Flag flag;

	@ManyToOne
  private UserSchoolDataIdentifier userIdentifier;
}