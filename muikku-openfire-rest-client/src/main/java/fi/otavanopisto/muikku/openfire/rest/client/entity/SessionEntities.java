package fi.otavanopisto.muikku.openfire.rest.client.entity;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "sessions")
public class SessionEntities {
	List<SessionEntity> sessions;

	public SessionEntities() {
	}

	public SessionEntities(List<SessionEntity> sessions) {
		this.sessions = sessions;
	}

	@XmlElement(name = "session")
	public List<SessionEntity> getSessions() {
		return sessions;
	}

	public void setSessions(List<SessionEntity> sessions) {
		this.sessions = sessions;
	}
}
