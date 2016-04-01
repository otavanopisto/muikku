package fi.otavanopisto.muikku.facelets;

import java.io.IOException;
import java.net.URL;

import javax.el.VariableMapper;
import javax.faces.component.UIComponent;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagAttributeException;
import javax.faces.view.facelets.TagConfig;
import javax.faces.view.facelets.TagHandler;

import org.apache.commons.codec.binary.Base64;

import com.sun.faces.facelets.el.VariableMapperWrapper;

public class EmbedJSF extends TagHandler {

  public EmbedJSF(TagConfig config) {
    super(config);
    
    jsfString = getAttribute("jsfString");
  }
  
  @Override
  public void apply(FaceletContext context, UIComponent uiComponent) throws IOException {
    String unencoded = (String) jsfString.getObject(context, String.class);
    String encoded = Base64.encodeBase64String(unencoded.getBytes());
    VariableMapper orig = context.getVariableMapper();
    context.setVariableMapper(new VariableMapperWrapper(orig));
    
    try {
      this.nextHandler.apply(context, null);
      context.includeFacelet(uiComponent, new URL(null, "data://text/plain;base64," + encoded, new DataStreamHandler()));
    } catch (IOException e) {
      throw new TagAttributeException(this.tag, this.jsfString, "Invalid embedded JSF: " + unencoded);
    } finally {
      context.setVariableMapper(orig);
    }
  }
  
  private TagAttribute jsfString;

}
