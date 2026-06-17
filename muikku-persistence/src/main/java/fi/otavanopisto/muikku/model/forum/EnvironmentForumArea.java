package fi.otavanopisto.muikku.model.forum;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class EnvironmentForumArea extends ForumArea {

}
