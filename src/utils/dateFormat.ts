import dayjs from "dayjs";
import { DATE_TIME } from "@/constant/date";
function dateFormat(date: string | Date, format = DATE_TIME) {
  return dayjs(date).format(format);
}

export { dateFormat };
