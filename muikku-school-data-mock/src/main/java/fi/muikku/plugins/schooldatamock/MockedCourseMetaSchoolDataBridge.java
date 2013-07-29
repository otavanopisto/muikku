package fi.muikku.plugins.schooldatamock;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.plugins.schooldatamock.entities.MockedCourseIdentifier;
import fi.muikku.plugins.schooldatamock.entities.MockedSubject;
import fi.muikku.schooldata.CourseMetaSchoolDataBridge;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.entity.CourseIdentifier;
import fi.muikku.schooldata.entity.Subject;

@Dependent
@Stateful
public class MockedCourseMetaSchoolDataBridge extends AbstractMockedSchoolDataBridge implements CourseMetaSchoolDataBridge {

	@Override
	public String getSchoolDataSource() {
		return SchoolDataMockPluginDescriptor.SCHOOL_DATA_SOURCE;
	}

	@Override
	public Subject findSubject(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		try {
			ResultSet resultSet = executeSelect("select id, name from Subject where id = ?", identifier);
			if (resultSet.next()) {
				return new MockedSubject(resultSet.getString(1), resultSet.getString(2));
			}
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public List<Subject> listSubjects() throws UnexpectedSchoolDataBridgeException {
		List<Subject> result = new ArrayList<>();

		try {
			ResultSet resultSet = executeSelect("select id, name from Subject");
			while (resultSet.next()) {
				result.add(new MockedSubject(resultSet.getString(1), resultSet.getString(2)));
			}
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

	@Override
	public CourseIdentifier findCourseIdentifier(String identifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		if (!StringUtils.isNumeric(identifier)) {
			throw new SchoolDataBridgeRequestException("Identifier has to be numeric");
		}

		try {
			ResultSet resultSet = executeSelect("select id, code, subject_id from CourseIdentifier where id = ?", identifier);
			if (resultSet.next()) {
				return new MockedCourseIdentifier(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3));
			}
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return null;
	}

	@Override
	public List<CourseIdentifier> listCourseIdentifiers() throws UnexpectedSchoolDataBridgeException {
		List<CourseIdentifier> result = new ArrayList<>();

		try {
			ResultSet resultSet = executeSelect("select id, code, subject_id from CourseIdentifier");
			while (resultSet.next()) {
				result.add(new MockedCourseIdentifier(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3)));
			}
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}

	@Override
	public List<CourseIdentifier> listCourseIdentifiersBySubject(String subjectIdentifier) throws SchoolDataBridgeRequestException, UnexpectedSchoolDataBridgeException {
		List<CourseIdentifier> result = new ArrayList<>();

		try {
			ResultSet resultSet = executeSelect("select id, code, subject_id from CourseIdentifier where subject_id = ?", subjectIdentifier);
			while (resultSet.next()) {
				result.add(new MockedCourseIdentifier(resultSet.getString(1), resultSet.getString(2), resultSet.getString(3)));
			}
		} catch (SQLException e) {
			throw new UnexpectedSchoolDataBridgeException(e);
		}

		return result;
	}
	
}
