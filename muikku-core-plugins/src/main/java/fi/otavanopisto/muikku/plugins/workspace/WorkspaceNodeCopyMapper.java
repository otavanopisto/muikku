package fi.otavanopisto.muikku.plugins.workspace;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class WorkspaceNodeCopyMapper {
  
  public WorkspaceNodeCopyMapper() {
    idMap = new HashMap<>();
    examIds = new HashSet<>();
  }

  public Map<Long, Long> getIdMap() {
    return idMap;
  }

  public void setIdMap(Map<Long, Long> idMap) {
    this.idMap = idMap;
  }

  public Set<Long> getExamIds() {
    return examIds;
  }

  public void setExamIds(Set<Long> examIds) {
    this.examIds = examIds;
  }
  
  public boolean hasExams() {
    return !examIds.isEmpty();
  }

  private Map<Long, Long> idMap;
  private Set<Long> examIds;

}
