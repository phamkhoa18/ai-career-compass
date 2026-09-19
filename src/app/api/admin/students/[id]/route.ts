import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const student = await Assessment.findById(id);

    if (!student) {
      return NextResponse.json({ error: 'Không tìm thấy học sinh' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const student = await Assessment.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json({ error: 'Không tìm thấy học sinh' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa học sinh thành công' });
  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi xóa' }, { status: 500 });
  }
}
