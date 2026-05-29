#!/usr/bin/env node

const DEFAULT_BASE_URL = "http://localhost:3000/api/v1";
const baseUrl = (process.env.BUDDY_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const stamp = Date.now();

const child = {
  username: process.env.BUDDY_SMOKE_CHILD_USERNAME || `smoke_child_${stamp}`,
  password: process.env.BUDDY_SMOKE_CHILD_PASSWORD || "test123",
};

const parent = {
  username: process.env.BUDDY_SMOKE_PARENT_USERNAME || `smoke_parent_${stamp}`,
  password: process.env.BUDDY_SMOKE_PARENT_PASSWORD || "test123",
};

const state = {
  childToken: "",
  parentToken: "",
  childUserId: "",
  petId: "",
};

const checks = [];
let currentStep = "startup";

function record(step, passed, details = {}) {
  checks.push({ step, passed, details });
  const mark = passed ? "PASS" : "FAIL";
  console.log(`[${mark}] ${step}`);
  if (Object.keys(details).length) {
    console.log(JSON.stringify(details, null, 2));
  }
}

function begin(step) {
  currentStep = step;
  console.log(`\n== ${step} ==`);
}

async function request(path, options = {}) {
  const method = options.method || "GET";
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.success === false) {
    throw new Error(
      `${method} ${path} failed against ${baseUrl}: ${response.status} ${JSON.stringify(json)}`
    );
  }
  return json;
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

async function run() {
  console.log(`Buddy MVP smoke flow`);
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Runtime note: Windows is the editing workspace; WSL is the final smoke/runtime workspace.`);

  begin("child register");
  const childRegister = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...child, role: "CHILD" }),
  });
  state.childToken = childRegister.data.token;
  state.childUserId = childRegister.data.user.id;
  record("child register", Boolean(state.childToken && state.childUserId), {
    username: childRegister.data.user.username,
  });

  begin("child login");
  const childLogin = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(child),
  });
  record("child login", childLogin.data.user.username === child.username);

  begin("create pet");
  const petCreate = await request("/pets", {
    method: "POST",
    headers: authHeader(state.childToken),
    body: JSON.stringify({ name: "SmokeBuddy" }),
  });
  state.petId = petCreate.data.pet_id;
  record("create pet", Boolean(state.petId), { petId: state.petId });

  begin("dashboard refresh");
  const dashboard = await request(`/pets/${state.petId}/dashboard`, {
    headers: authHeader(state.childToken),
  });
  record("dashboard refresh", Boolean(dashboard.data.pet?.pet_id), {
    foods: dashboard.data.foods?.length ?? 0,
    inventory: dashboard.data.inventory?.length ?? 0,
    recentEvents: dashboard.data.recent_events?.length ?? 0,
  });

  begin("submit homework reward");
  const homework = await request("/homeworks/submit", {
    method: "POST",
    headers: authHeader(state.childToken),
    body: JSON.stringify({
      subject: "math",
      imageUrl: "/uploads/homeworks/smoke-mvp-flow.png",
      note: "mvp smoke flow",
      petId: state.petId,
    }),
  });
  const rewardItem = homework.data.inventory?.find((item) => item.food_type === "logic_cookie");
  record(
    "submit homework reward",
    homework.data.submission?.rewardStatus === "granted" && Boolean(rewardItem),
    {
      rewardStatus: homework.data.submission?.rewardStatus ?? homework.data.rewardStatus,
      rewardItem,
    }
  );
  if (!rewardItem) {
    throw new Error("homework reward did not return a usable inventory item; cannot continue inventory consume step");
  }

  begin("use inventory reward");
  const useInventory = await request(`/pets/${state.petId}/inventory/use`, {
    method: "POST",
    headers: authHeader(state.childToken),
    body: JSON.stringify({
      itemType: rewardItem.itemType,
      food_type: rewardItem.food_type,
      food_quality: rewardItem.food_quality,
    }),
  });
  record("use inventory reward", Boolean(useInventory.data.pet?.pet_id), {
    logs: useInventory.data.logs?.length ?? 0,
  });

  begin("diary events");
  const events = await request(`/pets/${state.petId}/events?limit=20`, {
    headers: authHeader(state.childToken),
  });
  const hasHomework = events.data.events?.some((event) => event.kind === "homework") ?? false;
  const hasReward = events.data.events?.some((event) => event.kind === "reward") ?? false;
  record("diary events", hasHomework && hasReward, {
    count: events.data.events?.length ?? 0,
    hasHomework,
    hasReward,
  });

  begin("chat send");
  const chat = await request("/chat", {
    method: "POST",
    headers: authHeader(state.childToken),
    body: JSON.stringify({ petId: state.petId, message: "hello smoke buddy" }),
  });
  record("chat send", Boolean(chat.data.reply || chat.data.message), {
    messageId: chat.data.message?.id ?? null,
  });

  begin("parent register");
  const parentRegister = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...parent, role: "PARENT" }),
  });
  state.parentToken = parentRegister.data.token;
  record("parent register", Boolean(state.parentToken), {
    username: parentRegister.data.user.username,
  });

  begin("parent bind child");
  const bind = await request("/parent/bind", {
    method: "POST",
    headers: authHeader(state.parentToken),
    body: JSON.stringify({ child_username: child.username }),
  });
  record("parent bind child", Boolean(bind.data.childId || bind.data.child_id), {
    childId: bind.data.childId || bind.data.child_id,
  });

  begin("parent view child pet");
  const parentPet = await request(`/parent/pet/${state.childUserId}`, {
    headers: authHeader(state.parentToken),
  });
  record("parent view child pet", Boolean(parentPet.data.pet), {
    hasHomework: Boolean(parentPet.data.today_homework),
  });

  begin("parent weekly report");
  const weekly = await request(`/parent/report/weekly?child_id=${state.childUserId}`, {
    headers: authHeader(state.parentToken),
  });
  record("parent weekly report", typeof weekly.data.total_homework === "number", {
    totalHomework: weekly.data.total_homework,
  });

  const passed = checks.every((item) => item.passed);
  console.log(JSON.stringify({ baseUrl, child: child.username, petId: state.petId, passed, checks }, null, 2));
  if (!passed) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("[FAIL] MVP smoke flow aborted");
  console.error(`Current step: ${currentStep}`);
  console.error(`Base URL: ${baseUrl}`);
  console.error(error instanceof Error ? error.message : error);
  console.error("");
  console.error("Troubleshooting:");
  console.error("- Confirm the WSL server is running: curl http://localhost:3000/");
  console.error("- Final release smoke should run inside WSL, not from a stale Windows localhost assumption.");
  console.error(
    "- WSL command: wsl.exe -d Ubuntu-24.04 -- sh -lc \"cd /mnt/e/buddy && BUDDY_API_BASE_URL=http://localhost:3000/api/v1 node tools/smoke-mvp-flow.mjs\""
  );
  console.error("- If the failure is after a PASS step, inspect the named Current step first.");
  process.exitCode = 1;
});
