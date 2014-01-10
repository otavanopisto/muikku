package fi.muikku.plugins.dnm.parser.content;

import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

public interface DeusNexFieldElementHandler {

	public Node handleOptionList(Document ownerDocument, String paramName, String type, List<OptionListOption> options, String help, String hint);

	public Node handleTextField(Document ownerDocument, String paramName, Integer columns, List<RightAnswer> rightAnswers, String help, String hint);

	public Node handleConnectField(Document ownerDocument, String paramName, List<ConnectFieldOption> options, String help, String hint);
	 
  public Node handleMemoField(Document ownerDocument, String paramName, Integer columns, Integer rows, String help, String hint);

}
