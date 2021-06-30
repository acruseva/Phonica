import { Identifiable, IdType } from "./common-types";

export class Product implements Identifiable {
    static typeId = 'Product';
  
    id: IdType;
    constructor(
      public name: string,
      public price: number,
      public description?: string,
      public image?: string
    ) {}
  }