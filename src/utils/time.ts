import { dayjs } from "../config/Consts";

export const since = (dt: any) => dayjs(dt).fromNow()