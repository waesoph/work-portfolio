import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const INTRO_MESSAGE = "Hello I'm Will, what would you like to know about me?"
const INITIAL_TYPING_PAUSE_MS = 340
const CHAT_SCROLL_BOTTOM_THRESHOLD_PX = 10
const IDLE_NUDGE_DELAY_MS = 30000
const IDLE_LEAVE_DELAY_MS = 30000
const IDLE_LEFT_MESSAGE_DELAY_MS = 30000
const ABOUT_CHAT_SESSION_STORAGE_KEY = 'about-chat-state-v2'
const LEFT_CHAT_TEXT = 'Will has left the chat'
const REJOINED_CHAT_TEXT = 'Will has rejoined the chat'
const CONTACT_PHRASE = 'contact page'

const WHO_ARE_YOU_OPTION = {
  id: 'who-are-you-intro',
  label: 'Who are you?',
  userText: 'Who are you?',
  response: "I’m a Canadian web developer.",
  nextStage: 'bank',
}

const A_BRANCH_OPTIONS = [
  {
    id: 'a-root',
    branch: 'a',
    label: 'What do you do?',
    userText: 'What do you do?',
    response: 'I build and design websites, and help businesses grow their digital presence outside of their website.',
  },
  {
    id: 'a-1',
    branch: 'a',
    label: 'What do you do outside of websites?',
    userText: 'What do you do outside of websites?',
    response: 'I can help with all things web, such as ad campaigns, SEO, and Google Analytics.',
  },
  {
    id: 'a-2',
    branch: 'a',
    label: 'Which part of building a website can you do?',
    userText: 'Which part of building a website can you do?',
    response: 'I can take care of it all. From design, to content, coding, and hosting, you let me know what your vision is and I’ll take care of it.',
  },
  {
    id: 'a-3',
    branch: 'a',
    label: 'How large are the companies you work with?',
    userText: 'How large are the companies you work with?',
    response: 'I have worked with large corporations such as Nestle Canada, small business owners, and everything in between.',
  },
  {
    id: 'a-4',
    branch: 'a',
    label: 'What is your work experience?',
    userText: 'What is your work experience?',
    response: 'I have worked at a digital agency working within a team, I have worked in small development shops, and now I have been running my own web business since September 2024.',
  },
  {
    id: 'a-5',
    branch: 'a',
    label: 'How much are your services?',
    userText: 'How much are your services?',
    response: 'The cost depends on the project, but I’m happy to provide a free estimate for whatever you have in mind. Reach out on my contact page, and let’s have a chat!',
  },
  {
    id: 'a-6',
    branch: 'a',
    label: 'Can we work together?',
    userText: 'Can we work together?',
    response: 'Of course! Reach out on my contact page and I’ll get back to you quickly.',
  },
]

const B_BRANCH_OPTIONS = [
  {
    id: 'b-root',
    branch: 'b',
    label: 'Where are you from?',
    userText: 'Where are you from?',
    response: 'I’m based in British Columbia, but I work with teams from around the world.',
  },
  {
    id: 'b-1',
    branch: 'b',
    label: 'What are your hobbies?',
    userText: 'What are your hobbies?',
    response: 'I love baseball (GO JAYS!), chess, frisbee golf, and Starcraft 2.',
  },
  {
    id: 'b-2',
    branch: 'b',
    label: 'How did you learn to code?',
    userText: 'How did you learn to code?',
    response: 'In 2021, I attended a coding bootcamp with BrainStation, had a job secured before it was over, and have been working fulltime ever since.',
  },
  {
    id: 'b-3',
    branch: 'b',
    label: 'Why did you become a web developer?',
    userText: 'Why did you become a web developer?',
    response: 'Before web development I worked in sports and esports events. During covid, events didn’t exist anymore so I lost my job and needed to find something new. I had a long meeting with a friend who is a senior engineer, and was teaching myself on freecodecamp the very next day.',
  },
  {
    id: 'b-4',
    branch: 'b',
    label: 'Do you work outside of Canada?',
    userText: 'Do you work outside of Canada?',
    response: 'I am open to working with people and businesses from around the world.',
  },
  {
    id: 'b-5',
    branch: 'b',
    label: 'Do you only work in English?',
    userText: 'Do you only work in English?',
    response: 'I can also work in French, but most of the work I do is in English.',
  },
  {
    id: 'b-6',
    branch: 'b',
    label: 'Tell me a fun fact.',
    userText: 'Tell me a fun fact.',
    response: 'I can type 110 words per minute.',
  },
  {
    id: 'b-7',
    branch: 'b',
    label: 'Tell me another fun fact.',
    userText: 'Tell me another fun fact.',
    response: 'I’ve also lived in Belgium and the United States.',
  },
  {
    id: 'b-8',
    branch: 'b',
    label: 'Tell me another fun fact (again).',
    userText: 'Tell me another fun fact.',
    response: 'Non.',
  },
]

const C_BANK_OPTION = {
  id: 'c-root',
  branch: 'c',
  label: 'What can you help me with?',
  userText: 'What can you help me with?',
  response: 'I specialize in improving the web side of your business. We will work together to create a plan to bring your vision to life. What are you looking for?',
  nextStage: 'c-main',
}

const C_MAIN_OPTIONS = [
  {
    id: 'c-main-1',
    branch: 'c',
    label: 'I need help with my business.',
    userText: 'I need help with my business.',
    response: 'That’s what I’m here for, how can I help?',
    nextStage: 'c-business',
  },
  {
    id: 'c-main-2',
    branch: 'c',
    label: 'I need help with a cause or a hobby.',
    userText: 'I need help with a cause or a hobby.',
    response: 'Great! Who is it for?',
    nextStage: 'c-cause',
  },
  {
    id: 'c-main-3',
    branch: 'c',
    label: 'I want to collaborate on a project.',
    userText: 'I want to collaborate on a project.',
    response: 'Sounds good, head on over to my contact page and I’ll get back to you as quickly as I can.',
    returnToBank: true,
    prefillFromSelection: true,
  },
  {
    id: 'c-main-4',
    branch: 'c',
    label: 'I’m just here for the vibes.',
    userText: 'I’m just here for the vibes.',
    response: 'Nice, me too. Want to know anything else?',
    returnToBank: true,
  },
]

const C_BUSINESS_LEAF_RESPONSE = 'I can help with that, use my contact page to reach out and let’s see what we can accomplish together!'

const C_BUSINESS_OPTIONS = [
  {
    id: 'c-business-1',
    branch: 'c',
    label: 'I need a website.',
    userText: 'I need a website.',
    response: C_BUSINESS_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
  {
    id: 'c-business-2',
    branch: 'c',
    label: 'I want to generate more leads.',
    userText: 'I want to generate more leads.',
    response: C_BUSINESS_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
  {
    id: 'c-business-3',
    branch: 'c',
    label: 'I want to build a chatbot.',
    userText: 'I want to build a chatbot.',
    response: C_BUSINESS_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
  {
    id: 'c-business-4',
    branch: 'c',
    label: 'I need help with our digital presence.',
    userText: 'I need help with our digital presence.',
    response: C_BUSINESS_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
]

const C_CAUSE_LEAF_RESPONSE = 'Sounds good, reach out on my contact page and let’s chat!'

const C_CAUSE_OPTIONS = [
  {
    id: 'c-cause-1',
    branch: 'c',
    label: 'Myself.',
    userText: 'Myself.',
    response: C_CAUSE_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
  {
    id: 'c-cause-2',
    branch: 'c',
    label: 'An organization (such as a sports league).',
    userText: 'An organization (such as a sports league).',
    response: C_CAUSE_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
  {
    id: 'c-cause-3',
    branch: 'c',
    label: 'A charity or non-profit.',
    userText: 'A charity or non-profit.',
    response: C_CAUSE_LEAF_RESPONSE,
    returnToBank: true,
    prefillFromSelection: true,
  },
]

function getTypingDelay(character) {
  const char = String(character || '')

  if (char === ' ') {
    const minDelay = 58
    const maxDelay = 145
    const weightedRandom = Math.pow(Math.random(), 2.2)
    return minDelay + Math.floor(weightedRandom * (maxDelay - minDelay + 1))
  }

  if (char === ',') {
    return 180 + Math.floor(Math.random() * 121)
  }

  if (/[.!?]/.test(char)) {
    return 320 + Math.floor(Math.random() * 201)
  }

  if (/[;:]/.test(char)) {
    return 220 + Math.floor(Math.random() * 141)
  }

  if (/[a-z0-9]/i.test(char)) {
    return 34 + Math.floor(Math.random() * 20)
  }

  return 36 + Math.floor(Math.random() * 16)
}

function getNextUnaskedOption(branchOptions, askedSet, excludedIds = new Set()) {
  return branchOptions.find((option) => !askedSet.has(option.id) && !excludedIds.has(option.id)) ?? null
}

function buildContactPrefillFromSelection(selectionLabel) {
  const rawSelection = String(selectionLabel || '').trim()
  if (!rawSelection) {
    return 'I need help with my project. The details are:'
  }

  const normalizedSelection = rawSelection.replace(/\s+/g, ' ').replace(/[.!?]+$/g, '').trim()
  const startsWithI = /^i\b/i.test(normalizedSelection)
  const lowerFirstSelection = normalizedSelection.charAt(0).toLowerCase() + normalizedSelection.slice(1)
  const sentenceBase = startsWithI ? normalizedSelection : `I need help with ${lowerFirstSelection}`
  const sentence = /[.!?]$/.test(sentenceBase) ? sentenceBase : `${sentenceBase}.`

  return `${sentence} The details are:`
}

function renderMessageWithContactLinks(message, keyPrefix) {
  const text = String(message?.text || '')
  if (!text) {
    return text
  }

  const contactPhraseRegex = /contact page/gi
  const parts = []
  let lastIndex = 0
  let matchIndex = 0
  let match

  while ((match = contactPhraseRegex.exec(text)) !== null) {
    const [matchedText] = match
    const matchStart = match.index
    const matchEnd = matchStart + matchedText.length

    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart))
    }

    parts.push(
      <Link
        key={`${keyPrefix}-contact-link-${matchIndex}`}
        to="/contact"
        state={message?.prefillMessage ? { prefillMessage: message.prefillMessage } : undefined}
        className="font-semibold text-white underline decoration-white underline-offset-2 transition-opacity hover:opacity-80"
      >
        {matchedText}
      </Link>,
    )

    lastIndex = matchEnd
    matchIndex += 1
  }

  if (parts.length === 0) {
    return text
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function getContactPhraseRanges(text) {
  const sourceText = String(text || '')
  if (!sourceText) {
    return []
  }

  const normalizedSource = sourceText.toLowerCase()
  const ranges = []
  let searchIndex = 0

  while (searchIndex < normalizedSource.length) {
    const matchIndex = normalizedSource.indexOf(CONTACT_PHRASE, searchIndex)
    if (matchIndex === -1) {
      break
    }

    const endIndex = matchIndex + CONTACT_PHRASE.length
    ranges.push({ start: matchIndex, end: endIndex })
    searchIndex = endIndex
  }

  return ranges
}

function renderTypingMessageWithContactStyle(typingMessage, keyPrefix) {
  const visibleText = String(typingMessage?.visibleText || '')
  if (!visibleText) {
    return visibleText
  }

  const ranges = Array.isArray(typingMessage?.contactRanges) ? typingMessage.contactRanges : []
  if (ranges.length === 0) {
    return visibleText
  }

  const parts = []
  let cursor = 0

  ranges.forEach((range, rangeIndex) => {
    if (!range || typeof range.start !== 'number' || typeof range.end !== 'number') {
      return
    }

    if (range.start >= visibleText.length || range.end <= 0) {
      return
    }

    const startIndex = Math.max(0, range.start)
    const endIndex = Math.min(visibleText.length, range.end)

    if (startIndex > cursor) {
      parts.push(visibleText.slice(cursor, startIndex))
    }

    if (endIndex > startIndex) {
      parts.push(
        <span
          key={`${keyPrefix}-contact-inline-${rangeIndex}`}
          className="font-semibold text-white underline decoration-white underline-offset-2"
        >
          {visibleText.slice(startIndex, endIndex)}
        </span>,
      )
    }

    cursor = Math.max(cursor, endIndex)
  })

  if (cursor < visibleText.length) {
    parts.push(visibleText.slice(cursor))
  }

  return parts.length > 0 ? parts : visibleText
}

function loadPersistedChatState() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.sessionStorage.getItem(ABOUT_CHAT_SESSION_STORAGE_KEY)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue)
    if (!parsedValue || typeof parsedValue !== 'object') {
      return null
    }

    const messages = Array.isArray(parsedValue.messages)
      ? parsedValue.messages
          .filter((message) => message && typeof message === 'object')
          .map((message) => ({
            id: typeof message.id === 'string' ? message.id : `msg-${Date.now()}-${Math.random()}`,
            role: message.role === 'user' ? 'user' : 'bot',
            text: String(message.text ?? '') === LEFT_CHAT_TEXT ? REJOINED_CHAT_TEXT : String(message.text ?? ''),
            prefillMessage: typeof message.prefillMessage === 'string' ? message.prefillMessage : undefined,
            isMuted: Boolean(message.isMuted),
          }))
      : []

    const chatStageValue = String(parsedValue.chatStage || 'initial')
    const validChatStages = new Set(['initial', 'bank', 'c-main', 'c-business', 'c-cause'])
    const chatStage = validChatStages.has(chatStageValue) ? chatStageValue : 'initial'
    const showOptions = Boolean(parsedValue.showOptions)
    const hasInitialized = Boolean(parsedValue.hasInitialized) && (messages.length > 0 || showOptions)

    return {
      messages,
      chatStage,
      showOptions,
      hasInitialized,
      askedAIds: Array.isArray(parsedValue.askedAIds)
        ? parsedValue.askedAIds.filter((id) => typeof id === 'string')
        : [],
      askedBIds: Array.isArray(parsedValue.askedBIds)
        ? parsedValue.askedBIds.filter((id) => typeof id === 'string')
        : [],
      cPromptCount:
        typeof parsedValue.cPromptCount === 'number' && Number.isFinite(parsedValue.cPromptCount)
          ? Math.max(0, Math.floor(parsedValue.cPromptCount))
          : 0,
      idleSequenceTriggered: Boolean(parsedValue.idleSequenceTriggered),
    }
  } catch {
    return null
  }
}

function savePersistedChatState(state) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.sessionStorage.setItem(ABOUT_CHAT_SESSION_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage write errors.
  }
}

export default function Home() {
  const persistedState = useMemo(() => loadPersistedChatState(), [])
  const [messages, setMessages] = useState(() => persistedState?.messages ?? [])
  const [chatStage, setChatStage] = useState(() => persistedState?.chatStage ?? 'initial')
  const [typingMessage, setTypingMessage] = useState(null)
  const [showOptions, setShowOptions] = useState(() => persistedState?.showOptions ?? false)
  const [hasInitialized, setHasInitialized] = useState(() => persistedState?.hasInitialized ?? false)
  const [askedAIds, setAskedAIds] = useState(() => persistedState?.askedAIds ?? [])
  const [askedBIds, setAskedBIds] = useState(() => persistedState?.askedBIds ?? [])
  const [cPromptCount, setCPromptCount] = useState(() => persistedState?.cPromptCount ?? 0)
  const [idleSequenceTriggered, setIdleSequenceTriggered] = useState(() => Boolean(persistedState?.idleSequenceTriggered))
  const [isChatLocked, setIsChatLocked] = useState(false)

  const messageCounterRef = useRef(0)
  const typingTimerRef = useRef(null)
  const typingRunIdRef = useRef(0)
  const transcriptRef = useRef(null)
  const optionsDockRef = useRef(null)
  const shouldStickToBottomRef = useRef(true)
  const lastTranscriptScrollTopRef = useRef(0)
  const [optionsDockHeight, setOptionsDockHeight] = useState(0)
  const typingMessageRef = useRef(null)
  const isChatLockedRef = useRef(false)
  const idleSequenceTriggeredRef = useRef(Boolean(persistedState?.idleSequenceTriggered))
  const idleNudgeTimerRef = useRef(null)
  const idleLeaveTimerRef = useRef(null)

  const askedASet = useMemo(() => new Set(askedAIds), [askedAIds])
  const askedBSet = useMemo(() => new Set(askedBIds), [askedBIds])

  const createMessage = useCallback((role, text, metadata = {}) => {
    messageCounterRef.current += 1

    return {
      id: `${role}-${Date.now()}-${messageCounterRef.current}`,
      role,
      text,
      ...metadata,
    }
  }, [])

  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
  }, [])

  const clearIdleTimers = useCallback(() => {
    if (idleNudgeTimerRef.current !== null) {
      window.clearTimeout(idleNudgeTimerRef.current)
      idleNudgeTimerRef.current = null
    }

    if (idleLeaveTimerRef.current !== null) {
      window.clearTimeout(idleLeaveTimerRef.current)
      idleLeaveTimerRef.current = null
    }
  }, [])

  const handleTranscriptScroll = useCallback((event) => {
    const transcriptElement = event?.currentTarget ?? transcriptRef.current
    if (!transcriptElement) {
      return
    }

    const currentScrollTop = transcriptElement.scrollTop
    const didScrollUp = currentScrollTop < lastTranscriptScrollTopRef.current
    lastTranscriptScrollTopRef.current = currentScrollTop

    const distanceFromBottom =
      transcriptElement.scrollHeight - transcriptElement.scrollTop - transcriptElement.clientHeight

    if (didScrollUp && distanceFromBottom > CHAT_SCROLL_BOTTOM_THRESHOLD_PX) {
      shouldStickToBottomRef.current = false
      return
    }

    if (distanceFromBottom <= CHAT_SCROLL_BOTTOM_THRESHOLD_PX) {
      shouldStickToBottomRef.current = true
    }
  }, [])

  const typeBotMessage = useCallback(
    (text, metadata = {}, onComplete, initialDelayMs = INITIAL_TYPING_PAUSE_MS) => {
      const fullText = String(text || '')
      const typingRunId = typingRunIdRef.current + 1
      typingRunIdRef.current = typingRunId
      clearTypingTimer()

      const message = createMessage('bot', fullText, metadata)
      setTypingMessage({
        id: message.id,
        visibleText: '',
        contactRanges: getContactPhraseRanges(fullText),
      })

      let characterIndex = 0

      const typeNextCharacter = () => {
        if (typingRunIdRef.current !== typingRunId) {
          return
        }

        if (characterIndex >= fullText.length) {
          setTypingMessage(null)
          setMessages((previousMessages) => [...previousMessages, message])

          if (typeof onComplete === 'function') {
            onComplete()
          }
          return
        }

        characterIndex += 1
        const nextVisibleText = fullText.slice(0, characterIndex)

        setTypingMessage((previousTypingMessage) => {
          if (!previousTypingMessage || previousTypingMessage.id !== message.id) {
            return previousTypingMessage
          }

          return {
            ...previousTypingMessage,
            visibleText: nextVisibleText,
          }
        })

        const currentCharacter = fullText.charAt(characterIndex - 1)
        typingTimerRef.current = window.setTimeout(typeNextCharacter, getTypingDelay(currentCharacter))
      }

      typingTimerRef.current = window.setTimeout(typeNextCharacter, initialDelayMs)
    },
    [clearTypingTimer, createMessage],
  )

  const triggerIdleLeaveSequence = useCallback(() => {
    if (isChatLockedRef.current) {
      return
    }

    const run = () => {
      if (isChatLockedRef.current) {
        return
      }

      if (typingMessageRef.current) {
        idleLeaveTimerRef.current = window.setTimeout(run, 500)
        return
      }

      shouldStickToBottomRef.current = true
      typeBotMessage('...', {}, () => {
        idleLeaveTimerRef.current = window.setTimeout(() => {
          const leftMessage = createMessage('bot', LEFT_CHAT_TEXT, { isMuted: true })
          setMessages((previousMessages) => [...previousMessages, leftMessage])
          setIsChatLocked(true)
        }, IDLE_LEFT_MESSAGE_DELAY_MS)
      })
    }

    run()
  }, [createMessage, typeBotMessage])

  const scheduleIdleSequence = useCallback(() => {
    clearIdleTimers()

    if (isChatLockedRef.current || idleSequenceTriggeredRef.current) {
      return
    }

    const runIdleNudge = () => {
      if (isChatLockedRef.current) {
        return
      }

      if (typingMessageRef.current) {
        idleNudgeTimerRef.current = window.setTimeout(runIdleNudge, 500)
        return
      }

      idleSequenceTriggeredRef.current = true
      setIdleSequenceTriggered(true)
      shouldStickToBottomRef.current = true
      typeBotMessage('hello?', {}, () => {
        if (isChatLockedRef.current) {
          return
        }

        idleLeaveTimerRef.current = window.setTimeout(() => {
          triggerIdleLeaveSequence()
        }, IDLE_LEAVE_DELAY_MS)
      })
    }

    idleNudgeTimerRef.current = window.setTimeout(runIdleNudge, IDLE_NUDGE_DELAY_MS)
  }, [clearIdleTimers, triggerIdleLeaveSequence, typeBotMessage])

  useEffect(() => {
    if (hasInitialized) {
      return
    }

    setHasInitialized(true)

    typeBotMessage(INTRO_MESSAGE, {}, () => {
      setShowOptions(true)
    })
  }, [hasInitialized, typeBotMessage])

  useEffect(() => {
    const transcriptElement = transcriptRef.current
    if (!transcriptElement) {
      return
    }

    if (!shouldStickToBottomRef.current) {
      return
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      transcriptElement.scrollTop = transcriptElement.scrollHeight
      lastTranscriptScrollTopRef.current = transcriptElement.scrollTop
    })

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [messages, optionsDockHeight, showOptions, typingMessage?.visibleText])

  useEffect(() => () => {
    typingRunIdRef.current += 1
    clearTypingTimer()
  }, [clearTypingTimer])

  useEffect(() => {
    typingMessageRef.current = typingMessage
  }, [typingMessage])

  useEffect(() => {
    isChatLockedRef.current = isChatLocked
  }, [isChatLocked])

  useEffect(() => {
    idleSequenceTriggeredRef.current = idleSequenceTriggered
  }, [idleSequenceTriggered])

  useEffect(() => {
    savePersistedChatState({
      messages,
      chatStage,
      showOptions,
      hasInitialized,
      askedAIds,
      askedBIds,
      cPromptCount,
      idleSequenceTriggered,
    })
  }, [askedAIds, askedBIds, cPromptCount, chatStage, hasInitialized, idleSequenceTriggered, messages, showOptions])

  useEffect(() => {
    scheduleIdleSequence()

    const handleUserActivity = () => {
      if (isChatLockedRef.current) {
        return
      }

      if (idleSequenceTriggeredRef.current) {
        return
      }

      scheduleIdleSequence()
    }

    window.addEventListener('pointerdown', handleUserActivity, { passive: true })
    window.addEventListener('keydown', handleUserActivity)
    window.addEventListener('wheel', handleUserActivity, { passive: true })
    window.addEventListener('touchstart', handleUserActivity, { passive: true })

    return () => {
      clearIdleTimers()
      window.removeEventListener('pointerdown', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      window.removeEventListener('wheel', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
    }
  }, [clearIdleTimers, scheduleIdleSequence])

  useEffect(() => {
    const dockElement = optionsDockRef.current
    if (!dockElement || typeof window === 'undefined') {
      return undefined
    }

    const updateDockHeight = () => {
      setOptionsDockHeight(dockElement.offsetHeight)
    }

    updateDockHeight()

    if (typeof window.ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateDockHeight)
      return () => {
        window.removeEventListener('resize', updateDockHeight)
      }
    }

    const resizeObserver = new window.ResizeObserver(updateDockHeight)
    resizeObserver.observe(dockElement)
    window.addEventListener('resize', updateDockHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDockHeight)
    }
  }, [showOptions, typingMessage])

  const activeOptions = useMemo(() => {
    if (chatStage === 'initial') {
      return [WHO_ARE_YOU_OPTION]
    }

    if (chatStage === 'c-main') {
      return C_MAIN_OPTIONS
    }

    if (chatStage === 'c-business') {
      return C_BUSINESS_OPTIONS
    }

    if (chatStage === 'c-cause') {
      return C_CAUSE_OPTIONS
    }

    const usedIds = new Set()
    const bankOptions = []

    const slotAOption =
      getNextUnaskedOption(A_BRANCH_OPTIONS, askedASet, usedIds) ??
      getNextUnaskedOption(B_BRANCH_OPTIONS, askedBSet, usedIds)

    if (slotAOption) {
      usedIds.add(slotAOption.id)
      bankOptions.push(slotAOption)
    }

    const slotBOption =
      getNextUnaskedOption(B_BRANCH_OPTIONS, askedBSet, usedIds) ??
      getNextUnaskedOption(A_BRANCH_OPTIONS, askedASet, usedIds)

    if (slotBOption) {
      usedIds.add(slotBOption.id)
      bankOptions.push(slotBOption)
    }

    bankOptions.push(C_BANK_OPTION)
    return bankOptions
  }, [askedASet, askedBSet, chatStage])

  const handleOptionSelect = useCallback(
    (option) => {
      if (!option || typingMessage || isChatLocked) {
        return
      }

      shouldStickToBottomRef.current = true
      scheduleIdleSequence()

      const userMessage = createMessage('user', option.userText || option.label)
      setMessages((previousMessages) => [...previousMessages, userMessage])

      if (option.branch === 'a') {
        setAskedAIds((previousIds) => (
          previousIds.includes(option.id) ? previousIds : [...previousIds, option.id]
        ))
      } else if (option.branch === 'b') {
        setAskedBIds((previousIds) => (
          previousIds.includes(option.id) ? previousIds : [...previousIds, option.id]
        ))
      }

      const prefillMessage = option.prefillFromSelection
        ? buildContactPrefillFromSelection(option.label)
        : null
      const isCQuestion = option.id === C_BANK_OPTION.id
      const responseText =
        isCQuestion && cPromptCount > 0
          ? 'What are you looking for?'
          : option.response

      if (isCQuestion) {
        setCPromptCount((previousCount) => previousCount + 1)
      }

      const randomStartDelayMs = 250 + Math.floor(Math.random() * 251)

      typeBotMessage(
        responseText,
        prefillMessage ? { prefillMessage } : {},
        () => {
          if (option.nextStage) {
            setChatStage(option.nextStage)
            return
          }

          if (option.returnToBank) {
            setChatStage('bank')
          }
        },
        randomStartDelayMs,
      )
    },
    [cPromptCount, createMessage, isChatLocked, scheduleIdleSequence, typeBotMessage, typingMessage],
  )

  const isTypingIntro = Boolean(typingMessage) && messages.length === 0
  const latestMessageId = messages.length > 0 ? messages[messages.length - 1].id : null
  const optionsGridClassName = useMemo(() => {
    if (activeOptions.length >= 4) {
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'
    }

    if (activeOptions.length === 3) {
      return 'grid grid-cols-1 gap-3 sm:grid-cols-3'
    }

    if (activeOptions.length === 2) {
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2'
    }

    return 'grid grid-cols-1 gap-3'
  }, [activeOptions.length])

  return (
    <section
      className="relative flex w-full shrink-0 overflow-hidden bg-black text-white"
      id="about"
      aria-labelledby="about-heading"
      style={{
        height: 'calc(100dvh - var(--site-header-height, 0px))',
        maxHeight: 'calc(100dvh - var(--site-header-height, 0px))',
      }}
    >
      <h1 id="about-heading" className="sr-only">
        Will Aesoph is a web developer focused on custom websites and technical SEO
      </h1>
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 px-5 pt-2 pb-4 sm:px-8 sm:pt-3 sm:pb-6 lg:px-10 lg:pt-4 lg:pb-8">
        <div className="relative flex min-h-0 w-full flex-1 overflow-hidden border-y border-white/25 bg-black/80">
          <div
            ref={transcriptRef}
            onScroll={handleTranscriptScroll}
            className="case-study-scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4 sm:px-7 sm:pt-6 lg:px-10 lg:pt-8"
            aria-live="off"
          >
            <div
              className="space-y-6"
              style={{
                paddingBottom: `calc(${Math.max(56, optionsDockHeight + 24)}px + env(safe-area-inset-bottom))`,
              }}
            >
              {messages.map((message, index) => {
                const isIntroMessage = index === 0 && message.role === 'bot'
                const isUserMessage = message.role === 'user'
                const isLatestMessage = !typingMessage && message.id === latestMessageId

                return (
                  <div key={message.id} className={`max-w-[min(75%,46rem)] ${isUserMessage ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                    <p
                      className={`whitespace-pre-wrap ${
                        isIntroMessage
                          ? '!text-white text-[clamp(1.9rem,4.5vw,3.6rem)] font-semibold leading-[1.1] tracking-tight'
                          : isUserMessage
                            ? 'inline-block border border-white/45 px-4 py-2 !text-white text-base font-semibold tracking-wide sm:text-lg lg:text-xl'
                            : `${message.isMuted ? '!text-white/50' : '!text-white'} text-lg leading-relaxed sm:text-xl lg:text-2xl`
                      } break-words`}
                    >
                      {isUserMessage
                        ? message.text
                        : renderMessageWithContactLinks(message, `message-${message.id}`)}
                      {isLatestMessage && !isChatLocked ? (
                        <span className="chat-typing-cursor chat-typing-cursor--blink" aria-hidden="true" />
                      ) : null}
                    </p>
                  </div>
                )
              })}

              {typingMessage ? (
                <div className="mr-auto max-w-[min(75%,46rem)] text-left" aria-live="polite">
                  <p
                    className={`whitespace-pre-wrap ${
                      isTypingIntro
                        ? '!text-white text-[clamp(1.9rem,4.5vw,3.6rem)] font-semibold leading-[1.1] tracking-tight'
                        : '!text-white text-lg leading-relaxed sm:text-xl lg:text-2xl'
                    } break-words`}
                  >
                    {renderTypingMessageWithContactStyle(typingMessage, `typing-${typingMessage.id}`)}
                    <span className="chat-typing-cursor chat-typing-cursor--solid" aria-hidden="true" />
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div
            className={`absolute inset-x-0 bottom-0 z-20 transition-all duration-500 ease-out ${
              showOptions
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-3 opacity-0'
            }`}
          >
            <div
              ref={optionsDockRef}
              className="border-t border-white/20 bg-black/95 px-4 pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-7 lg:px-10"
            >
              <div className={optionsGridClassName}>
                {activeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={Boolean(typingMessage) || isChatLocked}
                    onClick={() => handleOptionSelect(option)}
                    className="chat-option-enter cursor-pointer border border-white bg-transparent px-4 py-3 text-left text-base font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-[72px]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
