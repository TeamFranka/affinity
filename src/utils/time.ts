import { dayjs } from "../config/Consts";

export const olderThanDays = (dt: any, days: number) =>
  dayjs().diff(dayjs(dt), "day") > days;
export const since = (dt: any) => dayjs(dt).fromNow();
export const until = (dt: any) => dayjs(dt).fromNow();
export const hasPassed = (dt: any) => dayjs(dt) < dayjs();
export const smartTimestamp = (dt: any) => {
  const now = dayjs();
  const then = dayjs(dt);
  const diffDays = now.diff(then, "d");
  if (diffDays < 1) {
    return then.fromNow();
  } else if (diffDays < 2) {
    return then.format("[Gestern] LT");
  } else if (diffDays < 7) {
    return then.format("ddd LT");
  } else if (diffDays < 14) {
    return then.fromNow();
  } else {
    return then.format("lll");
  }
};
