package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterialFileFieldAnswer extends WorkspaceMaterialFieldAnswer {

}
