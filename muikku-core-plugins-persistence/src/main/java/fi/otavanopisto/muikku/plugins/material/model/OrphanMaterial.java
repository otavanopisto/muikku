package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class OrphanMaterial {

  public Long getId() {
    return id;
  }

  @Id
  private Long id;

}
