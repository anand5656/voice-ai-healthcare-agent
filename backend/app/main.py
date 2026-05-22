from fastapi import FastAPI
from fastapi import WebSocket

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.stt.deepgram_service import (
    DeepgramService,
)

from app.LLM.openai_service import (
    generate_response,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():

    return {
        "status": "running"
    }


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket
):

    await websocket.accept()

    print("Client connected")

    async def transcript_callback(
        transcript: str
    ):

        print(
            "Transcript:",
            transcript
        )

        # SEND TRANSCRIPT TO FRONTEND

        await websocket.send_json({

            "type":
            "transcript",

            "text":
            transcript
        })

        # GENERATE AI RESPONSE

        ai_response = (
            await generate_response(
                transcript,
                "patient_001"
            )
        )

        print(
            "TYPE:",
            type(ai_response)
        )

        # SEND AI RESPONSE
# BOOKING CARD

        if isinstance(
            ai_response,
            dict
        ):

            await websocket.send_json({

                "type":
                "appointment",

                "data":
                ai_response
            })

        # NORMAL AI

        else:

            await websocket.send_json({

                "type":
                "ai_response",

                "text":
                ai_response
            })

    dg = DeepgramService()

    dg_connection = (
        await dg.start(
            transcript_callback
        )
    )

    try:

        while True:

            audio_chunk = (
                await websocket.receive_bytes()
            )

            await dg_connection.send(
                audio_chunk
            )

    except Exception as e:

        print(
            "Disconnected:",
            e
        )