package fi.muikku.rest.model;

public class User {

  public User() {
  }

  public User(Long id,
              String firstName,
              String lastName, 
              boolean hasImage,
              String nationality,
              String language,
              String municipality,
              String school,
              String email) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.hasImage = hasImage;
    this.nationality = nationality;
    this.language = language;
    this.municipality = municipality;
    this.school = school;
    this.email = email;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
  }

  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getMunicipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private boolean hasImage;
  private String nationality;
  private String language;
  private String municipality;
  private String school;
  private String email;
}
