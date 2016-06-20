package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import fi.otavanopisto.muikku.files.TempFileUtils;
import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswer;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialAudioFieldAnswerClip;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;

public class WorkspaceAudioFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    Clip[] clips = null;
    
    try {
      clips = new ObjectMapper().readValue(value, Clip[].class);
    } catch (IOException e) {
      throw new WorkspaceFieldIOException("Could not unmarshal field reply", e);
    }
    
    WorkspaceMaterialAudioFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialAudioFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer == null) {
      fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialAudioFieldAnswer(field, reply);
    }
    
    List<WorkspaceMaterialAudioFieldAnswerClip> existingClips = workspaceMaterialFieldAnswerController.listWorkspaceMaterialAudioFieldAnswerClipsByFieldAnswer(fieldAnswer);
    List<String> existingClipIds = new ArrayList<>(existingClips.size());
    for (WorkspaceMaterialAudioFieldAnswerClip existingClip : existingClips) {
      existingClipIds.add(existingClip.getClipId());
    }
    
    if (clips.length > 0) {
      for (Clip clip : clips) {
        if (existingClipIds.contains(clip.getId())) {
          // Already existing clip
          existingClipIds.remove(clip.getId());
        } else {
          // New clip
          try {
            byte[] audioData = TempFileUtils.getTempFileData(clip.getId());
            if (audioData == null) {
              throw new WorkspaceFieldIOException("Temp audio does not exist");
            }
            
            workspaceMaterialFieldAnswerController.createWorkspaceMaterialAudioFieldAnswerClip(fieldAnswer, audioData, clip.getContentType(), clip.getId(), clip.getName());
          } catch (IOException e) {
            throw new WorkspaceFieldIOException("Failed to retrieve clip data", e);
          }
        }
      }
      
      // Removed clips
      for (String existingClipId : existingClipIds) {
        WorkspaceMaterialAudioFieldAnswerClip workspaceMaterialAudioFieldAnswerClip = workspaceMaterialFieldAnswerController.findWorkspaceMaterialAudioFieldAnswerClipByClipId(existingClipId);
        if (workspaceMaterialAudioFieldAnswerClip != null) {
          workspaceMaterialFieldAnswerController.deleteWorkspaceMaterialAudioFieldAnswerClip(workspaceMaterialAudioFieldAnswerClip);
        }
      }
       
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException{
    List<Clip> result = new ArrayList<>();
    
    WorkspaceMaterialAudioFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialAudioFieldAnswerByFieldAndReply(field, reply);
    
    if (fieldAnswer != null) {
      List<WorkspaceMaterialAudioFieldAnswerClip> answerClips = workspaceMaterialFieldAnswerController.listWorkspaceMaterialAudioFieldAnswerClipsByFieldAnswer(fieldAnswer);
      for (WorkspaceMaterialAudioFieldAnswerClip answerClip : answerClips) {
        result.add(new Clip(answerClip.getClipId(), answerClip.getFileName(), answerClip.getContentType()));
      }
    }
    
    try {
      return new ObjectMapper().writeValueAsString(result);
    } catch (IOException e) {
      throw new WorkspaceFieldIOException("Could not marshal audio audio response", e);
    }
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.audio";
  }
  
  @SuppressWarnings("unused")
  private static class Clip {
    
    public Clip() {
    }
    
    public Clip(String id, String name, String contentType) {
      this.id = id;
      this.name = name;
      this.contentType = contentType;
    }

    public String getId() {
      return id;
    }
    
    public void setId(String id) {
      this.id = id;
    }
    
    public String getContentType() {
      return contentType;
    }
    
    public void setContentType(String contentType) {
      this.contentType = contentType;
    }
    
    public String getName() {
      return name;
    }
    
    public void setName(String name) {
      this.name = name;
    }
    
    private String id;
    private String name;
    private String contentType;
  }

}
