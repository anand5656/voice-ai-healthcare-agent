patient_memory = {}


def save_memory(
    patient_id: str,
    key: str,
    value
):

    if patient_id not in patient_memory:

        patient_memory[
            patient_id
        ] = {}

    patient_memory[
        patient_id
    ][key] = value


def get_memory(
    patient_id: str
):

    return patient_memory.get(
        patient_id,
        {}
    )