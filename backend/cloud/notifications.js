/* global Parse */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./common')
const fetchModel = common.fetchModel

Parse.Cloud.afterSave(
  'Notification',
  async (request) => {
    const notification = await fetchModel(request, request.object, [
      'by',
      'for',
      'objects',
    ])
  },
  {
    requireUser: true,
  }
)
