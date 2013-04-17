package fi.muikku.plugins.wall.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PersistenceException;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WallEntry extends AbstractWallEntry {

  public WallEntryVisibility getVisibility() {
    return visibility;
  }

  public void setVisibility(WallEntryVisibility visibility) {
    this.visibility = visibility;
  }

  @Transient
  public List<WallEntryReply> getReplies() {
    return replies;
  }

  public void addReply(WallEntryReply reply) {
    if (replies.contains(reply)) {
      throw new PersistenceException("WallEntry already contains this reply");
    } else {
      if (reply.getWallEntry() != null) {
        reply.getWallEntry().removeReply(reply);
      }
      
      reply.setWallEntry(this);
      replies.add(reply);
    }
  }
  
  public void removeReply(WallEntryReply reply) {
    if (!replies.contains(reply)) {
      throw new PersistenceException("WallEntry does not contain this reply");
    } else {
      reply.setWallEntry(null);
      replies.remove(reply);
    }
  }
  
  private WallEntryVisibility visibility;
  
  @OneToMany
  @JoinColumn (name = "wallEntry_id")
  private List<WallEntryReply> replies = new ArrayList<WallEntryReply>();
}
