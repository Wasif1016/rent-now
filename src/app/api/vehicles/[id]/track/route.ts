import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type } = body; // 'view', 'whatsapp', or 'call'

    if (!type || !["view", "whatsapp", "call"].includes(type)) {
      return NextResponse.json(
        {
          error: "Invalid tracking type. Must be 'view', 'whatsapp', or 'call'",
        },
        { status: 400 }
      );
    }

    // Update the appropriate counter
    const updateData: any = {};
    if (type === "view") {
      updateData.views = { increment: 1 };
    } else if (type === "whatsapp") {
      updateData.whatsappClicks = { increment: 1 };
    } else if (type === "call") {
      updateData.callClicks = { increment: 1 };
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        views: true,
        whatsappClicks: true,
        callClicks: true,
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        views: vehicle.views,
        whatsappClicks: vehicle.whatsappClicks,
        callClicks: vehicle.callClicks,
      },
    });
  } catch (error: any) {
    console.error("Error tracking vehicle interaction:", error);
    return NextResponse.json(
      { error: "Failed to track interaction" },
      { status: 500 }
    );
  }
}
