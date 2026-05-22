from app.tools.appointment_tool import (
    check_availability,
    book_appointment,
)

from app.memory.memory_service import (
    save_memory,
    get_memory,
)


async def generate_response(
    user_text: str,
    patient_id: str = "default_user"
):

    user_text_lower = (
        user_text.lower()
    )

    # DEFAULT LANGUAGE

    language = "english"

    # HINDI DETECTION

    hindi_words = [
        "mujhe",
        "chahiye",
        "kal",
    ]

    # TAMIL DETECTION

    tamil_words = [
        "venum",
    ]

    for word in hindi_words:

        if word in user_text_lower:

            language = "hindi"

    for word in tamil_words:

        if word in user_text_lower:

            language = "tamil"

    # SAVE LANGUAGE MEMORY

    save_memory(
        patient_id,
        "language",
        language
    )

    # BOOKING INTENT

    if (
        "appointment" in user_text_lower
        or
        "book" in user_text_lower
    ):

        # DR SHARMA

        if (
            "sharma" in user_text_lower
            or
            "shavma" in user_text_lower
        ):

            # SAVE MEMORY

            save_memory(
                patient_id,
                "preferred_doctor",
                "Dr Sharma"
            )

            slots = (
                check_availability(
                    "Dr Sharma"
                )
            )
            # AUTO BOOKING

            if (
                "10" in user_text_lower
                or
                "ten" in user_text_lower
            ):

                booking = (
                    book_appointment(
                        "Anand",
                        "Dr Sharma",
                        "10:00 AM"
                    )
                )

                return booking

            # ENGLISH

            if language == "english":

                return (
                    f"""
                    Dr Sharma is available at:
                    {', '.join(slots)}
                    """
                )

            # HINDI

            if language == "hindi":

                return (
                    f"""
                    डॉ शर्मा उपलब्ध हैं:
                    {', '.join(slots)}
                    """
                )

            # TAMIL

            if language == "tamil":

                return (
                    f"""
                    டாக்டர் சர்மா available:
                    {', '.join(slots)}
                    """
                )

        # DR PRIYA

        if (
            "priya" in user_text_lower
        ):

            # SAVE MEMORY

            save_memory(
                patient_id,
                "preferred_doctor",
                "Dr Priya"
            )

            slots = (
                check_availability(
                    "Dr Priya"
                )
            )

            if language == "english":

                return (
                    f"""
                    Dr Priya is available at:
                    {', '.join(slots)}
                    """
                )

            if language == "hindi":

                return (
                    f"""
                    डॉ प्रिया उपलब्ध हैं:
                    {', '.join(slots)}
                    """
                )

            if language == "tamil":

                return (
                    f"""
                    டாக்டர் பிரியா available:
                    {', '.join(slots)}
                    """
                )

        # ASK DOCTOR

        if language == "english":

            return (
                "Which doctor would "
                "you like to see?"
            )

        if language == "hindi":

            return (
                "किस डॉक्टर के साथ "
                "अपॉइंटमेंट चाहिए?"
            )

        if language == "tamil":

            return (
                "எந்த டாக்டருடன் "
                "appointment வேண்டும்?"
            )

    # RESCHEDULE

    if (
        "reschedule" in user_text_lower
    ):

        return (
            "Which appointment "
            "would you like to reschedule?"
        )

    # CANCEL

    if (
        "cancel" in user_text_lower
    ):

        return (
            "Which appointment "
            "would you like to cancel?"
        )

    # MEMORY RECALL

    memory = get_memory(
        patient_id
    )

    preferred_doctor = (
        memory.get(
            "preferred_doctor"
        )
    )

    if preferred_doctor:

        return (
            f"""
            Welcome back.
            Would you like another
            appointment with
            {preferred_doctor}?
            """
        )

    # DEFAULT

    return (
        "I can help you book, "
        "reschedule, or cancel appointments."
    )