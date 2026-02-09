export type Wish = {
  id: string;
  user_id: string;
  title: string;
  domain: string | null;
  stage: string | null;
  will_source: string | null;
  end_scene: string | null;
  line_seed: string | null;
  pinned: boolean | null;
  last_connected_at: string | null;
  last_level: string | null;
  created_at: string;
  updated_at: string;
};

export type Connection = {
  id: string;
  user_id: string;
  wish_id: string;
  level: string;
  mood: string | null;
  note: string | null;
  connected_at: string;
  created_at: string;
};

export type Fragment = {
  id: string;
  user_id: string;
  source: string;
  content: string;
  linked_wish_ids: string[];
  created_at: string;
};
