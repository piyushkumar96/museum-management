export interface IMuseum {
  month: Date;
  america_tropical_interpretive_center: string;
  avila_adobe: string;
  chinese_american_museum: string;
  firehouse_museum: string;
  hellman_quon: string;
  pico_house: string;
  visitor_center_avila_adobe: string;
}

export type IMuseumSearchProperty = {
  date: number;
  ignore?: string;
};

interface IMuseumVisitor {
  museum: string;
  visitors: number;
}

interface IAttendance {
  month: string;
  year: number;
  highest: IMuseumVisitor;
  lowest: IMuseumVisitor;
  ignored?: IMuseumVisitor;
  total: number;
}

export interface IMostAndLeastVisitedMuseumResp {
  attendance: IAttendance;
}
