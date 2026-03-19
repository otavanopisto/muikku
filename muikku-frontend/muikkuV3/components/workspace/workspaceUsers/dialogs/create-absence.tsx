import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import { ContactRecipientType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import DatePicker from "react-datepicker";
import {
  WorkspaceStudent,
  User,
  GetWorkspaceStudentsRequest,
} from "~/generated/client";
import MApi from "~/api/api";

interface CreateAbsenceDialogProps {
  children?: React.ReactElement;
  workspaceId: number;
  onClose?: () => void;
  onConfirm?: (selectedUsers: ContactRecipientType[]) => void;
}
const workspaceApi = MApi.getWorkspaceApi();

export const CreateAbsenceDialog: React.FC<CreateAbsenceDialogProps> = ({
  onClose,
  onConfirm,
  children,
  workspaceId,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<ContactRecipientType[]>(
    []
  );

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const studentsLoader = (searchTerm: string) => async (): Promise<User[]> => {
    const request: GetWorkspaceStudentsRequest = {
      q: searchTerm,
      workspaceEntityId: workspaceId,
    };

    const search = await workspaceApi.getWorkspaceStudents(request);

    return search.results.map(
      (student: WorkspaceStudent): User => ({
        id: student.userEntityId,
        firstName: student.firstName,
        lastName: student.lastName,
      })
    );
  };

  const content = (onClose: () => void) => (
    <div>
      <div className="form__row">
        <label htmlFor="absent-students">Valitse poissaolijat</label>
        <InputContactsAutofill
          modifier="absence-dialog"
          loaders={{ studentsLoader }}
          hasGroupPermission={false}
          hasStaffPermission={false}
          hasWorkspacePermission={false}
          identifier="absent-students"
          selectedItems={selectedUsers}
          onChange={setSelectedUsers}
          showFullNames
        />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-event">Poissaolotapahtuman nimi</label>
        <input id="absence-event" type="text" />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-description">Poissaolotapahtuma kuvaus</label>
        <textarea id="absence-description" />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-start">Tapahtuman alku</label>
        <DatePicker
          id="absence-start"
          selected={startDate}
          onChange={(date: Date) => setStartDate(date)}
        />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-end">Tapahtuman loppu</label>
        <DatePicker
          id="absence-end"
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
        />
      </div>
    </div>
  );

  const footer = (onClose: () => void) => (
    <div className="dialog-footer">
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleConfirm} disabled={selectedUsers.length === 0}>
        Confirm
      </Button>
    </div>
  );

  const handleUserSelect = (user: ContactRecipientType) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleConfirm = () => {
    onConfirm(selectedUsers);
    setSelectedUsers([]);
  };

  const handleClose = () => {
    setSelectedUsers([]);
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      modifier="create-absence"
      title="Create Absence"
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default CreateAbsenceDialog;
