import Doctor from "../models/Doctor.js";

function makeSlot(date, hour, minute = 0, durationMinutes = 45) {
  const start = new Date(date);
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return {
    start,
    end,
    label: `${start.toLocaleString()} - ${end.toLocaleTimeString()}`,
  };
}

function generateSlotsForNextDays(
  days = 14,
  slotsPerDay = [9, 10, 11, 14, 15, 16]
) {
  const slots = [];
  const today = new Date();
  for (let d = 0; d < days; d++) {
    const day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + d
    );
    for (const h of slotsPerDay) {
      slots.push(makeSlot(day, h));
    }
  }
  return slots;
}

export async function seedDoctors() {
  try {
    const count = await Doctor.countDocuments();
    const desired = 200;
    if (count === 0) {
      const specialties = [
        "General Physician",
        "Cardiologist",
        "Endocrinologist",
        "Family Physician",
        "Pulmonologist",
        "Dermatologist",
        "Neurologist",
        "Orthopedic",
        "Pediatrician",
        "Gastroenterologist",
      ];
      const cities = [
        "Mumbai",
        "Pune",
        "Bengaluru",
        "Chennai",
        "Delhi",
        "Hyderabad",
        "Kolkata",
      ];

      const doctors = [];
      // generate 'desired' doctors with slots
      for (let i = 1; i <= desired; i++) {
        const specialty = specialties[i % specialties.length];
        const city = cities[i % cities.length];
        const name = `Dr. ${
          [
            "Aisha",
            "Rahul",
            "Priya",
            "Suresh",
            "Meera",
            "Ankit",
            "Sunita",
            "Ravi",
            "Neha",
            "Amit",
          ][i % 10]
        } ${i}`;
        const phone = `+91-90000-${10000 + i}`;
        const doc = {
          name,
          specialty,
          clinic: `${specialty} Clinic ${i}`,
          city,
          phone,
          tags: [specialty.toLowerCase(), "general"],
          rating: +(3.5 + (i % 15) * 0.1).toFixed(1),
          experienceYears: 2 + (i % 20),
          photoUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
          bio: `${specialty} with ${2 + (i % 20)} years experience at ${city}.`,
          availableSlots: generateSlotsForNextDays(14),
        };
        doctors.push(doc);
      }

      await Doctor.insertMany(doctors);
      console.log(
        `Seeded doctors collection with generated doctors and slots (total: ${desired})`
      );
    } else if (count < desired) {
      // add additional doctors to reach desired count
      const toCreate = desired - count;
      const docs = [];
      const specialties = [
        "General Physician",
        "Cardiologist",
        "Endocrinologist",
        "Family Physician",
        "Pulmonologist",
        "Dermatologist",
        "Neurologist",
        "Orthopedic",
        "Pediatrician",
        "Gastroenterologist",
      ];
      const cities = [
        "Mumbai",
        "Pune",
        "Bengaluru",
        "Chennai",
        "Delhi",
        "Hyderabad",
        "Kolkata",
      ];
      for (let i = 1; i <= toCreate; i++) {
        const idx = count + i;
        const specialty = specialties[idx % specialties.length];
        const city = cities[idx % cities.length];
        const name = `Dr. ${
          [
            "Aisha",
            "Rahul",
            "Priya",
            "Suresh",
            "Meera",
            "Ankit",
            "Sunita",
            "Ravi",
            "Neha",
            "Amit",
          ][idx % 10]
        } ${idx}`;
        const phone = `+91-90000-${10000 + idx}`;
        docs.push({
          name,
          specialty,
          clinic: `${specialty} Clinic ${idx}`,
          city,
          phone,
          tags: [specialty.toLowerCase(), "general"],
          rating: +(3.5 + (idx % 15) * 0.1).toFixed(1),
          experienceYears: 2 + (idx % 20),
          photoUrl: `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`,
          bio: `${specialty} with ${
            2 + (idx % 20)
          } years experience at ${city}.`,
          availableSlots: generateSlotsForNextDays(14),
        });
      }
      await Doctor.insertMany(docs);
      console.log(`Added ${toCreate} more doctors to reach ${desired}`);
    } else {
      console.log("Doctors collection already seeded");
    }
  } catch (err) {
    console.error("Error seeding doctors:", err.message);
  }
}
