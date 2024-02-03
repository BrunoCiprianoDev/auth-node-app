export interface IPageable {
  page: number;
  size: number;
  order: string;
  orderBy: string;

  getPage(): number;
  getSize(): number;
}
