import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || "{}");
console.log(process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CREDENTIALS);


if (!getApps().length) {
  try {
    // JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || "{}");
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    // Handle the error appropriately, e.g., exit the process
    process.exit(1);
  }
}
interface SetRoleClaimResultSuccess {
  message: string;
  role: string;
}

interface SetRoleClaimResultError {
  error: string;
}

type SetRoleClaimResult = SetRoleClaimResultSuccess | SetRoleClaimResultError;

async function setRoleClaim(
  uid: string,
  role: string
): Promise<SetRoleClaimResult> {
  try {
    const allowedRoles = ["guardian", "health-practitioner"];
    if (!allowedRoles.includes(role)) {
      return { error: "Invalid role specified." };
    }

    await getAuth().setCustomUserClaims(uid, { role });
    console.log(`Custom claim 'role: ${role}' set for user ${uid}`);
    return {
      message: `Custom claim 'role: ${role}' set for user ${uid}`,
      role: role,
    };
  } catch (error: any) {
    console.error("Error setting custom claim:", error);
    return { error: error.message };
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    if (!["guardian", "health-practitioner"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role provided" },
        { status: 400 }
      );
    }

    const userRecord = await getAuth().createUser({
      email: email,
      password: password,
    });

    const result = await setRoleClaim(userRecord.uid, role);
    // if (result.error) return NextResponse.json({ message: result.error }, { status: 400 });

    // return NextResponse.json({ message: 'User created successfully', role: result.role }, { status: 201 });
    if ("error" in result) {
      // Correct type guard
      return NextResponse.json({ message: result.error }, { status: 400 });
    } else {
      // Correctly access role here. result is now known to be SetRoleClaimResultSuccess
      return NextResponse.json(
        { message: "User created successfully", role: result.role },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
