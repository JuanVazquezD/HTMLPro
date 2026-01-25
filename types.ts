
export type ElementType = 'title' | 'subtitle' | 'paragraph' | 'image' | 'logo' | 'divider' | 'page-break' | 'table' | 'list' | 'spacer' | 'svg' | 'button' | 'social' | 'columns' | 'icon';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
export type ListType = 'bullets' | 'numbered' | 'checks';
export type ButtonAction = 'link' | 'email' | 'tel' | 'maps' | 'print' | 'export' | 'dictate' | 'save' | 'pdf';

export interface TableCell {
  id: string;
  content: string;
  isHeader?: boolean;
}

export interface TableRow {
  id: string;
  cells: TableCell[];
}

export interface ListItem {
  id: string;
  text: string;
  indent: number;
  checked?: boolean;
}

export interface Column {
  id: string;
  elements: CanvasElement[];
}

export interface ElementStyles {
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  borderRadius?: string;
  opacity?: number;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  width?: string;
  height?: string;
  backgroundGradient?: string;
  fontWeight?: string;
  gap?: string;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: any; 
  styles: ElementStyles;
  link?: string;
  action?: ButtonAction;
  listType?: ListType;
  headingLevel?: HeadingLevel;
  isCollapsed?: boolean;
  socialNetworks?: { type: string; url: string; enabled: boolean }[];
  iconName?: string;
  columnData?: Column[];
}

export type ViewMode = 'web' | 'mobile' | 'email';

export interface AppState {
  elements: CanvasElement[];
  selectedId: string | null;
  viewMode: ViewMode;
  savedSvgs: { name: string; content: string }[];
  zoom: number;
  globalGap: number;
}
