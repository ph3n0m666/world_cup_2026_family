import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import GroupStandingsView from "@/views/GroupStandingsView.vue";
import MatchesView from "@/views/MatchesView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/results",
    name: "results",
    component: () => import("@/components/PoolResults.vue"),
  },
  {
    path: "/groups/:groupId",
    name: "group",
    component: GroupStandingsView,
    props: true,
  },
  {
    path: "/matches",
    name: "matches",
    component: MatchesView,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
