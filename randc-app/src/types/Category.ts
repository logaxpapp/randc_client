export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt?: string;

  // The parent's _id
  parentCategory?: string;

  // If you want to store child categories or not:
  children?: Category[]; // optional

  slug?: string;
  tags?: string[];
}
