export interface Post {
  _id: number;
  _createdAt: any;
  title: string;
  description: string;
  author: { name: string; image: string };
  mainImage: string;
  slug: { current: string };
  body: [object];
  comment: Comment[];
}

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: { _ref: string; _type: string };
  _createdAt: string;
  _id: string;
  _ref: string;
  _type: string;
  _updatedAt: string;
}
