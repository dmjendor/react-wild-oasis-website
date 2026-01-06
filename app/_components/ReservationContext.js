"use client";
import { createContext, use, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: null, to: null };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);
  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = use(ReservationContext);

  if (context === undefined)
    throw new Error("ReservationContext was used outside ResevationProvider");
  return context;
}

export { ReservationProvider, useReservation };
