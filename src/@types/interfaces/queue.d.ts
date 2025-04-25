export interface queueInterface {
  cityId?: string;
  // urls?: [
  //   {
  //     url: string;
  //     status: string;
  //   },
  // ];
  admin_notes?: string;
  notes?: string;
  type?: string;
  urls?: string[];
  addProvider?: boolean;
  status?: string;
  urls_limit?: number;
}
