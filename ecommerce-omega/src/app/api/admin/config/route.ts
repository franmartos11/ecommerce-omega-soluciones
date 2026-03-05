import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the path to the config file
const CONFIG_PATH = path.join(process.cwd(), "src/ConfigJson/config.json");

/**
 * GET - Reads the config.json file and returns its contents.
 * Explicitly avoids caching to always return the fresh config.
 */
export async function GET() {
  try {
    const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
    const json = JSON.parse(fileContent);

    return NextResponse.json(json, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/config] Error reading config file:", error);
    return NextResponse.json(
      { error: "Failed to read configuration file." },
      { status: 500 }
    );
  }
}

/**
 * POST - Receives a full JSON payload and overwrites the config.json file.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic sanity check: ensure body is an object
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid payload: must be a JSON object" },
        { status: 400 }
      );
    }

    // Optional: Updating the `actualizadoEn` field automatically
    body.actualizadoEn = new Date().toISOString();

    // Format the JSON nicely (2 spaces)
    const jsonString = JSON.stringify(body, null, 2);

    // Overwrite the file synchronously to ensure it completes before sending the response
    fs.writeFileSync(CONFIG_PATH, jsonString, "utf-8");

    // Tell Next.js we successfully saved it
    return NextResponse.json({ success: true, message: "Configuration updated successfully." });
  } catch (error) {
    console.error("[POST /api/admin/config] Error writing config file:", error);
    return NextResponse.json(
      { error: "Failed to save the configuration." },
      { status: 500 }
    );
  }
}
