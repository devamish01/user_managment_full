import type { User } from "@/lib/types";
import { mockDepartments } from "./departments";
import { mockRoles } from "./roles";

const firstNames = [
  "Ava","Noah","Mia","Liam","Sofia","Ethan","Zara","Kai","Aria","Lucas",
  "Isla","Mason","Emma","Elijah","Chloe","Oliver","Amelia","Logan","Harper","Aiden",
  "Zoe","Jackson","Nora","Leo","Layla","Ryan","Ella","Owen","Grace","Sebastian",
  "Ivy","Julian","Willow","Henry","Hazel","Levi","Ruby","Asher","Aurora","Caleb",
  "Stella","Nathan","Violet","Isaac","Mila","Adrian","Nova","Miles","Sadie","Wyatt",
  "Naomi","Dylan","Piper","Eli","Luna","Grayson","Hannah","Cameron","Ariana","Xavier"
];
const lastNames = [
  "Chen","Patel","Rodriguez","Nguyen","Ivanova","Brooks","Ahmed","Anderson","Kim","Martinez",
  "Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Moore","Taylor",
  "Thomas","Jackson","White","Harris","Lewis","Walker","Hall","Allen","Young","King",
  "Wright","Scott","Green","Baker","Adams","Nelson","Carter","Mitchell","Roberts","Turner",
  "Phillips","Campbell","Parker","Evans","Edwards","Collins","Stewart","Sanchez","Morris","Rogers"
];
const jobTitles = [
  "Software Engineer","Senior Engineer","Staff Engineer","Product Manager","Designer",
  "UX Researcher","Marketing Manager","Content Strategist","Sales Executive","Account Manager",
  "Customer Success Manager","Support Specialist","Financial Analyst","People Ops Lead","Recruiter",
  "Data Scientist","QA Engineer","DevOps Engineer","Tech Lead","VP of Engineering"
];

const streets = ["Market St","Sunset Blvd","Baker St","Elm Ave","Broadway","Park Ave","5th Ave","King St","Queen St","Maple Rd","Oak Lane","Pine St","Cedar Ave","Birch Rd","Willow Way"];
const cities = ["San Francisco","New York","London","Berlin","Toronto","Sydney","Singapore","Amsterdam","Paris","Tokyo","Austin","Dublin","Bangalore","Barcelona","Chicago"];
const countries = ["USA","USA","UK","Germany","Canada","Australia","Singapore","Netherlands","France","Japan","USA","Ireland","India","Spain","USA"];
const statuses: User["status"][] = ["active","active","active","active","active","inactive","inactive","blocked"];

function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function generateUsers(count: number): User[] {
  const rand = seededRandom(42);
  const users: User[] = [];
  for (let i = 1; i <= count; i++) {
    const first = pick(firstNames, rand);
    const last = pick(lastNames, rand);
    const name = `${first} ${last}`;
    const roleId = `r${1 + Math.floor(rand() * mockRoles.length)}`;
    const dept = pick(mockDepartments, rand);
    const cityIdx = Math.floor(rand() * cities.length);
    const streetNo = 100 + Math.floor(rand() * 9899);
    const zip = 10000 + Math.floor(rand() * 89999);
    const address = `${streetNo} ${pick(streets, rand)}, ${cities[cityIdx]}, ${countries[cityIdx]} ${zip}`;
    const daysAgoCreated = Math.floor(rand() * 900);
    const daysAgoActive = Math.floor(rand() * 30);
    const created = new Date(Date.now() - daysAgoCreated * 86400000 - Math.floor(rand() * 86400000));
    const active = new Date(Date.now() - daysAgoActive * 86400000 - Math.floor(rand() * 86400000));
    users.push({
      id: `USR-${String(i).padStart(5, "0")}`,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@company.io`,
      phone: `+1 (${200 + Math.floor(rand() * 700)}) ${100 + Math.floor(rand() * 800)}-${1000 + Math.floor(rand() * 8999)}`,
      roleId,
      departmentId: dept.id,
      status: pick(statuses, rand),
      jobTitle: pick(jobTitles, rand),
      location: `${cities[cityIdx]}, ${countries[cityIdx]}`,
      address,
      createdAt: created.toISOString(),
      lastActive: active.toISOString(),
      bio: `${pick(jobTitles, rand)} passionate about building great products and collaborating with a global team.`,
      // Deterministic mock password — never used outside the mock backend.
      password: `${first.toLowerCase()}${i}`,
    });
  }
  return users;
}

export const mockUsers = generateUsers(124);

// Demo accounts — these four users are the only ones whose credentials are
// surfaced in the login UI. Their role assignments anchor the mock to the
// authorization layer's ROLE_DISPLAY map.
mockUsers[0] = {
  ...mockUsers[0],

  id: "USR-00001",

  name: "Aminesh Mahajan",

  email: "superadmin@nexus.com",

  password: "superadmin",

  roleId: "r1",

  status: "active",

  // new auth fields
  username: "amish1",
  firstName: "Aminesh",
  lastName: "Mahajan",

  role: "user",
  roleId: "r1",      // old permission system ke liye

  approvedAt: "2026-07-27T08:45:33.912Z",
  approvedBy: "SYSTEM",

  updatedAt: "2026-07-27T08:45:33.914Z",
};
mockUsers[1] = {
  ...mockUsers[1],
  id: "USR-00002",
  name: "Jordan Reed",
  email: "admin@nexus.com",
  password: "admin",
  roleId: "r2",
  status: "active",
};
mockUsers[2] = {
  ...mockUsers[2],
  id: "USR-00003",
  name: "Sam Rivera",
  email: "manager@nexus.com",
  password: "manager",
  roleId: "r3",
  status: "active",
};
mockUsers[3] = {
  ...mockUsers[3],
  id: "USR-00004",
  name: "Casey Lee",
  email: "viewer@nexus.com",
  password: "viewer",
  roleId: "r4",
  status: "active",
};
