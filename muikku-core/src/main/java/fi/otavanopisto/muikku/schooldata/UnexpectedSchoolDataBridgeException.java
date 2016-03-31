package fi.otavanopisto.muikku.schooldata;

public class UnexpectedSchoolDataBridgeException extends SchoolDataBridgeException {

	private static final long serialVersionUID = 4038910859322277591L;

	public UnexpectedSchoolDataBridgeException(Throwable rootCause) {
		super(rootCause);
	}
	
	public UnexpectedSchoolDataBridgeException(String message) {
		super(message);
	}

}
