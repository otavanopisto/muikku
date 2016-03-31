package fi.otavanopisto.muikku.errors;

import javax.faces.context.ExceptionHandler;

public class ExceptionHandlerFactory extends javax.faces.context.ExceptionHandlerFactory {
	private final javax.faces.context.ExceptionHandlerFactory parent;

	public ExceptionHandlerFactory(final javax.faces.context.ExceptionHandlerFactory parent) {
		this.parent = parent;
	}

	@Override
	public ExceptionHandler getExceptionHandler() {
		return new fi.otavanopisto.muikku.errors.ExceptionHandler(this.parent.getExceptionHandler());
	}

}
