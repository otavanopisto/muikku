package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.security.ContextReference;

@Entity
public class UserEmailEntity implements ContextReference {

  /**
   * Returns the identifier of this entity.
   * 
   * @return The identifier of this entity
   */
  public Long getId() {
    return id;
  }
  
  public UserSchoolDataIdentifier getUserSchoolDataIdentifier() {
    return userSchoolDataIdentifier;
  }

  public void setUserSchoolDataIdentifier(UserSchoolDataIdentifier userSchoolDataIdentifier) {
    this.userSchoolDataIdentifier = userSchoolDataIdentifier;
  }
  
  /**
   * Returns the email address of this entity.
   * 
   * @return The email address of this entity.
   */
  public String getAddress() {
    return address;
  }

  /**
   * Sets the email address of this entity.
   * 
   * @param address The email address of this entity
   */
  public void setAddress(String address) {
    this.address = address;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserSchoolDataIdentifier userSchoolDataIdentifier;

  @NotNull
  @Column(nullable = false, unique = true)
  @NotEmpty
  @Email
  private String address;

}
