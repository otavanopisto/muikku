package fi.otavanopisto.muikku.plugins.dnm.parser.content;

import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Node;

import fi.otavanopisto.muikku.plugins.dnm.parser.DeusNexException;
import fi.otavanopisto.muikku.plugins.material.fieldmeta.MultiSelectFieldOptionMeta;

public interface DeusNexFieldElementHandler {

	public Node handleOptionList(Document ownerDocument, String paramName, String type, List<OptionListOption> options, Integer size, String help, String hint) throws DeusNexException;

	public Node handleTextField(Document ownerDocument, String paramName, Integer columns, List<RightAnswer> rightAnswers, String help, String hint) throws DeusNexException;

	public Node handleConnectField(Document ownerDocument, String paramName, List<ConnectFieldOption> options, String help, String hint) throws DeusNexException;
	 
  public Node handleMemoField(Document ownerDocument, String paramName, Integer columns, Integer rows, String help, String hint) throws DeusNexException;

  public Node handleChecklistField(Document ownerDocument, String paramName, List<MultiSelectFieldOptionMeta> options, String helpOf, String hintOf);
  
  public Node handleFileField(Document ownerDocument, String paramName, String help, String hint) throws DeusNexException;


}
