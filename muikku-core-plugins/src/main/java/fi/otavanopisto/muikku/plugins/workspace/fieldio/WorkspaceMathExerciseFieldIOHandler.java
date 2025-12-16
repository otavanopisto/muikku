package fi.otavanopisto.muikku.plugins.workspace.fieldio;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Entities.EscapeMode;
import org.jsoup.safety.Cleaner;
import org.jsoup.safety.Safelist;

import fi.otavanopisto.muikku.plugins.workspace.WorkspaceMaterialFieldAnswerController;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReply;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialTextFieldAnswer;

public class WorkspaceMathExerciseFieldIOHandler implements WorkspaceFieldIOHandler {

  @Inject
  private WorkspaceMaterialFieldAnswerController workspaceMaterialFieldAnswerController;

  @Override
  public void store(WorkspaceMaterialField field, WorkspaceMaterialReply reply, String value) throws WorkspaceFieldIOException {
    value = clean(value);

    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByFieldAndReply(field, reply);
    if (StringUtils.isNotBlank(value)) {
      if (fieldAnswer == null) {
        fieldAnswer = workspaceMaterialFieldAnswerController.createWorkspaceMaterialTextFieldAnswer(field, reply, value);
      } else {
        fieldAnswer = workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, value);
      }
    } else {
      if (fieldAnswer != null) {
        workspaceMaterialFieldAnswerController.updateWorkspaceMaterialTextFieldAnswerValue(fieldAnswer, null);
      }
    }
  }

  @Override
  public String retrieve(WorkspaceMaterialField field, WorkspaceMaterialReply reply) throws WorkspaceFieldIOException {
    WorkspaceMaterialTextFieldAnswer fieldAnswer = workspaceMaterialFieldAnswerController.findWorkspaceMaterialTextFieldAnswerByFieldAndReply(field, reply);
    if (fieldAnswer != null) {
      return fieldAnswer.getValue();
    }
    
    return null;
  }

  @Override
  public String getType() {
    return "application/vnd.muikku.field.mathexercise";
  }

  private String clean(String html) {
    // Note: Some baseUri is needed but doesn't really matter because of preserveRelativeLinks
    Document doc = Jsoup.parse(html, "https://otavanopisto.muikkuverkko.fi"); 
    doc = new Cleaner(Safelist.relaxed()
        .addAttributes("div", "id", "class")
        .addAttributes("span", "id", "class")
        .addAttributes("img", "class")
        .addProtocols("img", "src", "data")
        .preserveRelativeLinks(true)
        .removeTags("a"))
        .clean(doc);
    doc.select("a[target]").attr("rel", "noopener noreferer");
    doc.outputSettings().escapeMode(EscapeMode.xhtml);
    return doc.body().html();
  }

}
