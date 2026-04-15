import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { clients } from '../assets/images/clients'

const CARD_MAX_ROTATION_DEG = 8
const CARD_MAX_TRANSLATION_PX = 10
const CASE_STUDY_PANEL_ID = 'client-case-study-panel'
const CASE_STUDY_ANIMATION_MS = 620
const CASE_STUDY_CONTENT_FADE_MS = 500
const CASE_STUDY_CONTENT_EXIT_FADE_MS = CASE_STUDY_CONTENT_FADE_MS + 40
const CASE_STUDY_PHRASE_START_DELAY_MS = 0
const CASE_STUDY_PHRASE_SLIDE_MS = 860
const CASE_STUDY_CONTENT_REVEAL_DELAY_MS =
  CASE_STUDY_PHRASE_START_DELAY_MS + CASE_STUDY_PHRASE_SLIDE_MS + 120
const CASE_STUDY_PHRASE_OVERLAY_HIDE_DELAY_MS = 340
const CASE_STUDY_CLOSE_RETURN_MS = Math.max(CASE_STUDY_ANIMATION_MS, CASE_STUDY_PHRASE_SLIDE_MS)
const CASE_STUDY_IMAGE_FADE_MS = 900
const CASE_STUDY_HEADER_ACTIVATION_OFFSET_PX = 108
const WORK_CARD_ENTRY_INITIAL_DELAY_MS = 560
const WORK_CARD_ENTRY_STAGGER_MS = 150

const FEATURED_CASE_STUDY_ROUTES = [
  { name: 'Athens Creek Retirement Lodge', slug: 'athens-creek' },
  { name: 'CoreCare', slug: 'corecare' },
  { name: 'Vancouver Convention Centre', slug: 'vancouver-convention-centre' },
  { name: 'PARC Retirement Living', slug: 'parcliving' },
]

const FEATURED_CLIENT_NAMES = FEATURED_CASE_STUDY_ROUTES.map(({ name }) => name)
const CASE_STUDY_ROUTE_TO_CLIENT = Object.fromEntries(
  FEATURED_CASE_STUDY_ROUTES.map(({ name, slug }) => [slug, name]),
)
const CASE_STUDY_CLIENT_TO_ROUTE = Object.fromEntries(
  FEATURED_CASE_STUDY_ROUTES.map(({ name, slug }) => [name, slug]),
)

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function handleCardPointerMove(event) {
  if (event.pointerType === 'touch' || prefersReducedMotion()) {
    return
  }

  const card = event.currentTarget
  const bounds = card.getBoundingClientRect()
  const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5
  const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5

  const rotateX = -normalizedY * CARD_MAX_ROTATION_DEG
  const rotateY = normalizedX * CARD_MAX_ROTATION_DEG
  const translateX = normalizedX * CARD_MAX_TRANSLATION_PX
  const translateY = normalizedY * CARD_MAX_TRANSLATION_PX

  card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`)
  card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`)
  card.style.setProperty('--card-translate-x', `${translateX.toFixed(2)}px`)
  card.style.setProperty('--card-translate-y', `${translateY.toFixed(2)}px`)
}

function resetCardMotion(event) {
  const card = event.currentTarget
  card.style.setProperty('--card-rotate-x', '0deg')
  card.style.setProperty('--card-rotate-y', '0deg')
  card.style.setProperty('--card-translate-x', '0px')
  card.style.setProperty('--card-translate-y', '0px')
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getCollapsedTransform(originRect) {
  if (!originRect || typeof window === 'undefined') {
    return 'translate3d(0px, 24px, 0) scale(0.98, 0.98)'
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return 'translate3d(0px, 24px, 0) scale(0.98, 0.98)'
  }

  const scaleX = clamp(originRect.width / viewportWidth, 0.05, 1)
  const scaleY = clamp(originRect.height / viewportHeight, 0.05, 1)

  return `translate3d(${originRect.left}px, ${originRect.top}px, 0) scale(${scaleX}, ${scaleY})`
}

function getCaseStudyImageSource(client, scrollProgress) {
  if (!client) {
    return ''
  }

  const progress = clamp(scrollProgress, 0, 1)

  const clientKeyframes = Array.isArray(client.caseStudy?.images)
    ? client.caseStudy.images
    : []

  const resolvedKeyframes = clientKeyframes.length > 0
    ? clientKeyframes
    : [{ id: 'hero', at: 0, src: client.screenshot }]

  const keyframes = resolvedKeyframes
    .map((frame, index) => ({
      id: frame.id ?? `frame-${index + 1}`,
      at: clamp(Number(frame.at ?? 0), 0, 1),
      src: frame.src || client.screenshot,
    }))
    .filter((frame) => Boolean(frame.src))
    .sort((a, b) => a.at - b.at)

  if (keyframes.length === 0) {
    return client.screenshot
  }

  let resolvedFrameSrc = keyframes[0].src
  for (let index = 1; index < keyframes.length; index += 1) {
    if (progress >= keyframes[index].at) {
      resolvedFrameSrc = keyframes[index].src
    }
  }

  return resolvedFrameSrc
}

function toReadableWorkLabel(keyword) {
  return String(keyword)
    .trim()
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function buildDefaultCaseStudyParagraphs(client) {
  const workTypes = Array.isArray(client.work)
    ? client.work.filter(Boolean).map(toReadableWorkLabel)
    : []
  const workSummary = workTypes.length > 0 ? workTypes.join(', ') : 'Custom Website Development'

  return [
    `${client.name} came in with a clear objective to improve the digital experience and better align the website with customer behavior. The broader goal was to create a presence that felt easier to navigate, easier to maintain internally, and more clearly aligned to what visitors were actually trying to do when they landed on key pages.`,
    `The scope included ${workSummary}, with a strong emphasis on clean execution, clear user flows, and maintainable implementation. This included careful planning around content structure, component flexibility, and implementation patterns that would let the team extend the site over time without introducing unnecessary complexity or regressions.`,
    `The project focused on reducing friction, clarifying hierarchy, and creating a more intuitive experience across device sizes. We also used this pass to simplify navigation paths, make core interactions more obvious, and strengthen visual rhythm so users could move through key journeys with less cognitive load and fewer drop-off points.`,
    `This is placeholder case study copy for now. Replace these paragraphs with project-specific details, outcomes, and technical decisions. You can expand this section with measurable results, before-and-after context, architecture choices, and lessons learned to create a complete narrative that supports both portfolio storytelling and technical depth.`,
  ]
}

function buildCaseStudySections(client, paragraphs) {
  if (!client) {
    return []
  }

  const phrase = String(client?.caseStudy?.phrase || '').trim()
  const configuredSections = Array.isArray(client?.caseStudy?.sections)
    ? client.caseStudy.sections
      .map((section, index, sections) => {
        const heading = String(section?.heading || '').trim()
        const sectionParagraphs = Array.isArray(section?.copy)
          ? section.copy.filter(Boolean)
          : section?.copy
            ? [section.copy]
            : []
        const normalizedAt = sections.length > 0 ? index / sections.length : 0

        return {
          key: section?.id ?? `section-${index + 1}`,
          at: clamp(Number(section?.at ?? normalizedAt), 0, 1),
          image: section?.image || getCaseStudyImageSource(client, normalizedAt),
          heading: heading || (index === 0 ? phrase : ''),
          paragraphs: sectionParagraphs,
        }
      })
      .filter((section) => section.heading || section.paragraphs.length > 0)
    : []

  if (configuredSections.length > 0) {
    return configuredSections
  }

  const validParagraphs = Array.isArray(paragraphs) ? paragraphs.filter(Boolean) : []
  const midHeading = String(client?.caseStudy?.midHeading || '').trim()
  const midpointIndex = midHeading ? Math.ceil(validParagraphs.length / 2) : -1

  if (midHeading) {
    return [
      {
        key: 'section-1',
        at: 0,
        image: getCaseStudyImageSource(client, 0),
        heading: phrase,
        paragraphs: validParagraphs.slice(0, midpointIndex),
      },
      {
        key: 'section-2',
        at: 0.5,
        image: getCaseStudyImageSource(client, 0.5),
        heading: midHeading,
        paragraphs: validParagraphs.slice(midpointIndex),
      },
    ].filter((section) => section.heading || section.paragraphs.length > 0)
  }

  return [
    {
      key: 'section-1',
      at: 0,
      image: getCaseStudyImageSource(client, 0),
      heading: phrase,
      paragraphs: validParagraphs,
    },
  ]
}

function getCaseStudyPhrase(client) {
  return client.caseStudy?.phrase || 'Simple can be better'
}

function getIntroPhraseMotionStyle(isPhraseDocked, isDesktopCaseStudyLayout) {
  if (!isDesktopCaseStudyLayout && isPhraseDocked) {
    return {
      left: '1.5rem',
      top: 'calc(var(--case-study-image-h) + 1.5rem)',
      transform: 'translate3d(0, 0, 0)',
      fontSize: 'clamp(1.5rem, 5.6vw, 2rem)',
    }
  }

  if (isPhraseDocked) {
    return {
      left: '3.5rem',
      top: '12rem',
      transform: 'translate3d(0, 0, 0)',
      fontSize: 'clamp(1.6rem, 2.2vw, 2.6rem)',
    }
  }

  return {
    left: '50%',
    top: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    fontSize: 'clamp(2rem, 4.1vw, 4.3rem)',
  }
}

function getOffsetWithinAncestor(node, ancestor) {
  let currentNode = node
  let left = 0
  let top = 0

  while (currentNode && currentNode !== ancestor) {
    left += currentNode.offsetLeft
    top += currentNode.offsetTop
    currentNode = currentNode.offsetParent
  }

  if (currentNode !== ancestor) {
    return null
  }

  return { left, top }
}

function renderParagraphWithInlineLinks(paragraph, inlineLinks, keyPrefix) {
  const paragraphText = String(paragraph || '')
  if (!paragraphText) {
    return paragraphText
  }

  const validLinks = Array.isArray(inlineLinks)
    ? inlineLinks.filter((link) => Boolean(link?.text) && Boolean(link?.url))
    : []

  if (validLinks.length === 0) {
    return paragraphText
  }

  const matches = []
  validLinks.forEach((link, linkIndex) => {
    let searchStart = 0
    while (searchStart < paragraphText.length) {
      const matchStart = paragraphText.indexOf(link.text, searchStart)
      if (matchStart === -1) {
        break
      }

      matches.push({
        start: matchStart,
        end: matchStart + link.text.length,
        url: link.url,
        key: `${keyPrefix}-link-${linkIndex}-${matchStart}`,
      })

      searchStart = matchStart + link.text.length
    }
  })

  if (matches.length === 0) {
    return paragraphText
  }

  const sortedMatches = matches.sort((a, b) => {
    if (a.start !== b.start) {
      return a.start - b.start
    }
    return b.end - a.end
  })

  const nonOverlappingMatches = []
  let matchCursor = -1
  sortedMatches.forEach((match) => {
    if (match.start >= matchCursor) {
      nonOverlappingMatches.push(match)
      matchCursor = match.end
    }
  })

  if (nonOverlappingMatches.length === 0) {
    return paragraphText
  }

  const renderedParts = []
  let textCursor = 0

  nonOverlappingMatches.forEach((match) => {
    if (match.start > textCursor) {
      renderedParts.push(paragraphText.slice(textCursor, match.start))
    }

    renderedParts.push(
      <a
        key={match.key}
        href={match.url}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-white underline decoration-white/80 underline-offset-2 transition-opacity hover:opacity-80"
      >
        {paragraphText.slice(match.start, match.end)}
      </a>,
    )

    textCursor = match.end
  })

  if (textCursor < paragraphText.length) {
    renderedParts.push(paragraphText.slice(textCursor))
  }

  return renderedParts
}

export default function Work() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeClientName, setActiveClientName] = useState(null)
  const [caseStudyExpanded, setCaseStudyExpanded] = useState(false)
  const [caseStudyTextExpanded, setCaseStudyTextExpanded] = useState(false)
  const [caseStudyPhraseDocked, setCaseStudyPhraseDocked] = useState(false)
  const [caseStudyOriginRect, setCaseStudyOriginRect] = useState(null)
  const [caseStudyTextProgress, setCaseStudyTextProgress] = useState(0)
  const [activeCaseStudySectionIndex, setActiveCaseStudySectionIndex] = useState(0)
  const [activeCaseStudyImageSrc, setActiveCaseStudyImageSrc] = useState('')
  const [previousCaseStudyImageSrc, setPreviousCaseStudyImageSrc] = useState('')
  const [isCaseStudyImageTransitioning, setIsCaseStudyImageTransitioning] = useState(false)
  const [caseStudyPhraseTargetPosition, setCaseStudyPhraseTargetPosition] = useState(null)
  const [isCaseStudyPhraseOverlayVisible, setIsCaseStudyPhraseOverlayVisible] = useState(true)
  const [isDesktopCaseStudyLayout, setIsDesktopCaseStudyLayout] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  )
  const cardRefs = useRef(new Map())
  const caseStudyPanelRef = useRef(null)
  const caseStudyStickyHeaderRef = useRef(null)
  const caseStudyTextScrollContainerRef = useRef(null)
  const caseStudySectionHeadingRefs = useRef([])
  const caseStudyPhraseAnchorRef = useRef(null)
  const animationTimersRef = useRef([])
  const imageTransitionTimerRef = useRef(null)
  const routeClientName = useMemo(
    () => (slug ? CASE_STUDY_ROUTE_TO_CLIENT[slug] ?? null : null),
    [slug],
  )

  const featuredClients = useMemo(
    () => FEATURED_CASE_STUDY_ROUTES
      .map(({ name }) => clients.find((client) => client.name === name))
      .filter(Boolean),
    [],
  )

  const otherBrandClients = useMemo(
    () => clients.filter((client) => !FEATURED_CLIENT_NAMES.includes(client.name)),
    [],
  )

  const activeClient = useMemo(
    () => featuredClients.find((client) => client.name === activeClientName) ?? null,
    [activeClientName, featuredClients],
  )

  const activeCaseStudyParagraphs = useMemo(
    () => {
      if (!activeClient) {
        return []
      }

      const configuredCopy = Array.isArray(activeClient.caseStudy?.copy)
        ? activeClient.caseStudy.copy.filter(Boolean)
        : []

      return configuredCopy.length > 0 ? configuredCopy : buildDefaultCaseStudyParagraphs(activeClient)
    },
    [activeClient],
  )
  const activeCaseStudySections = useMemo(
    () => buildCaseStudySections(activeClient, activeCaseStudyParagraphs),
    [activeCaseStudyParagraphs, activeClient],
  )
  const activeCaseStudyPhrase = useMemo(
    () => (activeClient ? getCaseStudyPhrase(activeClient) : ''),
    [activeClient],
  )
  const activeCaseStudyInlineLinks = useMemo(
    () => (Array.isArray(activeClient?.caseStudy?.inlineLinks) ? activeClient.caseStudy.inlineLinks : []),
    [activeClient],
  )

  const activeSectionImageSrc = useMemo(() => {
    if (!activeClient) {
      return ''
    }

    const activeSection = activeCaseStudySections[activeCaseStudySectionIndex]
    if (activeSection?.image) {
      return activeSection.image
    }

    return getCaseStudyImageSource(activeClient, caseStudyTextProgress)
  }, [activeCaseStudySectionIndex, activeCaseStudySections, activeClient, caseStudyTextProgress])

  const clearAnimationTimers = useCallback(() => {
    animationTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    animationTimersRef.current = []
  }, [])

  const clearImageTransitionTimer = useCallback(() => {
    if (imageTransitionTimerRef.current !== null) {
      window.clearTimeout(imageTransitionTimerRef.current)
      imageTransitionTimerRef.current = null
    }
  }, [])

  const updateActiveSectionFromHeaderPositions = useCallback((scrollElement) => {
    if (!scrollElement || activeCaseStudySections.length === 0) {
      setActiveCaseStudySectionIndex(0)
      return
    }

    const stickyHeaderHeight = caseStudyStickyHeaderRef.current?.offsetHeight ?? 0
    const activationY =
      scrollElement.getBoundingClientRect().top +
      stickyHeaderHeight +
      CASE_STUDY_HEADER_ACTIVATION_OFFSET_PX

    let nextActiveSectionIndex = 0
    activeCaseStudySections.forEach((_, index) => {
      const headingElement = caseStudySectionHeadingRefs.current[index]
      if (!headingElement) {
        return
      }

      if (headingElement.getBoundingClientRect().top <= activationY) {
        nextActiveSectionIndex = index
      }
    })

    setActiveCaseStudySectionIndex((previousIndex) =>
      previousIndex === nextActiveSectionIndex ? previousIndex : nextActiveSectionIndex,
    )
  }, [activeCaseStudySections])

  useEffect(() => () => clearAnimationTimers(), [clearAnimationTimers])
  useEffect(() => () => clearImageTransitionTimer(), [clearImageTransitionTimer])

  useEffect(() => {
    caseStudySectionHeadingRefs.current = caseStudySectionHeadingRefs.current.slice(
      0,
      activeCaseStudySections.length,
    )
  }, [activeCaseStudySections.length])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const updateViewport = () => {
      setIsDesktopCaseStudyLayout(window.innerWidth >= 1024)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])

  const closeCaseStudy = useCallback(() => {
    if (!activeClientName) {
      return
    }

    const activeCardElement = cardRefs.current.get(activeClientName)
    if (activeCardElement) {
      setCaseStudyOriginRect(activeCardElement.getBoundingClientRect())
    }
    navigate('/work')
  }, [activeClientName, navigate])

  const openCaseStudy = (clientName, cardElement) => {
    const caseStudySlug = CASE_STUDY_CLIENT_TO_ROUTE[clientName]
    if (!caseStudySlug) {
      return
    }

    clearAnimationTimers()
    setCaseStudyOriginRect(cardElement.getBoundingClientRect())
    navigate(`/work/${caseStudySlug}`)
  }

  useEffect(() => {
    if (routeClientName && routeClientName !== activeClientName) {
      clearAnimationTimers()
      clearImageTransitionTimer()
      setCaseStudyTextProgress(0)
      setActiveCaseStudySectionIndex(0)
      setActiveCaseStudyImageSrc('')
      setPreviousCaseStudyImageSrc('')
      setIsCaseStudyImageTransitioning(false)
      setCaseStudyPhraseTargetPosition(null)
      setIsCaseStudyPhraseOverlayVisible(true)
      setCaseStudyExpanded(false)
      setCaseStudyTextExpanded(false)
      setCaseStudyPhraseDocked(false)
      setActiveClientName(routeClientName)

      if (!isDesktopCaseStudyLayout) {
        setCaseStudyExpanded(true)
        setCaseStudyPhraseDocked(true)

        const revealTextTimer = window.setTimeout(() => {
          setCaseStudyTextExpanded(true)
        }, 160)

        animationTimersRef.current = [revealTextTimer]
        return
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setCaseStudyExpanded(true)
        })
      })

      window.requestAnimationFrame(() => {
        setCaseStudyPhraseDocked(true)
      })

      const revealTextTimer = window.setTimeout(() => {
        setCaseStudyTextExpanded(true)
      }, CASE_STUDY_CONTENT_REVEAL_DELAY_MS)

      animationTimersRef.current = [revealTextTimer]
      return
    }

    if (!routeClientName && activeClientName) {
      clearAnimationTimers()
      clearImageTransitionTimer()
      setCaseStudyTextExpanded(false)
      setIsCaseStudyPhraseOverlayVisible(true)
      setActiveCaseStudySectionIndex(0)

      if (!isDesktopCaseStudyLayout) {
        const clearPanelTimer = window.setTimeout(() => {
          setCaseStudyPhraseDocked(false)
          setCaseStudyExpanded(false)
          setActiveClientName(null)
          setCaseStudyOriginRect(null)
          setCaseStudyTextProgress(0)
          setActiveCaseStudyImageSrc('')
          setPreviousCaseStudyImageSrc('')
          setIsCaseStudyImageTransitioning(false)
          setCaseStudyPhraseTargetPosition(null)
        }, 220)

        animationTimersRef.current = [clearPanelTimer]
        return
      }

      const collapsePanelTimer = window.setTimeout(() => {
        setCaseStudyPhraseDocked(false)
        setCaseStudyExpanded(false)
      }, CASE_STUDY_CONTENT_EXIT_FADE_MS)

      const clearPanelTimer = window.setTimeout(() => {
        setActiveClientName(null)
        setCaseStudyOriginRect(null)
        setCaseStudyTextProgress(0)
        setActiveCaseStudyImageSrc('')
        setPreviousCaseStudyImageSrc('')
        setIsCaseStudyImageTransitioning(false)
        setCaseStudyPhraseTargetPosition(null)
      }, CASE_STUDY_CONTENT_EXIT_FADE_MS + CASE_STUDY_CLOSE_RETURN_MS)

      animationTimersRef.current = [collapsePanelTimer, clearPanelTimer]
    }
  }, [
    activeClientName,
    clearAnimationTimers,
    clearImageTransitionTimer,
    isDesktopCaseStudyLayout,
    routeClientName,
  ])

  useEffect(() => {
    if (!activeClient || !activeSectionImageSrc) {
      return
    }

    if (!activeCaseStudyImageSrc) {
      setActiveCaseStudyImageSrc(activeSectionImageSrc)
      setPreviousCaseStudyImageSrc('')
      setIsCaseStudyImageTransitioning(false)
      return
    }

    if (activeCaseStudyImageSrc === activeSectionImageSrc) {
      return
    }

    clearImageTransitionTimer()
    setPreviousCaseStudyImageSrc(activeCaseStudyImageSrc)
    setActiveCaseStudyImageSrc(activeSectionImageSrc)
    setIsCaseStudyImageTransitioning(true)

    imageTransitionTimerRef.current = window.setTimeout(() => {
      setPreviousCaseStudyImageSrc('')
      setIsCaseStudyImageTransitioning(false)
      imageTransitionTimerRef.current = null
    }, CASE_STUDY_IMAGE_FADE_MS)
  }, [
    activeCaseStudyImageSrc,
    activeClient,
    activeSectionImageSrc,
    clearImageTransitionTimer,
  ])

  useEffect(() => {
    if (!activeClient) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeCaseStudy()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activeClient, closeCaseStudy])

  const handleCaseStudyTextScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const scrollableHeight = Math.max(scrollHeight - clientHeight, 1)
    setCaseStudyTextProgress(clamp(scrollTop / scrollableHeight, 0, 1))
    updateActiveSectionFromHeaderPositions(event.currentTarget)
  }

  useEffect(() => {
    if (!activeClient || !caseStudyTextExpanded) {
      setActiveCaseStudySectionIndex(0)
      return undefined
    }

    const updateFromCurrentScrollPosition = () => {
      updateActiveSectionFromHeaderPositions(caseStudyTextScrollContainerRef.current)
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateFromCurrentScrollPosition)
    })

    window.addEventListener('resize', updateFromCurrentScrollPosition)
    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateFromCurrentScrollPosition)
    }
  }, [
    activeCaseStudySections,
    activeClient,
    caseStudyTextExpanded,
    updateActiveSectionFromHeaderPositions,
  ])

  useEffect(() => {
    if (!activeClient || !isDesktopCaseStudyLayout) {
      setCaseStudyPhraseTargetPosition(null)
      return undefined
    }

    const updatePhraseTargetPosition = () => {
      const anchorElement = caseStudyPhraseAnchorRef.current
      const panelElement = caseStudyPanelRef.current
      if (!anchorElement || !panelElement) {
        return
      }

      const offsetWithinPanel = getOffsetWithinAncestor(anchorElement, panelElement)
      if (!offsetWithinPanel) {
        return
      }

      setCaseStudyPhraseTargetPosition(offsetWithinPanel)
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updatePhraseTargetPosition)
    })
    window.addEventListener('resize', updatePhraseTargetPosition)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updatePhraseTargetPosition)
    }
  }, [activeClient, isDesktopCaseStudyLayout])

  useEffect(() => {
    if (!activeClient || !isDesktopCaseStudyLayout) {
      return undefined
    }

    if (!caseStudyTextExpanded) {
      setIsCaseStudyPhraseOverlayVisible(true)
      return undefined
    }

    if (!caseStudyPhraseTargetPosition) {
      return undefined
    }

    const hideOverlayTimer = window.setTimeout(() => {
      setIsCaseStudyPhraseOverlayVisible(false)
    }, CASE_STUDY_PHRASE_OVERLAY_HIDE_DELAY_MS)

    return () => {
      window.clearTimeout(hideOverlayTimer)
    }
  }, [activeClient, caseStudyPhraseTargetPosition, caseStudyTextExpanded, isDesktopCaseStudyLayout])

  const caseStudyPhraseMotionStyle = {
    ...(isDesktopCaseStudyLayout && caseStudyPhraseDocked && !caseStudyPhraseTargetPosition
      ? getIntroPhraseMotionStyle(false, isDesktopCaseStudyLayout)
      : getIntroPhraseMotionStyle(caseStudyPhraseDocked, isDesktopCaseStudyLayout)),
    ...(isDesktopCaseStudyLayout && caseStudyPhraseDocked && caseStudyPhraseTargetPosition
      ? {
          left: `${caseStudyPhraseTargetPosition.left}px`,
          top: `${caseStudyPhraseTargetPosition.top}px`,
          transform: 'translate3d(0, 0, 0)',
          fontSize: 'clamp(1.6rem, 2.2vw, 2.6rem)',
        }
      : {}),
    transitionDuration: `${CASE_STUDY_PHRASE_SLIDE_MS}ms`,
  }

  const caseStudyPanelTransform = caseStudyExpanded
    ? 'translate3d(0px, 0px, 0) scale(1, 1)'
    : isDesktopCaseStudyLayout
      ? getCollapsedTransform(caseStudyOriginRect)
      : 'translate3d(0px, 0px, 0) scale(1, 1)'

  return (
    <section className="section w-full bg-black">
      <div className="mx-auto w-full px-3 sm:px-6 lg:px-10">
        <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-3">
          {featuredClients.map((client, index) => (
            <li key={client.name}>
              <button
                ref={(node) => {
                  if (node) {
                    cardRefs.current.set(client.name, node)
                  } else {
                    cardRefs.current.delete(client.name)
                  }
                }}
                type="button"
                aria-label={`Open case study for ${client.name}`}
                aria-haspopup="dialog"
                aria-controls={CASE_STUDY_PANEL_ID}
                onClick={(event) => openCaseStudy(client.name, event.currentTarget)}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={resetCardMotion}
                className="work-card-enter group relative isolate h-[320px] w-full cursor-pointer overflow-hidden rounded-none border border-slate-200 bg-white text-left shadow-[0_24px_62px_-34px_rgba(15,23,42,0.38)] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out sm:h-[380px] lg:h-[430px]"
                style={{
                  '--card-rotate-x': '0deg',
                  '--card-rotate-y': '0deg',
                  '--card-translate-x': '0px',
                  '--card-translate-y': '0px',
                  animationDelay: `${WORK_CARD_ENTRY_INITIAL_DELAY_MS + index * WORK_CARD_ENTRY_STAGGER_MS}ms`,
                  transform:
                    'perspective(1200px) translate3d(var(--card-translate-x), var(--card-translate-y), 0) rotateX(var(--card-rotate-x)) rotateY(var(--card-rotate-y))',
                }}
              >
                <div className="relative z-10 h-full p-3 transition-opacity duration-500 group-hover:opacity-0 sm:p-4 lg:p-5">
                  <div className="relative flex h-full items-center justify-center">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="relative h-20 w-auto max-h-[42%] max-w-[86%] object-contain sm:h-24 lg:h-28"
                    />
                  </div>
                </div>
                <span className="sr-only">{client.name}</span>

                <div className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 opacity-0 transition-opacity duration-500 delay-0 group-hover:delay-250 group-hover:opacity-100">
                  <span className="text-center text-3xl font-bold tracking-widest text-white uppercase sm:text-5xl lg:text-6xl">
                    {getCaseStudyPhrase(client)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="other-brands-heading" className="mt-14 bg-white py-10 sm:mt-18 sm:py-14">
        <div className="px-6 lg:px-8">
          <h2
            id="other-brands-heading"
            className="text-center text-3xl font-semibold tracking-widest text-slate-900 uppercase sm:text-4xl"
          >
            Other Brands I&apos;ve Worked With
          </h2>
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {otherBrandClients.map((client) => (
              <li key={`other-brand-${client.name}`} className="flex items-center justify-center px-4 py-2 sm:px-5 sm:py-3">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="max-h-12 w-auto max-w-full object-contain grayscale opacity-80 transition-opacity duration-300 hover:opacity-100 sm:max-h-14"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {typeof window !== 'undefined' &&
        createPortal(
          <div
            id={CASE_STUDY_PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-hidden={!activeClient}
            className={`fixed inset-0 z-[220] ${
              activeClient ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <button
              type="button"
              tabIndex={activeClient ? 0 : -1}
              aria-label="Close case study"
              onClick={closeCaseStudy}
              className={`absolute inset-0 bg-black/70 transition-opacity duration-[620ms] ${
                activeClient && caseStudyExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {activeClient ? (
              <>
                <article
                  ref={caseStudyPanelRef}
                  className="absolute inset-0 origin-top-left overflow-hidden bg-black text-white shadow-[0_70px_120px_-60px_rgba(0,0,0,0.95)]"
                  style={{
                    transform: caseStudyPanelTransform,
                    transition: isDesktopCaseStudyLayout
                      ? `transform ${CASE_STUDY_ANIMATION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
                      : 'none',
                    '--case-study-image-h': 'min(62vh, calc(100vw * 4 / 5))',
                  }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 z-35 transition-opacity duration-[500ms] ${
                      caseStudyTextExpanded ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="absolute inset-0 bg-black" />
                  </div>
                  {isDesktopCaseStudyLayout ? (
                    <div
                      className={`pointer-events-none absolute z-45 font-semibold tracking-tight text-white transition-[left,top,transform,font-size,opacity] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                        isCaseStudyPhraseOverlayVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={caseStudyPhraseMotionStyle}
                    >
                      {activeCaseStudyPhrase}
                    </div>
                  ) : null}

                  <div className="flex h-full flex-col bg-black lg:flex-row-reverse">
                    <div
                      className={`relative shrink-0 overflow-hidden border-b border-white/15 ${
                        isDesktopCaseStudyLayout
                          ? 'lg:h-full lg:border-b-0 lg:border-l lg:border-r-0'
                          : ''
                      }`}
                      style={{
                        width: isDesktopCaseStudyLayout ? '56%' : '100%',
                        height: isDesktopCaseStudyLayout
                          ? '100%'
                          : 'var(--case-study-image-h)',
                        minHeight: isDesktopCaseStudyLayout
                          ? '100%'
                          : '220px',
                      }}
                    >
                      <div className="flex h-full flex-col bg-black p-4 sm:p-6 lg:p-10">
                        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-300/40 bg-[#0f1115]">
                          <div className="relative z-10 flex h-8 shrink-0 items-center gap-1.5 border-b border-white/10 bg-[#121821] px-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                          </div>
                          <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
                            {previousCaseStudyImageSrc && isCaseStudyImageTransitioning ? (
                              <img
                                key={`case-study-image-previous-${previousCaseStudyImageSrc}`}
                                src={previousCaseStudyImageSrc}
                                alt={`${activeClient.name} case study image`}
                                className={`absolute inset-0 h-full w-full object-top object-cover ${
                                  caseStudyTextExpanded ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                  animation: `caseStudyImageFadeOut ${CASE_STUDY_IMAGE_FADE_MS}ms ease forwards`,
                                }}
                              />
                            ) : null}
                            {activeCaseStudyImageSrc ? (
                              <img
                                key={`case-study-image-active-${activeCaseStudyImageSrc}`}
                                src={activeCaseStudyImageSrc}
                                alt={`${activeClient.name} case study image`}
                                className={`absolute inset-0 h-full w-full object-top object-cover ${
                                  caseStudyTextExpanded ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                  animation: isCaseStudyImageTransitioning
                                    ? `caseStudyImageFadeIn ${CASE_STUDY_IMAGE_FADE_MS}ms ease forwards`
                                    : 'none',
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`relative overflow-hidden bg-black lg:shrink-0 ${
                        isDesktopCaseStudyLayout
                          ? 'transition-opacity duration-[420ms] ease-out'
                          : 'transition-opacity duration-[360ms] ease-out'
                      } ${
                        caseStudyTextExpanded ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                      }`}
                      style={{
                        transitionDuration: `${CASE_STUDY_CONTENT_FADE_MS}ms`,
                        maxHeight: isDesktopCaseStudyLayout
                          ? '100%'
                          : 'none',
                        width: isDesktopCaseStudyLayout ? '44%' : '100%',
                        maxWidth: isDesktopCaseStudyLayout ? '44%' : '100%',
                      }}
                    >
                      <div
                        ref={caseStudyTextScrollContainerRef}
                        onScroll={handleCaseStudyTextScroll}
                        className="case-study-scrollbar-hidden h-full overflow-y-auto bg-black px-6 pb-[42vh] sm:px-10 sm:pb-[38vh] lg:px-14 lg:pb-[34vh]"
                      >
                        <div className="w-full text-left lg:ml-auto lg:mr-0 lg:max-w-[800px]">
                          <div
                            ref={caseStudyStickyHeaderRef}
                            className="sticky top-0 z-20 bg-black pt-5 sm:pt-24 lg:pt-32"
                          >
                            <h2
                              className={`font-semibold tracking-tight text-white transition-opacity duration-[500ms] sm:!text-3xl lg:!text-5xl ${
                                caseStudyTextExpanded ? 'opacity-100 delay-[140ms]' : 'opacity-0'
                              }`}
                            >
                              {activeClient.name}
                            </h2>
                            <div
                              className={`pb-4 transition-opacity duration-[500ms] ${
                                caseStudyTextExpanded ? 'opacity-100 delay-[220ms]' : 'opacity-0'
                              }`}
                            >
                              <a
                                href={activeClient.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open live link for ${activeClient.name}`}
                                className="mt-3 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-white underline decoration-white underline-offset-4 transition hover:opacity-80 sm:text-base"
                              >
                                Live Website
                              </a>
                            </div>
                          </div>

                          <div
                            className={`mt-4 pt-2 space-y-10 text-lg leading-[1.8] text-white transition-opacity duration-[500ms] sm:mt-10 sm:space-y-12 sm:text-2xl lg:mt-14 ${
                              caseStudyTextExpanded ? 'opacity-100 delay-[340ms]' : 'opacity-0'
                            }`}
                          >
                            {activeCaseStudySections.map((section, index) => {
                              const isActiveSection = index === activeCaseStudySectionIndex
                              const sectionHeading = index === 0
                                ? activeCaseStudyPhrase
                                : section.heading

                              return (
                                <div
                                  key={section.key}
                                  className={`space-y-4 transition-opacity duration-[500ms] ${
                                    isActiveSection ? 'opacity-100' : 'opacity-30'
                                  }`}
                                >
                                  {sectionHeading ? (
                                    index === 0 ? (
                                      <h3
                                        ref={(node) => {
                                          caseStudyPhraseAnchorRef.current = node
                                          caseStudySectionHeadingRefs.current[index] = node
                                        }}
                                        className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[clamp(1.6rem,2.2vw,2.6rem)]"
                                      >
                                        {sectionHeading}
                                      </h3>
                                    ) : (
                                      <h4
                                        ref={(node) => {
                                          caseStudySectionHeadingRefs.current[index] = node
                                        }}
                                        className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                                      >
                                        {sectionHeading}
                                      </h4>
                                    )
                                  ) : null}
                                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                                    <p key={`${section.key}-paragraph-${paragraphIndex}`} className="!text-white">
                                      {renderParagraphWithInlineLinks(
                                        paragraph,
                                        activeCaseStudyInlineLinks,
                                        `${section.key}-paragraph-${paragraphIndex}`,
                                      )}
                                    </p>
                                  ))}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-black/95 via-black/78 to-transparent sm:h-36" />

                      <button
                        type="button"
                        onClick={closeCaseStudy}
                        aria-label="Go back from case study"
                        className="group absolute bottom-6 left-6 z-20 flex cursor-pointer items-center gap-2.5 text-[1rem] leading-none font-bold text-white transition hover:opacity-80 sm:bottom-8 sm:left-10 sm:gap-3 sm:text-[2rem] lg:left-14"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-flex transition-transform duration-300 group-hover:-translate-x-4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="h-5 w-5 sm:h-10 sm:w-10"
                            fill="#e3e3e3"
                          >
                            <path d="m287-446.67 240 240L480-160 160-480l320-320 47 46.67-240 240h513v66.66H287Z" />
                          </svg>
                        </span>
                        <span>Go Back</span>
                      </button>
                    </div>
                  </div>
                </article>
              </>
            ) : null}
          </div>,
          window.document.body,
        )}
    </section>
  )
}
