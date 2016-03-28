package fi.otavanopisto.muikku.plugins.material.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QueryConnectFieldCounterpart extends QueryConnectFieldOption {

}
