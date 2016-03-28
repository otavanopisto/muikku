package fi.otavanopisto.muikku.schooldata;

public class SchoolDataBridgeException extends Exception {
	
	private static final long serialVersionUID = -3353362676991470842L;

	public SchoolDataBridgeException(Throwable rootCause) {
		super(rootCause);
	}

	public SchoolDataBridgeException(String message) {
		super(message);
	}

}
