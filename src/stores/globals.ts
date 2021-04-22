import { Parse } from "@/config/Consts";
import { Model, SaveModel, toModel } from "@/utils/model";

const ITEMS_PER_PAGE = 25;

export type Feed = {
  loading: boolean;
  subcounts: number;
  subscription: any;
  alive: boolean;
  entries: Array<string>;
  keys: Array<string>;
  query: Parse.Query;
  currentPos: number;
  total: number;
}

export type QueryFeed = {
  id: string;
  query: Parse.Query;
  keys: Array<string>;
}

type QueryUpdate = {
  feedId: string;
  objectId: string;
};

export interface GlobalStateT {
  loadingCounter: number;
  defaultTeamId: string;
  objects: Record<string, Model>;
  teamsBySlug: Record<string, string>;
  feeds: Record<string, Feed>;
}

export const GlobalState = {
  state: () => ({
    loadingCounter: 0,
    objects: {},
    feeds: {},
    defaultTeamId: (window as any) ? (window as any).AFFINITY_DEFAULT_TEAM : "",
    teamsBySlug: {},
  }),
  getters: {
    defaultTeamId(state: GlobalStateT): string {
      return state.defaultTeamId;
    },
    defaultTeam(state: GlobalStateT): Model | null {
      return state.objects[state.defaultTeamId];
    },
    objectsMap(state: GlobalStateT): Record<string, Model> {
      return state.objects;
    },
    feeds(state: GlobalStateT): Record<string, Feed> {
      return state.feeds;
    },
    teamsBySlug(state: GlobalStateT) {
      return state.teamsBySlug;
    },
    isLoading(state: GlobalStateT): boolean {
      return state.loadingCounter < 1;
    },
  },
  mutations: {
    setItems(state: GlobalStateT, items: Array<Parse.Object | Model>) {
      items.forEach((item) => {
        const model: Model = item instanceof Model ? item : toModel(item);
        state.objects[model.objectId] = model;
        if (model.className == "Team") {
          state.teamsBySlug[model.slug] = model.objectId;
        }
      });
    },
    setItem(state: GlobalStateT, model: Model) {
      state.objects[model.objectId] = model;
      if (model.className == "Team") {
        state.teamsBySlug[model.slug] = model.objectId;
      }
    },
    setDefaultTeamId(state: GlobalStateT, teamId: string) {
      state.defaultTeamId = teamId;
    },
    setGlobalTeam(state: GlobalStateT, team: Model) {
      state.objects[team.objectId] = team;
      state.defaultTeamId = team.objectId;
      state.teamsBySlug[team.slug] = team.objectId;
    },
    startLoading(state: GlobalStateT) {
      state.loadingCounter += 1;
    },
    doneLoading(state: GlobalStateT) {
      state.loadingCounter -= 1;
    },
    // Feed and SubscriptionStuff
    updateFeed(state: GlobalStateT, update: {feedId: string, feed: any}) {
      state.feeds[update.feedId] = Object.assign(state.feeds[update.feedId] || {}, update.feed);
    },
    incrementSubscribers(state: GlobalStateT, feedId: string) {
      state.feeds[feedId].subcounts += 1;
    },
    decrementSubscribers(state: GlobalStateT, feedId: string) {
      state.feeds[feedId].subcounts -= 1;
    },
    feedSubscriptionClosed(state: GlobalStateT, update: QueryUpdate) {
      state.feeds[update.feedId].subscription = null;
    },
    feedEntryCreated(state: GlobalStateT, update: QueryUpdate) {
      const feed = state.feeds[update.feedId];
      if (feed) {
        feed.entries.unshift(update.objectId);
        feed.currentPos += 1;
        feed.total += 1;
      }
    },
    feedEntryRemoved(state: GlobalStateT, update: QueryUpdate) {
      const feed = state.feeds[update.feedId];
      if (feed) {
        feed.entries = feed.entries.filter((x:string) => x !== update.objectId);
        feed.currentPos -= 1;
        feed.total -= 1;
      }
    },
    addFeedItems(state: GlobalStateT, update: {feedId: string, items: Array<string>, total: number}) {
      const { feedId, items, total } = update;
      const feed = state.feeds[feedId];
      if (!feed) {
        console.error("Unknown feed");
        return
      }
      if (feed) {
        feed.total = total;
        feed.currentPos += items.length;
        feed.entries = feed.entries.concat(items);
        feed.loading = false;
      }
    },
  },
  actions: {
    fetchDefaultTeam(context: any, teamId: string) {
      context.commit("setDefaultTeamId", teamId);
      context.commit("startLoading");
      new Parse.Query("Team").get(teamId).then(
        (resp) => {
          context.commit("setGlobalTeam", toModel(resp));
          context.commit("doneLoading");
        },
        (err) => {
          console.error("fetching default team failed", err);
          context.commit("doneLoading");
        }
      );
    },
    refreshRoot(context: any) {
      context.dispatch("news/refresh");
      context.dispatch("feed/refresh");
      context.dispatch("faq/refresh");
      context.dispatch("inbox/refresh");
    },
    init(context: any) {
      context.dispatch("auth/init");
    },
    routingStart(context: any) {
      context.commit("startLoading");
    },
    routingEnd(context: any) {
      context.commit("doneLoading");
    },
    addItems(context: any, inp: any) {
      const { items, key, keys } = inp;
      const found: Array<Parse.Object | Model> = [];
      const toLookUp: Record<string, Array<string>> = {};
      const sort = (p: Parse.Object) => {
        const m = toModel(p);
        if (m.isDataAvailable()) {
          found.push(m);
        } else {
          if (!context.state.objects[m.objectId]?.isDataAvailable()) {
            if (!toLookUp[m.className]) {
              toLookUp[m.className] = [m.objectId];
            } else {
              toLookUp[m.className].push(m.objectId);
            }
          }
        }
      };
      const sortMany = (i: any) =>
        Array.isArray(i) ? i.forEach(sort) : sort(i);
      items.forEach((i: Parse.Object) => {
        key && sortMany(i.get(key) || []);
        keys && keys.forEach((key: string) => sortMany(i.get(key) || []));
        sort(i);
      });

      if (found.length > 0) {
        context.commit("setItems", found);
      }

      Object.keys(toLookUp).forEach((k) => {
        new Parse.Query(k)
          .containedIn("id", toLookUp[k])
          .find()
          .then((resp) => {
            context.commit("setItems", resp);
          });
      });
    },
    async updateModel(context: any, info: SaveModel) {
      const model = info.toParse();
      await model.save();
      context.commit("setItem", toModel(model));
    },
    async fetchModel(context: any, info: any) {
      const { className, objectId, includes } = info;
      const query = new Parse.Query(className);
      (includes || []).forEach((k: string) => query.include(k));
      const model = await query.get(objectId);
      let items = [model];
      (includes || []).forEach((k: string) => {
        const m = model.get(k);
        if (!m) return;
        if (Array.isArray(m)) {
          items = items.concat(m);
        } else {
          items.push(m);
        }
      });

      context.commit("setItems", items);
    },
    async queryFeed(context: any, feedQuery: QueryFeed) {
      if (!context.state.feeds[feedQuery.id]) {

        const feed: Feed = {
          loading: false,
          subscription: null,
          subcounts: 0,
          alive: false,
          keys: feedQuery.keys,
          entries: [],
          currentPos: 0,
          total: 0,
          query: feedQuery.query.withCount(true),
        };
        await context.commit("updateFeed", {feedId: feedQuery.id, feed});
        context.dispatch("loadMore", feedQuery.id)
      }
      if (!context.state.feeds[feedQuery.id].subscription) {
        context.dispatch("makeSubscription", feedQuery);
      }

      await context.commit("incrementSubscribers", feedQuery.id);
    },
    async loadMore(context: any, feedId: string) {
      const feed: Feed = context.state.feeds[feedId];
      if (feed.loading) { return }

      await context.commit("updateFeed", {feedId, feed: {loading: true}});

      const query = feed.query
        .limit(ITEMS_PER_PAGE)
        .skip(feed.currentPos)
        .withCount(true);

      // and query in background
      query.find().then(async (data: any) => {
        const { results, count } = data;
        await context.dispatch("addItems", {keys: feed.keys, items: results});
        await context.commit("addFeedItems", {
          feedId,
          items: results.map((x: Parse.Object) => x.id),
          total: count,
        });
      }, (e) => {
        //  failure
        console.error(e);
      });

    },
    async makeSubscription(context: any, q: QueryFeed) {
      const { id, query, keys } = q;
      const subscription = await query.subscribe();
      subscription.on("create", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        await context.commit("feedEntryCreated", {feedId: id, objectId: object.id});
      });
      subscription.on("enter", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        await context.commit("feedEntryCreated", {feedId: id, objectId: object.id});
      });

      subscription.on("update", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
      });

      subscription.on("delete", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        await context.commit("feedEntryRemoved", {feedId: id, objectId: object.id});
      });
      subscription.on("leave", async (object: Parse.Object) => {
        await context.dispatch("addItems", { keys, items: [object] });
        await context.commit("feedEntryRemoved", {feedId: id, objectId: object.id});
      });
      subscription.on('close', async () => {
        await context.commit("updateFeed", { feedId: id, feed: {alive: false, subscription: null} });
        // restart it?
        if (context.state.feeds[id].subcount > 0) {
          context.dispatch("makeSubscription", q);
        }
      });
      await context.commit("updateFeed", {feedId: id, feed: {subscription, alive: true}});
    },
    leavingFeed(context: any, id: string) {
      context.commmit("decrementSubscribers", id);
    },
  },
};
