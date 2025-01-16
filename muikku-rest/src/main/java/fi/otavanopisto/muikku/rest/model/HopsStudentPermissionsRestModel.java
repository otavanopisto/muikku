package fi.otavanopisto.muikku.rest.model;

public class HopsStudentPermissionsRestModel {

  public HopsStudentPermissionsRestModel() {
  }

  public HopsStudentPermissionsRestModel(boolean isAvailable, boolean canViewDetails, boolean canEdit) {
    this.isAvailable = isAvailable;
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
  
  public boolean getIsAvailable() {
    return isAvailable;
  }

  public void setIsAvailable(boolean isAvailable) {
    this.isAvailable = isAvailable;
  }

  private boolean isAvailable;
  private boolean canViewDetails;
  private boolean canEdit;
}