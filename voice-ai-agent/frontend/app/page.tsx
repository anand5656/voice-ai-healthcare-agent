'use client'

import { useRef, useState } from 'react'

import { motion } from 'framer-motion'

import {
  Mic,
  Square,
  Languages,
  Activity,
  Brain,
  CalendarDays,
} from 'lucide-react'

export default function Home() {

  const socketRef =
    useRef<WebSocket | null>(null)

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null)

  const [recording, setRecording] =
    useState(false)

  const [transcript, setTranscript] =
    useState('')

  const [aiResponse, setAiResponse] =
    useState(
      'Waiting for AI response...'
    )

  const [
    appointment,
    setAppointment
  ] = useState<any>(null)

  const [
    conversationHistory,
    setConversationHistory
  ] = useState<any[]>([])

  const startRecording = async () => {

    try {

      const stream =
        await navigator
          .mediaDevices
          .getUserMedia({
            audio: true,
          })

      const socket =
        new WebSocket(
          'ws://localhost:8000/ws'
        )

      socketRef.current = socket

      socket.onopen = () => {

        console.log(
          'WebSocket connected'
        )

        const mediaRecorder =
          new MediaRecorder(
            stream,
            {
              mimeType:
                'audio/webm;codecs=opus',
            }
          )

        mediaRecorderRef.current =
          mediaRecorder

        mediaRecorder.ondataavailable =
          async (event) => {

            if (
              event.data.size > 0 &&
              socket.readyState ===
              WebSocket.OPEN
            ) {

              const arrayBuffer =
                await event.data
                  .arrayBuffer()

              socket.send(
                arrayBuffer
              )
            }
          }

        mediaRecorder.start(250)

        setRecording(true)
      }

      socket.onmessage = (
        event
      ) => {

        const data =
          JSON.parse(
            event.data
          )

        console.log(data)

        // TRANSCRIPT

        if (
          data.type ===
          'transcript'
        ) {

          setTranscript(
            data.text
          )

          setConversationHistory(
            (prev) => [

              ...prev,

              {
                role: 'User',
                text: data.text,
              },
            ]
          )
        }

        // AI RESPONSE

        if (
          data.type ===
          'ai_response'
        ) {

          setAiResponse(
            data.text
          )

          setConversationHistory(
            (prev) => [

              ...prev,

              {
                role: 'AI',
                text: data.text,
              },
            ]
          )
        }

        // APPOINTMENT

        if (
          data.type ===
          'appointment'
        ) {

          console.log(
            'Appointment:',
            data
          )

          setAppointment(
            data.data.appointment
          )

          setAiResponse(
            'Appointment booked successfully.'
          )

          setConversationHistory(
            (prev) => [

              ...prev,

              {
                role: 'AI',
                text:
                  'Appointment confirmed successfully.',
              },
            ]
          )
        }
      }

      socket.onerror = (
        error
      ) => {

        console.error(error)

        alert(
          'WebSocket error'
        )
      }

    } catch (error) {

      console.error(error)

      alert(
        'Microphone error'
      )
    }
  }

  const stopRecording = () => {

    mediaRecorderRef
      .current
      ?.stop()

    socketRef
      .current
      ?.close()

    setRecording(false)
  }

  return (

    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-black
        via-zinc-950
        to-zinc-900
        text-white
        p-8
      "
    >

      {/* HEADER */}

      <motion.div

        initial={{
          opacity: 0,
          y: -20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.8,
        }}

        className="
          flex
          items-center
          justify-between
          mb-10
        "
      >

        <div>

          <h1
            className="
              text-5xl
              font-bold
            "
          >
            Voice AI Healthcare
          </h1>

          <p
            className="
              text-zinc-400
              mt-3
              text-lg
            "
          >
            Realtime Appointment Assistant
          </p>

        </div>

        <div
          className="
            flex
            gap-4
          "
        >

          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              px-5
              py-3
              rounded-2xl
              flex
              items-center
              gap-3
            "
          >

            <Activity
              size={18}
              className="
                text-green-400
              "
            />

            <span>
              Active
            </span>

          </div>

          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              px-5
              py-3
              rounded-2xl
              flex
              items-center
              gap-3
            "
          >

            <Languages
              size={18}
            />

            <span>
              English / Hindi / Tamil
            </span>

          </div>

        </div>

      </motion.div>

      {/* GRID */}

      <motion.div

        initial={{
          opacity: 0,
          y: 30,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.8,
        }}

        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >

        {/* VOICE INPUT */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-3xl
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-8
            "
          >

            <Mic
              className="
                text-blue-400
              "
            />

            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Voice Input
            </h2>

          </div>

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-10
            "
          >

            {/* MIC BUTTON */}

            <motion.button

              animate={
                recording
                  ? {
                    scale: [1, 1.1, 1],
                  }
                  : {}
              }

              transition={{
                repeat: Infinity,
                duration: 1,
              }}

              className={`
                w-32
                h-32
                rounded-full
                flex
                items-center
                justify-center

                ${
                  recording

                    ? `
                    bg-red-500
                    shadow-[0_0_70px_rgba(239,68,68,0.8)]
                  `

                    : `
                    bg-blue-500
                    shadow-[0_0_70px_rgba(59,130,246,0.8)]
                  `
                }
              `}

              onClick={
                recording
                  ? stopRecording
                  : startRecording
              }
            >

              {
                recording
                  ? (
                    <Square
                      size={45}
                    />
                  )
                  : (
                    <Mic
                      size={45}
                    />
                  )
              }

            </motion.button>

            {/* STATUS */}

            <p
              className="
                mt-8
                text-zinc-400
                text-lg
              "
            >

              {
                recording
                  ? (
                    'Listening in realtime...'
                  )
                  : (
                    'Tap to start speaking'
                  )
              }

            </p>

            {/* WAVEFORM */}

            <div
              className="
                mt-8
                flex
                items-end
                justify-center
                gap-1
                h-16
              "
            >

              {
                recording &&
                [
                  1,2,3,4,
                  5,6,7,8,
                  9,10,11,12
                ].map(
                  (bar) => (

                    <motion.div
                      key={bar}

                      animate={{
                        height: [
                          10,
                          45,
                          20,
                          60,
                          15,
                        ],
                      }}

                      transition={{
                        repeat:
                          Infinity,

                        duration: 1,

                        delay:
                          bar * 0.08,
                      }}

                      className="
                        w-2
                        bg-cyan-400
                        rounded-full
                      "
                    />

                  )
                )
              }

            </div>

          </div>

        </div>

        {/* TRANSCRIPT */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-3xl
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <Brain
              className="
                text-purple-400
              "
            />

            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Live Transcript
            </h2>

          </div>

          <div
            className="
              bg-black/50
              border
              border-zinc-800
              rounded-2xl
              p-6
              min-h-[250px]
              text-zinc-300
              text-xl
            "
          >

            {
              transcript ||

              'Waiting for speech...'
            }

          </div>

        </div>

        {/* AI RESPONSE */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-3xl
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <Brain
              className="
                text-cyan-400
              "
            />

            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              AI Response
            </h2>

          </div>

          <div
            className="
              bg-black/50
              border
              border-zinc-800
              rounded-2xl
              p-6
              min-h-[250px]
              text-cyan-300
              text-xl
            "
          >

            {aiResponse}

          </div>

        </div>

        {/* APPOINTMENT CARD */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-3xl
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <CalendarDays
              className="
                text-green-400
              "
            />

            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Appointment Status
            </h2>

          </div>

          {
            appointment ? (

              <motion.div

                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                className="
                  bg-green-500/10
                  border
                  border-green-500/30
                  rounded-2xl
                  p-6
                  space-y-5
                "
              >

                <h3
                  className="
                    text-3xl
                    font-bold
                    text-green-400
                  "
                >
                  Appointment Confirmed
                </h3>

                <div>

                  <p
                    className="
                      text-zinc-400
                    "
                  >
                    Doctor
                  </p>

                  <p
                    className="
                      text-2xl
                    "
                  >
                    {appointment.doctor}
                  </p>

                </div>

                <div>

                  <p
                    className="
                      text-zinc-400
                    "
                  >
                    Slot
                  </p>

                  <p
                    className="
                      text-2xl
                    "
                  >
                    {appointment.slot}
                  </p>

                </div>

                <div>

                  <p
                    className="
                      text-zinc-400
                    "
                  >
                    Status
                  </p>

                  <p
                    className="
                      text-green-400
                      text-xl
                      font-bold
                    "
                  >
                    {appointment.status}
                  </p>

                </div>

              </motion.div>

            ) : (

              <div
                className="
                  text-zinc-500
                  text-lg
                "
              >

                No appointments yet.

              </div>
            )
          }

        </div>

        {/* CONVERSATION HISTORY */}

        <div
          className="
            bg-zinc-900/60
            border
            border-zinc-800
            rounded-3xl
            p-8
            xl:col-span-2
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <Brain
              className="
                text-pink-400
              "
            />

            <h2
              className="
                text-2xl
                font-semibold
              "
            >
              Conversation History
            </h2>

          </div>

          <div
            className="
              bg-black/40
              border
              border-zinc-800
              rounded-2xl
              p-6
              max-h-[400px]
              overflow-y-auto
              space-y-4
            "
          >

            {
              conversationHistory.length
              === 0 ? (

                <p
                  className="
                    text-zinc-500
                  "
                >
                  No conversations yet.
                </p>

              ) : (

                conversationHistory.map(
                  (
                    item,
                    index
                  ) => (

                    <motion.div

                      key={index}

                      initial={{
                        opacity: 0,
                        y: 10,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                      }}

                      className={`
                        p-4
                        rounded-2xl

                        ${
                          item.role === 'User'

                          ? `
                            bg-blue-500/10
                            border
                            border-blue-500/20
                          `

                          : `
                            bg-cyan-500/10
                            border
                            border-cyan-500/20
                          `
                        }
                      `}
                    >

                      <p
                        className="
                          text-sm
                          text-zinc-400
                          mb-1
                        "
                      >
                        {item.role}
                      </p>

                      <p
                        className="
                          text-lg
                        "
                      >
                        {item.text}
                      </p>

                    </motion.div>

                  )
                )
              )
            }

          </div>

        </div>

      </motion.div>

    </main>
  )
}