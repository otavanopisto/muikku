package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;

public class PyramusGuardiansDependent implements GuardiansDependent {

  public PyramusGuardiansDependent(SchoolDataIdentifier userIdentifier, String firstName, String lastName,
      String nickname, String studyProgrammeName, String email, String phoneNumber, String address) {
    this.userIdentifier = userIdentifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickname = nickname;
    this.studyProgrammeName = studyProgrammeName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }

  @Override
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getFirstName() {
    return firstName;
  }

  @Override
  public String getLastName() {
    return lastName;
  }

  @Override
  public String getNickName() {
    return nickname;
  }

  @Override
  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  @Override
  public String getEmail() {
    return email;
  }

  @Override
  public String getPhoneNumber() {
    return phoneNumber;
  }

  @Override
  public String getAddress() {
    return address;
  }

  private final SchoolDataIdentifier userIdentifier;
  private final String firstName;
  private final String lastName;
  private final String nickname;
  private final String studyProgrammeName;
  private final String email;
  private final String phoneNumber;
  private final String address;
}
