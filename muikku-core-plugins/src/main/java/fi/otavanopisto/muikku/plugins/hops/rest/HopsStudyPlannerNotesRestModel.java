package fi.otavanopisto.muikku.plugins.hops.rest;

import java.util.List;

public class HopsStudyPlannerNotesRestModel {

  public List<HopsStudyPlannerNoteRestModel> getNotes() {
    return notes;
  }

  public void setNotes(List<HopsStudyPlannerNoteRestModel> notes) {
    this.notes = notes;
  }

  private List<HopsStudyPlannerNoteRestModel> notes;

}
