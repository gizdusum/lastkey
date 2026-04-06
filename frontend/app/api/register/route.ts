import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ownerAddress, email, beneficiaryCount, thresholdDays } = body;

    if (!ownerAddress || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log(
      `[register] New vault: ${ownerAddress} | ${email} | ${beneficiaryCount} beneficiaries | ${thresholdDays} days`
    );

    return NextResponse.json({
      success: true,
      message: "Registration logged",
      ownerAddress,
      thresholdDays: thresholdDays || 300,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
