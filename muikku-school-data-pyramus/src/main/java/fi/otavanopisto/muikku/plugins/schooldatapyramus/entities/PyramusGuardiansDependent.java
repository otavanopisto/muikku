package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.GuardiansDependent;

public class PyramusGuardiansDependent implements GuardiansDependent {

  public PyramusGuardiansDependent(SchoolDataIdentifier userIdentifier, String firstName, String lastName,
      String nickname) {
    this.userIdentifier = userIdentifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickname = nickname;
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

  private final SchoolDataIdentifier userIdentifier;
  private final String firstName;
  private final String lastName;
  private final String nickname;
}
