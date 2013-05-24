package fi.muikku.model.base;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import fi.muikku.security.ContextReference;

@Entity
@Deprecated
public class Environment implements ContextReference {

  public Long getId() {
    return id;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
}
