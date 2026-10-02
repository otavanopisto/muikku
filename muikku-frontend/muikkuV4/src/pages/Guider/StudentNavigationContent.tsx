import { Group, Text, Loader, Title } from "@mantine/core";
import {
  currentStudentDataAtom,
  currentStudentIsLoadingAtom,
} from "src/atoms/guider";
import { useAtomValue } from "jotai";
import { NavbarLink } from "src/components/NavbarLink/NavbarLink";

/**
 * Student navigation content
 */
interface StudentNavigationContentProps {}

/**
 * Student navigation content component
 */
export function StudentNavigationContent(
  _props: StudentNavigationContentProps
) {
  const isLoading = useAtomValue(currentStudentIsLoadingAtom);
  const currentStudentData = useAtomValue(currentStudentDataAtom);

  if (isLoading) {
    return (
      <Group
        gap="sm"
        align="center"
        p="xs"
        style={{ marginLeft: "var(--mantine-spacing-md)" }}
      >
        <Loader size={14} />
        <Text size="sm">Ladataan...</Text>
      </Group>
    );
  }

  if (!currentStudentData) return null;

  return (
    <>
      <Title order={4}>
        {currentStudentData.firstName} {currentStudentData.lastName}
      </Title>

      <NavbarLink
        variant="secondary"
        label="Perustiedot | Tilanne"
        link={`/guider/${currentStudentData.id}`}
        exactMatch
      />
      <NavbarLink
        variant="secondary"
        label="Aktiivisuus"
        link={`/guider/${currentStudentData.id}/activity`}
        exactMatch
      />
      <NavbarLink
        variant="secondary"
        label="Opiskelusuunnitelma (HOPS)"
        link={`/guider/${currentStudentData.id}/hops`}
        exactMatch
      />
      <NavbarLink
        variant="secondary"
        label="Oppimisen tuki"
        link={`/guider/${currentStudentData.id}/pedagogy-support`}
        exactMatch
      />
      <NavbarLink
        variant="secondary"
        label="Ohjaussuhde"
        link={`/guider/${currentStudentData.id}/guidance-relationship`}
        exactMatch
      />
      <NavbarLink
        variant="secondary"
        label="Opintohistoria"
        link={`/guider/${currentStudentData.id}/study-history`}
        exactMatch
      />
      <NavbarLink
        variant="secondary"
        label="Tiedostot"
        link={`/guider/${currentStudentData.id}/files`}
        exactMatch
      />
    </>
  );
}
