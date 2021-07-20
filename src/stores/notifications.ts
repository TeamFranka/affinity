import { Parse, Notification } from '@/config/Consts'
import { genFeedState } from './globals'

const MODEL_KEYS = ['by', 'for', 'objects']

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotificationsT {}

const Notifications = genFeedState({
  keyword: 'notifications',
  fullQueryFn: () =>
    new Parse.Query(Notification).include(MODEL_KEYS).descending('createdAt'),
  ignoreTeamSelection: true,
  keys: MODEL_KEYS,
})

Notifications.getters.unread = (
  _state: any,
  _getters: any,
  _rootState: any,
  rootGetters: any
) => {
  const notifications = rootGetters['notifications/entries']
  return notifications.filter((notification: any) => !notification.seenAt)
}

Notifications.actions.markRead = (context: any) => {
  const unreadNotifications = context.rootGetters['notifications/unread']
  unreadNotifications.forEach(async (notification: any) => {
    const query = new Parse.Query(Notification).equalTo(
      'objectId',
      notification.objectId
    )
    const object = await query.first()
    if (object) {
      object.set('seenAt', new Date())
      object.save()
    }
  })
}

export { Notifications }
