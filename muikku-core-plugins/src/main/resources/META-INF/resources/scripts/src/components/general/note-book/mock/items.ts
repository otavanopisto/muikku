import { WorkspaceNote } from "~/reducers/notebook/notebook";

export const workspaceNotes: WorkspaceNote[] = [
  {
    id: 1,
    owner: 1,
    title: "Muistiinpano 4.",
    workspaceEntityId: 120,
    workspaceNote:
      "<p><em>Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galleyyyyy</em></p>\n",
  },
  {
    id: 3,
    owner: 1,
    title: "Muistiinpano 3.",
    workspaceEntityId: 120,
    workspaceNote:
      "<p><strong><em>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut molestie diam. Duis id ex ipsum. Sed condimentum urna nibh, ac condimentum neque facilisis a. Cras id ligula fermentum, finibus tellus id, cursus dolor. Proin tempus nibh quis volutpat congue. Morbi vehicula eros sit amet augue pellentesque porttitor. Ut sed aliquam magna.</em></strong></p>\n",
  },
  {
    id: 4,
    owner: 1,
    title: "Muistiinpano 2.",
    workspaceEntityId: 120,
    workspaceNote:
      '<p><em>Curabitur rutrum malesuada ullamcorper. Curabitur eros odio, ornare nec elementum ut, condimentum id orci. <span style="background-color:#f1c40f">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed odio quam, consectetur nec arcu id, ornare posuere justo.</span></em></p>\n',
  },
  {
    id: 5,
    owner: 1,
    title: "Muistiinpano 1.",
    workspaceEntityId: 120,
    workspaceNote:
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at nulla eget metus bibendum laoreet eget eget augue. Quisque congue libero ex, feugiat sagittis magna vestibulum a. Nam et bibendum nisl. Phasellus non maximus felis. Ut sit amet vulputate lectus. Donec diam dui, consequat nec blandit vel, pretium et erat. <span style="background-color:#3498db">Suspendisse vitae congue velit. Nullam volutpat velit interdum mauris commodo placerat. Fusce eu facilisis ipsum. Mauris egestas sollicitudin placerat. Duis metus orci, pulvinar a dictum ac, elementum et nisi. Nullam faucibus urna velit, in porttitor libero commodo a. Suspendisse tempus, metus vitae mattis semper, nibh metus fringilla augue, ac auctor enim justo quis nunc. Donec et facilisis eros. Duis ut sem ac urna porta egestas non sed eros</span>.</p>\n\n<p><span style="background-color:#f1c40f">Morbi vel dolor sed odio tempor malesuada. Suspendisse magna libero, dapibus et viverra ut, hendrerit ut dolor.</span> Nunc varius erat semper nibh vehicula porta. Mauris sed facilisis augue. Nunc sit amet ante ultricies, congue leo in, commodo urna. Integer ac lectus egestas, vulputate est id, lacinia metus. Sed eget vehicula erat, ut tincidunt ipsum. <span style="background-color:#f1c40f">Nunc ut sapien sed lorem pretium ultrices</span>. Donec ut eros vel velit interdum varius. Aenean vitae dolor consectetur, lobortis ante non, pulvinar mauris. Fusce dapibus quam et ante euismod laoreet. Integer sollicitudin tortor ante. Sed eu arcu neque. Mauris vitae pharetra nunc, sagittis mollis erat. Sed ipsum sapien, porta quis nulla ac, varius vulputate ligula. Nulla sit amet cursus sapien.</p>\n',
  },
];
