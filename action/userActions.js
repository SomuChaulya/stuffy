"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

import { auth, currentUser } from "@clerk/nextjs/server";

const userPaths = ["/portal/employees", "/portal/attendance", "/portal/time-off", "/portal/profile"];

function revalidateUserRoutes() {
  userPaths.forEach((path) => revalidatePath(path));
}

function text(formData, name, fallback = "") {
  const value = formData.get(name);
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function optionalText(formData, name) {
  const value = text(formData, name);
  return value || null;
}

function dateValue(formData, name) {
  const value = text(formData, name);
  return value ? new Date(value) : null;
}

function dateTimeValue(formData, dateName, timeName) {
  const date = text(formData, dateName);
  const time = text(formData, timeName);
  if (!date || !time) return null;
  return new Date(`${date}T${time}`);
}

async function getCurrentEmployee() {
  const { userId } = await auth();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
}

export async function setCurrentEmployee(formData) {
  const employeeId = text(formData, "employeeId");
  const employee = await prisma.user.findUnique({ where: { id: employeeId } });

  if (!employee) {
    throw new Error("Employee not found.");
  }

  const cookieStore = await cookies();
  cookieStore.set("hrms-user-id", employee.id, { httpOnly: true, path: "/" });
  revalidateUserRoutes();
  redirect(employee.role === "ADMIN" ? "/dashboard" : "/portal/employees");
}

export async function clearCurrentEmployee() {
  const cookieStore = await cookies();
  cookieStore.delete("hrms-user-id");
  revalidateUserRoutes();
  redirect("/");
}

export async function checkIn() {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("Not authenticated");

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: { gte: startOfDay, lt: endOfDay },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing && !existing.checkOut) {
    throw new Error("You are already checked in.");
  }

  const now = new Date();
  await prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: employee.id,
        date: startOfDay,
      },
    },
    update: {
      checkIn: now,
      status: "PRESENT",
      remarks: "Checked in",
    },
    create: {
      employeeId: employee.id,
      date: startOfDay,
      checkIn: now,
      status: "PRESENT",
      remarks: "Checked in",
    },
  });

  revalidateUserRoutes();
  return { success: true, message: "Checked in successfully" };
}

export async function checkOut() {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("Not authenticated");

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: { gte: startOfDay, lt: endOfDay },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!existing || !existing.checkIn || existing.checkOut) {
    throw new Error("You are not checked in.");
  }

  await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: new Date(),
      status: "PRESENT",
    },
  });

  revalidateUserRoutes();
  return { success: true, message: "Checked out successfully" };
}

export async function updateMyProfile(formData) {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("Not authenticated");

  const data = {
    address: optionalText(formData, "address"),
    phone: optionalText(formData, "phone"),
    profileImage: optionalText(formData, "profileImage"),
  };

  await prisma.employeeProfile.update({
    where: { userId: employee.id },
    data,
  });

  revalidateUserRoutes();
  return { success: true, message: "Profile updated" };
}

export async function createLeaveRequest(formData) {
  const employee = await getCurrentEmployee();
  if (!employee) throw new Error("Not authenticated");

  const startDate = dateValue(formData, "startDate");
  const endDate = dateValue(formData, "endDate");

  if (!startDate || !endDate) {
    throw new Error("Start date and end date are required.");
  }

  if (endDate < startDate) {
    throw new Error("End date cannot be before start date.");
  }

  await prisma.leaveRequest.create({
    data: {
      employeeId: employee.id,
      leaveType: text(formData, "leaveType", "PAID"),
      startDate,
      endDate,
      reason: text(formData, "reason", "Requested leave"),
    },
  });

  revalidateUserRoutes();
  return { success: true, message: "Leave request submitted" };
}

export async function submitOnboarding(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;
  if (!email) throw new Error("Could not retrieve Clerk user email.");

  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const phone = optionalText(formData, "phone");
  const address = optionalText(formData, "address");
  const gender = optionalText(formData, "gender");
  const dobVal = optionalText(formData, "dob");
  const dob = dobVal ? new Date(dobVal) : null;
  const department = text(formData, "department", "General");
  const designation = text(formData, "designation", "Employee");
  const basicSalary = Number(text(formData, "basicSalary", "45000"));
  const bankName = optionalText(formData, "bankName");
  const accountNumber = optionalText(formData, "accountNumber");
  const emergencyName = optionalText(formData, "emergencyName");
  const emergencyPhone = optionalText(formData, "emergencyPhone");

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required.");
  }

  // Generate a unique employee ID dynamically
  let employeeId = "";
  let isUnique = false;
  while (!isUnique) {
    employeeId = "EMP-" + Math.floor(1000 + Math.random() * 9000);
    const existing = await prisma.user.findFirst({ where: { employeeId } });
    if (!existing) {
      isUnique = true;
    }
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (existingUser) {
    throw new Error("An onboarding profile already exists for this account.");
  }

  // Create user and profile
  await prisma.user.create({
    data: {
      id: userId,
      employeeId,
      email,
      role: "EMPLOYEE",
      isVerified: false, // Default to false until accepted by admin
      profile: {
        create: {
          firstName,
          lastName,
          phone,
          address,
          gender,
          dob,
          joiningDate: new Date(),
          designation,
          department,
          basicSalary,
          bankName,
          accountNumber,
          emergencyName,
          emergencyPhone,
        },
      },
    },
  });

  revalidateUserRoutes();
  redirect("/onboarding/pending");
}
