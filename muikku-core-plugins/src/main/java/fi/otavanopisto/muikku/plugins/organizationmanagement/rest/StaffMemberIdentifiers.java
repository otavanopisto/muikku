package fi.otavanopisto.muikku.plugins.organizationmanagement.rest;

import java.util.List;

public class StaffMemberIdentifiers {

  public List<String> getStaffMemberIdentifiers() {
    return staffMemberIdentifiers;
  }

  public void setStaffMemberIdentifiers(List<String> staffMemberIdentifiers) {
    this.staffMemberIdentifiers = staffMemberIdentifiers;
  }

  private List<String> staffMemberIdentifiers;
}
