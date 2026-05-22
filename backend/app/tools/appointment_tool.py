appointments = []

available_slots = {

    "Dr Sharma": [
        "10:00 AM",
        "11:00 AM",
        "2:00 PM",
    ],

    "Dr Priya": [
        "9:00 AM",
        "1:00 PM",
        "4:00 PM",
    ]
}


def check_availability(
    doctor: str
):

    return available_slots.get(
        doctor,
        []
    )


def book_appointment(
    patient_name: str,
    doctor: str,
    slot: str
):

    # CONFLICT CHECK

    for appt in appointments:

        if (
            appt["doctor"] == doctor
            and
            appt["slot"] == slot
        ):

            return {

                "success": False,

                "message":
                "Slot already booked"
            }

    # SAVE BOOKING

    appointment = {

        "patient_name":
        patient_name,

        "doctor":
        doctor,

        "slot":
        slot,

        "status":
        "Confirmed"
    }

    appointments.append(
        appointment
    )

    return {

        "success": True,

        "appointment":
        appointment
    }