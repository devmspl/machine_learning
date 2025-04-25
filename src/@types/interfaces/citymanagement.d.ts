export interface CitymanagementInterface {
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  is_deleted?: boolean;
  isPublish?: boolean;
  isActive?: boolean;
}
