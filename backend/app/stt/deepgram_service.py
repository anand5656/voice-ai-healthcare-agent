from deepgram import (
    DeepgramClient,
    LiveTranscriptionEvents,
    LiveOptions,
)

from dotenv import load_dotenv

import os

load_dotenv()

DEEPGRAM_API_KEY = os.getenv(
    "DEEPGRAM_API_KEY"
)


class DeepgramService:

    def __init__(self):

        self.client = DeepgramClient(
            DEEPGRAM_API_KEY
        )

    async def start(
        self,
        transcript_callback
    ):

        dg_connection = (
            self.client.listen.asynclive.v("1")
        )

        async def on_message(
            self,
            result,
            **kwargs
        ):

            sentence = (
                result.channel
                .alternatives[0]
                .transcript
            )

            if sentence:

                await transcript_callback(
                    sentence
                )

        dg_connection.on(
            LiveTranscriptionEvents.Transcript,
            on_message
        )

        options = LiveOptions(

            model="nova-2",

            language="multi",

            smart_format=True,

            encoding="opus",

            interim_results=False,
        )

        print(
            "Starting Deepgram..."
        )

        await dg_connection.start(
            options
        )

        print(
            "Deepgram connected"
        )

        return dg_connection