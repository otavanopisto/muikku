import { useSortable } from "@dnd-kit/react/sortable";
import { Grid } from "@mantine/core";

export interface SortablePanelProps {
  id: number;
  index: number;
  children: React.ReactNode;
}

const SortablePanel = (props: SortablePanelProps) => {
  const { id, index, children } = props;
  const { ref } = useSortable({ id, index });

  return (
    <Grid.Col span={4} ref={ref}>
      {children}
    </Grid.Col>
  );
};

export default SortablePanel;
