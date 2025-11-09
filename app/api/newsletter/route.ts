import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Subscriber = { email: string; name?: string; createdAt: string };

const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

async function readDB(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

async function writeDB(items: Subscriber[]) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = body.name ? String(body.name).trim() : undefined;

    if (!email || !email.includes("@") || email.length > 254) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const db = await readDB();
    if (db.find((s) => s.email === email)) {
      return NextResponse.json({ message: "Email already subscribed" }, { status: 409 });
    }

    const subscriber: Subscriber = { email, name, createdAt: new Date().toISOString() };
    db.push(subscriber);
    await writeDB(db);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
