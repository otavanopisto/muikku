package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialFileFieldAnswer extends WorkspaceMaterialFieldAnswer {

}
