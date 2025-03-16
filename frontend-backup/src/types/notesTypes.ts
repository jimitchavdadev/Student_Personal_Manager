export interface Notebook {
  id: string;
  name: string;
  sections: Section[];
  expanded: boolean;
}

export interface Section {
  id: string;
  name: string;
  pages: Page[];
  expanded: boolean;
}

export interface Page {
  id: string;
  title: string;
  content: string;
}

export interface ApiNotebook {
  _id: string;
  userId: string;
  name: string;
}

export interface ApiSection {
  _id: string;
  notebookId: string;
  title: string;
}

export interface ApiPage {
  _id: string;
  sectionId: string;
  title: string;
  content: string;
}