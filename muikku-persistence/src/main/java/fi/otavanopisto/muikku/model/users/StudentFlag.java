package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;

@Entity
@Table(
  uniqueConstraints = {
    @UniqueConstraint (columnNames = { "ownerIdentifier_id", "studentIdentifier_id" })
  }    
)
public class StudentFlag {

	public Long getId() {
		return id;
	}

	public UserSchoolDataIdentifier getOwnerIdentifier() {
    return ownerIdentifier;
  }
	
	public void setOwnerIdentifier(UserSchoolDataIdentifier ownerIdentifier) {
    this.ownerIdentifier = ownerIdentifier;
  }
	
	public UserSchoolDataIdentifier getStudentIdentifier() {
    return studentIdentifier;
  }
	
	public void setStudentIdentifier(UserSchoolDataIdentifier studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }
	
	public StudentFlagType getType() {
    return type;
  }
	
	public void setType(StudentFlagType type) {
    this.type = type;
  }
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
  private UserSchoolDataIdentifier ownerIdentifier;
	
  @ManyToOne
  private UserSchoolDataIdentifier studentIdentifier;
  
  @NotNull
  @Column(nullable = false)
  @Enumerated (EnumType.STRING)
  private StudentFlagType type;
}