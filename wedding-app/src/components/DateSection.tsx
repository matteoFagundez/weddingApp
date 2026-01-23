import { useState } from "react";
import { AttendanceForm } from "./AttendanceForm";

export function DateSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="date-section">
      <p className="date-intro">
        Te esperamos para<br />celebrar nuestra boda
      </p>

      <div className="date-row">
        <span className="date-day">VIERNES</span>
        <span className="date-number">20</span>
        <span className="date-month">MARZO</span>
      </div>

      <button
        className="rsvp-btn"
        onClick={() => setOpen(true)}
      >
        CONFIRMAR ASISTENCIA
      </button>

      {open && (
        <AttendanceForm onCancel={() => setOpen(false)} />
      )}
    </section>
  );
}
