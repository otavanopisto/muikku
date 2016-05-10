package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Flag {

	public Long getId() {
		return id;
	}

	public UserSchoolDataIdentifier getOwnerIdentifier() {
    return ownerIdentifier;
  }
	
	public void setOwnerIdentifier(UserSchoolDataIdentifier ownerIdentifier) {
    this.ownerIdentifier = ownerIdentifier;
  }
	
	public String getName() {
    return name;
  }
	
	public void setName(String name) {
    this.name = name;
  }
	
	public String getDescription() {
    return description;
  }
	
	public void setDescription(String description) {
    this.description = description;
  }
	
	public String getColor() {
    return color;
  }
	
	public void setColor(String color) {
    this.color = color;
  }
	
	public Boolean getArchived() {
    return archived;
  }
	
	public void setArchived(Boolean archived) {
    this.archived = archived;
  }
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
  private UserSchoolDataIdentifier ownerIdentifier;
  
	@Column (nullable = false)
	@NotNull
	@NotEmpty
  private String name;
  
	private String description;
  
  @Column (nullable = false)
  @NotNull
  @NotEmpty
  private String color;
  
  @Column (nullable = false)
  @NotNull
  private Boolean archived;
}