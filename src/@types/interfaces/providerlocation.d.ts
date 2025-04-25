export interface providerlocationInterface {
  user?: string;
  name?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  address?: string;
  category?: string;
}
