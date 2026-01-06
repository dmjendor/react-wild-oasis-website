"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  function isValidNationalID(nationalID) {
    return /^[A-Za-z0-9]{6,12}$/.test(nationalID);
  }

  if (!isValidNationalID(nationalID))
    throw new Error("Please provide a valid national id");

  const updateData = { nationalID, nationality, countryFlag };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

function cleanObservations(text) {
  let observations = typeof text === "string" ? text.trim() : "";

  // Remove null bytes + most control chars (keep tab/newline/carriage return)
  observations = observations.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
    ""
  );

  // Cap length
  if (observations.length > 1000) {
    observations = observations.slice(0, 1000);
  }
  return observations;
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const numGuests = Number(formData.get("numGuests"));
  const rawObservations = formData.get("observations");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests,
    observations: cleanObservations(rawObservations),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    hasBreakfast: false,
    isPaid: false,
    status: "unconfirmed",
  };

  // TODO  validate dates are still available before creating the booking

  const { error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");

  const bookingId = Number(formData.get("bookingId"));
  const numGuests = Number(formData.get("numGuests"));
  const rawObservations = formData.get("observations");

  let observations = cleanObservations(rawObservations);

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to update this booking.");

  const updatedFields = { numGuests, observations };

  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();
  if (error) throw new Error("Booking could not be updated");

  revalidatePath("/cabins/reservations");
  redirect("/account/reservations");
}

export async function deleteBooking(bookingId) {
  await new Promise((res) => setTimeout(res, 2000)); // Delay for testing
  const session = await auth();
  if (!session) throw new Error("You must be logged in.");
  const guestBookings = await getBookings(session.user.guestId);
  console.log(guestBookings);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  console.log(guestBookingIds, bookingId);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking.");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) throw new Error("Booking could not be deleted");
  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// const handleGoogleSignIn = () => {
//   signIn('google', { callbackUrl: '/dashboard' });
// };

// const handleGitHubSignIn = () => {
//   signIn('github', { callbackUrl: '/dashboard' });
// };
