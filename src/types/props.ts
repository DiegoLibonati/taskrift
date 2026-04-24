// interface DefaultProps {
//   className?: string | undefined;
//   children?: string | undefined;
// }

export interface MenuProps {
  id: string;
  title: string;
}

export interface TaskProps {
  id: string;
  category: string;
  complete: boolean;
  text: string;
}
