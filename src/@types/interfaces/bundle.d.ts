export interface BundleInterface {
  name: string;
  description: string;
  keys: object;
  marketplace: string;
  admin_notes: string;
  notes: string;
  status: string | 'active' | 'inactive';
  is_deleted: string;
}
