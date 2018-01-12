import { IPhoto, IMetaData, IOrder } from './model';
// All responses from the backend have the following shape
export interface IResponse<T> {
  count: number;
  next: string;
  previous: any;
  results: T[];
}

// Photo model
export interface PhotoType {
  prod: string;
  small: string;
  large: string;
  medium: string;
}

export interface IMetaData {
  name: string;
  id?: number;
}

export interface IPhoto {
  id: number;
  photo: PhotoType;
  motive: string;
  date_taken: Date;
  photo_ppoi: string;
  page: number;
  image_number: number;
  lapel: boolean;
  scanned: boolean;
  on_home_page: boolean;
  splash: boolean;
  tags: IMetaData[];
  category: IMetaData;
  media: IMetaData;
  album: IMetaData;
  place: IMetaData;
  security_level: IMetaData;
  addedToCart?: boolean;
  liked?: boolean;
  checkedForEdit?: boolean;
}

export class PartialPhoto {
  motive: string;
  date_taken: Date;
  photo_ppoi: string;

  lapel: boolean;
  scanned: boolean;
  on_home_page: boolean;
  splash: boolean;
  tags: string[];
  category: number;
  media: number;
  album: number;
  place: number;
  security_level: number;

  /**
   * The constructor partially creates a photo object dependent on properties not being null
   * If a property in photo is null, it will not be included in the constructed object
   * @param photo The object with all IPhoto properties
   */
  constructor(photo) {
    for (const key in photo) {
      if (photo[key] !== null) {
        if (['album', 'category', 'media', 'place', 'security_level'].indexOf(key) !== -1) {
          this[key] = photo[key].id;
        } else if (key === 'date_taken') {
          this[key] = photo[key]['jsdate'].toISOString();
        } else {
          this[key] = photo[key];
        }
      }
    }
  }
}

export class PhotoResponse implements IResponse<IPhoto> {
  count: number;
  next: string;
  previous: string;
  results: IPhoto[];

  constructor(response: IResponse<IPhoto>) {
    this.count = response.count;
    this.next = response.next;
    this.previous = response.previous ? response.previous : undefined;
    this.results = response.results;
  }
}

export interface IUser {
  id?: number;
  username: string;
  address?: string;
  zip_code?: any;
  city?: string;
  phone?: any;
  member_number?: any;
  opptaksaar?: any;
  gjengjobb1?: string;
  gjengjobb2?: string;
  gjengjobb3?: string;
  hjemmeside?: string;
  uker?: string;
  fg_kallenavn?: string;
  bilde?: string;
  aktiv_pang?: boolean;
  aktiv?: boolean;
  comments?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export class User {
  username: string = null;
  address: string = null;
  zip_code: any = null;
  city: string = null;
  phone: any = null;
  member_number: any = null;
  opptaksaar: any = null;
  gjengjobb1?: string = null;
  gjengjobb2?: string = null;
  gjengjobb3?: string = null;
  hjemmeside?: string = null;
  uker?: string = null;
  fg_kallenavn?: string = null;
  bilde?: string = null;
  aktiv_pang = false;
  aktiv: boolean = null;
  comments?: string = null;
  email: string = null;
  first_name: string = null;
  last_name: string = null;
}

export interface IStatistics {
  photos: number;
  tags: number;
  scanned: number;
  albums: number;
  splash: number;
  orders: number;
  photos_by_year: Array<any>;
  photos_per_album: Array<Object>;
}

export interface IOrder {
  name: string;
  id: number;
  email: string;
  address: string;
  place: string;
  zip_code: string;
  post_or_get: string;
  comment: string;
  order_photos: IOrderPhoto[];
  order_completed: boolean;
}

export interface ILatestImageAndPage {
  album: number;
  latest_page: number;
  latest_image_number: number;
}

export interface IOrderPhoto {
  /* photo: IPhoto; */
  photo: number;
  format: string;
  photo_url: string;
}

// export interface IRadio {
//   name: string;
// }

export interface IFilters {
  cursor?: string;
  search?: string;
}

export enum ChangeEnum {
  Edit,
  Delete,
  Create
}

export const testData: IResponse<IPhoto> = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      photo: { prod: 'p', large: 'l', small: 's', medium: 'm' },
      motive: 'desc',
      date_taken: new Date(),
      photo_ppoi: 'ppoi',
      page: 13,
      image_number: 37,
      lapel: false,
      scanned: false,
      on_home_page: false,
      splash: false,
      tags: [{ name: 'tag' }, { name: 'tag2' }],
      category: { name: 'cat' },
      media: { name: 'med' },
      album: { name: 'alb' },
      place: { name: 'plc' },
      security_level: { name: 'alle' }
    }
  ]
};



export interface IForeignKey {
  name: string;
  id?: number;
  date_created?: Date;
  description?: String;
}

export interface IMasonryOptions {
  // layout
  itemSelector?: string;
  columnWidth?: any;
  percentPosition?: boolean;
  gutter?: any;
  stamp?: string;
  fitWidth?: boolean;
  originLeft?: boolean;
  originTop?: boolean;

  // setup
  containerStyle?: {};
  transitionDuration?: any;
  resize?: boolean;
  initLayout?: boolean;
  stagger?: number;

}

export interface ILoginRequest {
  username: string;
  password: string;
  hasFailed?: boolean;
}

export interface IToken {
  user_id: number;
  username: string;
  exp: number;
  email: string;
  orig_iat: number;
}

export interface ILoginResponse {
  username: string;
  groups: string[];
}

export interface ISnack {
  message: string;
  backgroundColorClass?: string; /* positive, negative, or warning */
  icon?: string; /* fontawesome icon */
  duration?: number; /* Duration in milliseconds */
}

export class Snack implements ISnack {
  message: string;
  backgroundColor?: string;
  icon?: string;
  duration?: number;

  constructor(snack: ISnack) {
    if (snack) {
      this.message = snack.message;
      this.backgroundColor = snack.backgroundColorClass ? snack.backgroundColorClass : 'info';
      this.icon = snack.icon;
      this.duration = snack.duration ? snack.duration : 3000;
    }
  }
}
