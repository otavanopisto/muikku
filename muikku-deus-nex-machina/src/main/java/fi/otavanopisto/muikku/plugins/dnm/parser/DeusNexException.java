package fi.otavanopisto.muikku.plugins.dnm.parser;

public class DeusNexException extends Exception {

	private static final long serialVersionUID = 1L;

	public DeusNexException(String message) {
		super(message);
	}
	
	public DeusNexException(String message, Throwable cause) {
		super(message, cause);
	}

}
