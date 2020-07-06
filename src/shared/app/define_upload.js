import { isProd } from "../util";

export const API_UPLOAD_URL = "/api/UploadFile/";
export const API_UPLOAD_DIR = isProd ? "resource/uploads/" : "upload/";
export const FIELD_NAME = "uploadFileEntry";
