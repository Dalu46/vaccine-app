import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: "vaxtrack-98582",
  private_key_id: "fffe771a4efd7c9c3ccd664d7c44a636dbd1943f",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQChFzvZ2zzHsHnW\nTUTtNvYO5y1YIFw9XpY6IbXYtcztf5xkFok/38h1kxisQjaO1QCcYV/d1v3u1Ce0\nqSBEjPK9Qqi0GBLtAU/obcBNy2sVJYzco4Qe8r88inrr6GsZXMGfCpEU3ZfKH1OB\nUObv72sMolsLmlp9J2cKp1cbDESq0aen86Q0livCFEiYR7Dyv+hf+g4WDzwNowjl\nj4U3zN2wMp/tvS/y7qAlke9pAoCouo+r9nVqvgtN0CLM/686B0ZEBIa/9IlKfDm+\n94ABr8URChh6vhrvYMvH4/JnYoXvcu44MUOvuNZ6lEE3cWk63B0i8n27kp6YX19c\nkRX6yINXAgMBAAECggEADF5JePQgH2A5h+Pd4hgMCLU6N4p12pERGBHaMZ3fx++6\nKmXKkENr048sNUmjgRBHSuUfubDV8AjiVY4ot+qvK9Xa4xz4EwdnQxFuKEBGjqnt\nPfbgtYmYzPAATm2auiieMHUHZ6KN6CBt8RSs7ojONNBLDOyDJxnSi7Bb0UFTYl61\nq7437iFnIGFaBohXuySBVkGJ5RUC8/9B3Yr2ugIIYCOP3isc374QM/vFNqutzxrR\nhp8jsMjad/Xtwfn7N0/u1lM8GRCrqfy05SmhOrZribsKcwPrmtb3PhtQdqTPFnUz\n5stVrUwVr3PWN6yhKTy7Dqo2QTaq3BUFGyYcPwl08QKBgQDM7CX84WSCJUQHbPMs\nKzjZaU5Vdtu1YmxU4uPKn3RoNlSTuudBrzxgR+/thHGx4OgtIpfWWnlMiCq1koqC\n6VTs1npDHLEQhEWL9n4KQBNkG8D4w0Eh7YPqncYt/joGNpK16FGR8Oufd4lpLuPc\nvgY+LIOhJ4a9bVAdty1lido1EQKBgQDJPj0BC05cTOe9Gc9e+q4Qgq38aHr2d/Qs\nNyH8MVnFSI3+aG0XA9vEYxlgy/Sgrk0Misb6TiGyFoKvJKUoCyzm+BBEa2eokHg2\nlkrawNto8k4tShGeNtI72PL1vL4DD+smBa84Jzp7DFwrTM+cfIkig7GbTt4LgoWP\nJ9miQZSR5wKBgEfcT/379EkHVHHeLPBCP+9N1GB4C9fxqdeisQrvG90noEUl9866\n6stArsx184DTQ9gAF4rds0e5QHDn8JazyEo9dCZwu071c4X/bHefvK0QZn1Vy1Ng\nfTAbH9IlIqfnH0+XJnOtLpN/UbqG7PUN1habeZVbzQ5EdSHWiJ7g1pphAoGAUFwU\nDCixn9Xt6+s0jZ7YhytHwrUN9QGtdUKGxagHSupQGTkl5rzZszBHYAnRo6A2kD2S\nez1b4ztt7/ZYJQdhZNHF3SxudjdKabHWLkg41U18vkUHiAAoL1HQoyQ9VAe1RLec\nYnX3uk8TNw8zEDACqs+fyn7R2BLEtoeZNlutsh0CgYA+TC8CEbYYygZ2HEg9EILN\nWg2gKfcA1DWy94QEb0l9gCATKG6O5rskKsTZMl4sYZ3oDQa80t7chJNRlT35XCUD\n5y/DcT1pvwn2VlsggNiAFpwbUio04+rvoco7p2GQ2EFPNGogboaGnRPMSjnWxlCB\ng8jSzl6VJSbSsgjcn22xkQ==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-h4iyx@vaxtrack-98582.iam.gserviceaccount.com",
  client_id: "116589609932086699703",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h4iyx%40vaxtrack-98582.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

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
