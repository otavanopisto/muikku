import { Modal } from "@mantine/core";
import { useNavigate, useParams, useSearchParams } from "react-router";

/**
 * Evaluation assessment page
 * @returns Evaluation assessment page
 */
export function EvaluationAssessment() {
  const { assessmentRequestId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /**
   * Handle close modal
   */
  function handleClose() {
    // keep tab/filter when closing
    const search = searchParams.toString();
    void navigate(`/evaluation${search ? `?${search}` : ""}`);
  }

  return (
    <Modal
      opened
      onClose={handleClose}
      fullScreen // or size="xl" — whatever your empty dialog space needs
      title={null} // your own chrome / nav inside
      padding={0}
    >
      {/* new layout + navigation for this assessment */}
      <div>Assessment request: {assessmentRequestId}</div>
    </Modal>
  );
}
