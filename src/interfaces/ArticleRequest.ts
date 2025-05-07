import { ArticleType } from "src/types/articleType";

export interface PdfRequestBody {
  data: ArticleType[];
}

export interface PdfRequest {
  body: PdfRequestBody;
}