import { dayjs } from "../config/Consts";

export const since = (dt: any) => dayjs(dt).fromNow()
export const until = (dt: any) => dayjs(dt).fromNow()
export const hasPassed = (dt: any) => dayjs(dt) < dayjs()
export const smartTimestamp = (dt: any) => {
    const now = dayjs();
    const then = dayjs(dt);
    const diffDays = now.diff(then, "d");
    if (diffDays < 1) {
        return then.fromNow()
    } else if (diffDays < 2 ) {
        return then.format("[Gestern] HH:mm")
    } else if (diffDays < 7 ) {
        return then.format("ddd HH:mm")
    } else if (diffDays < 356 ) {
        return then.format("D. MMM HH:mm")
    } else {
        return then.format("D. MMM YY, HH:mm")
    }
};