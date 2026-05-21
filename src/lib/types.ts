export interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  mood: NoteMood;
  cover_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface NoteWithTags extends Note {
  note_tags: { tags: Tag }[];
}

export type CreateNoteInput = {
  title: string;
  content: string;
  is_pinned: boolean;
  mood: NoteMood;
  tag_ids: string[];
};

export type UpdateNoteInput = Partial<CreateNoteInput> & { id: string };

export type TagWithCount = Tag & {
  note_count: number;
};

export type NoteMood =
  | "focus"
  | "happy"
  | "idea"
  | "urgent"
  | "calm"
  | "win"
  | "messy"
  | "important";
