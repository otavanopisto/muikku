package fi.otavanopisto.muikku.rest.model;

public class HopsStudentPermissionsRestModel {

  public HopsStudentPermissionsRestModel() {
  }

  public HopsStudentPermissionsRestModel(boolean canViewDetails, boolean canEdit) {
    this.canViewDetails = canViewDetails;
    this.canEdit = canEdit;
  }

  public boolean isCanViewDetails() {
    return canViewDetails;
  }

  public void setCanViewDetails(boolean canViewDetails) {
    this.canViewDetails = canViewDetails;
  }

  public boolean isCanEdit() {
    return canEdit;
  }

  public void setCanEdit(boolean canEdit) {
    this.canEdit = canEdit;
  }

  private boolean canViewDetails;
  private boolean canEdit;
}