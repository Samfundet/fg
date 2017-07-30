export interface IPhoto {
  prod: string;
  small: string;
  large: string;
  medium: string;
}

export interface IPhotoResult {
  url: string;
  photo: IPhoto;
  description: string;
  date_taken: Date;
  date_modified: Date;
  photo_ppoi: string;
  page: number;
  image_number: number;
  lapel: boolean;
  scanned: boolean;
  on_home_page: boolean;
  tag: string;
  category: string;
  media: string;
  album: string;
  place: string;
}

export interface IPhotoResponse {
  count: number;
  next: string;
  previous?: any;
  results: IPhotoResult[];
}

export class PhotoResponse implements IPhotoResponse {
  count: number;
  next: string;
  previous?: any;
  results: IPhotoResult[];

  constructor(response: IPhotoResponse) {
    this.count = response.count;
    this.next = response.next;
    this.previous = response.previous ? response.previous : undefined;
    this.results = response.results;
  }
}

export const testData: IPhotoResponse = {
  count: 1,
  next: "foo",
  results: [
    {
      url: "foo.bar",
      photo: { prod: "p", large: "l", small: "s", medium: "m" },
      description: "desc",
      date_taken: new Date(),
      date_modified: new Date(),
      photo_ppoi: "ppoi",
      page: 13,
      image_number: 37,
      lapel: false,
      scanned: false,
      on_home_page: false,
      tag: "tag",
      category: "cat",
      media: "med",
      album: "alb",
      place: "plc"
    }
  ]
}
