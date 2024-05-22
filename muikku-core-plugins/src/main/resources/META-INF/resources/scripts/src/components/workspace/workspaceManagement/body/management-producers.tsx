import * as React from "react";
import { useTranslation } from "react-i18next";
import AddProducer from "~/components/general/add-producer";
import { WorkspaceMaterialProducer } from "~/generated/client";

/**
 * WorkspaceSignupGroups
 */
interface ManagementProducersProps {
  workspaceProducers: WorkspaceMaterialProducer[];
  onChange?: (workspaceProducers: WorkspaceMaterialProducer[]) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementProducers = (props: ManagementProducersProps) => {
  const { workspaceProducers, onChange } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles add producer
   * @param value value
   */
  const handleAddProducer = (value: string) => {
    const updateWorkspaceProducers = [
      ...workspaceProducers,
      {
        name: value,
      },
    ];

    if (onChange) {
      onChange(updateWorkspaceProducers);
    }
  };

  /**
   * Handles remove producer
   * @param index value
   */
  const handleRemoveProducer = (index: number) => {
    const updateWorkspaceProducers = workspaceProducers.splice(index, 1);

    if (onChange) {
      onChange(updateWorkspaceProducers);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.producers", { ns: "users" })}
      </h2>
      {workspaceProducers ? (
        <div className="application-sub-panel__body">
          <AddProducer
            wcagLabel="workspaceProducer"
            removeProducer={handleRemoveProducer}
            addProducer={handleAddProducer}
            producers={workspaceProducers}
          />
        </div>
      ) : null}
    </>
  );
};

export const ManagementProducersMemoized = React.memo(ManagementProducers);
