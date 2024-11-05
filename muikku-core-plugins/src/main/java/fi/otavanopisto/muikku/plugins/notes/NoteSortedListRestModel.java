package fi.otavanopisto.muikku.plugins.notes;

import java.util.List;

public class NoteSortedListRestModel {


  public List<NoteRestModel> getPrivateNotes() {
    return privateNotes;
  }
  public void setPrivateNotes(List<NoteRestModel> privateNotes) {
    this.privateNotes = privateNotes;
  }

  public List<NoteRestModel> getMultiUserNotes() {
    return multiUserNotes;
  }
  public void setMultiUserNotes(List<NoteRestModel> multiUserNotes) {
    this.multiUserNotes = multiUserNotes;
  }

  private List<NoteRestModel> privateNotes;
  private List<NoteRestModel> multiUserNotes;

}