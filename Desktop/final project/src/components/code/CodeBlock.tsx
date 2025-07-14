'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { createHighlighter } from 'shiki'
import { Copy, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

interface CodeBlockProps {
  code: string
  language?: string
  showCopyButton?: boolean
  className?: string
  maxHeight?: string
  showExpandButton?: boolean
}

const CodeBlock = memo(function CodeBlock({
  code,
  language = 'javascript',
  showCopyButton = true,
  className = '',
  maxHeight = '300px',
  showExpandButton = true
}: CodeBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighting, setIsHighlighting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpand, setNeedsExpand] = useState(false)
  const [contentHeight, setContentHeight] = useState<string>('auto')
  const highlighterRef = useRef<any>(null)
  const codeRef = useRef<HTMLPreElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Highlight code with caching
  const highlightCode = useCallback(async (code: string, lang: string) => {
    if (!code.trim()) {
      setHighlightedHtml('')
      return
    }

    setIsHighlighting(true)
    try {
      const htmlEl = document.documentElement
      const isDark = htmlEl.classList.contains('dark')
      const themeName = isDark ? 'code-dark' : 'code-light'

      // Check if we need to create a new highlighter (language or theme changed)
      const needsNewHighlighter = !highlighterRef.current || 
        !highlighterRef.current.getLoadedLanguages().includes(lang) ||
        !highlighterRef.current.getLoadedThemes().includes(themeName)

      if (needsNewHighlighter) {
        // Dispose old highlighter if it exists
        if (highlighterRef.current) {
          try {
            highlighterRef.current.dispose()
          } catch (error) {
            console.warn('Error disposing highlighter:', error)
          }
        }

        try {
          const themePath = `/themes/${themeName}.json`
          const response = await fetch(themePath)
          
          if (!response.ok) {
            throw new Error(`Failed to load theme: ${response.status} ${response.statusText}`)
          }
          
          const customTheme = await response.json()

          highlighterRef.current = await createHighlighter({
            langs: [lang || 'javascript'],
            themes: [{ name: themeName, ...customTheme }],
          })
        } catch (themeError) {
          console.error('Failed to load theme, using fallback:', themeError)
          // Use a simple fallback theme
          const fallbackTheme = {
            name: themeName,
            type: (isDark ? 'dark' : 'light') as 'dark' | 'light',
            settings: [
              {
                scope: ['comment'],
                settings: { foreground: isDark ? '#6a9955' : '#008000' }
              },
              {
                scope: ['string'],
                settings: { foreground: isDark ? '#ce9178' : '#a31515' }
              },
              {
                scope: ['keyword'],
                settings: { foreground: isDark ? '#569cd6' : '#0000ff' }
              }
            ],
            fg: isDark ? '#d4d4d4' : '#000000',
            bg: isDark ? '#1e1e1e' : '#ffffff'
          }

          highlighterRef.current = await createHighlighter({
            langs: [lang || 'javascript'],
            themes: [fallbackTheme],
          })
        }
      }

      if (!highlighterRef.current) {
        throw new Error('Failed to create highlighter')
      }

      const html = highlighterRef.current.codeToHtml(code, {
        lang: lang || 'javascript',
        theme: themeName,
      })

      setHighlightedHtml(html)
    } catch (error) {
      console.error('Failed to highlight code:', error)
      setHighlightedHtml('')
    } finally {
      setIsHighlighting(false)
    }
  }, [])

  // Highlight when code or language changes
  useEffect(() => {
    highlightCode(code, language)
  }, [code, language, highlightCode])

  // Watch for theme changes
  useEffect(() => {
    const htmlEl = document.documentElement
    const observer = new MutationObserver(() => {
      if (code.trim()) {
        highlightCode(code, language)
      }
    })

    observer.observe(htmlEl, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [code, language, highlightCode])

  // Cleanup highlighter on unmount
  useEffect(() => {
    return () => {
      if (highlighterRef.current) {
        highlighterRef.current.dispose()
      }
    }
  }, [])

  // Check if content needs expand button and measure content height
  useEffect(() => {
    if (codeRef.current && showExpandButton) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (codeRef.current) {
          const scrollHeight = codeRef.current.scrollHeight
          const clientHeight = codeRef.current.clientHeight
          const needsExpandButton = scrollHeight > clientHeight
          setNeedsExpand(needsExpandButton)
          setContentHeight(`${scrollHeight}px`)
          console.log('CodeBlock height check:', { scrollHeight, clientHeight, needsExpandButton })
        }
      }, 100) // Increased timeout to ensure highlighting is complete
    }
  }, [highlightedHtml, showExpandButton, code])

  // Toggle expand/collapse
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
    
    // Scroll to top when collapsing
    if (isExpanded && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollTop = currentScrollTop + rect.top - 80 // Scroll 80px above the CodeBlock
      
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    // get color background from themes code-dark.json and code-light.json
    <div ref={containerRef} className={`relative rounded-lg overflow-hidden bg-[#f8f8f8] dark:bg-background ${className}`} dir="ltr">
      {/* Code content */}
      {/* show copy button on container hover */}
      <div className="relative pt-4 group">
        <span className="text-xs text-muted-foreground uppercase absolute top-2 left-2 select-none">
          {language}
        </span>

        {showCopyButton && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-6 w-6 p-0 hover:bg-background absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check className="size-3 text-primary" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
        )}
        <pre 
          ref={codeRef}
          className="text-sm p-4 transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isExpanded ? contentHeight : maxHeight,
            overflowY: 'hidden',
            overflowX: 'auto',
            whiteSpace: 'pre'
          }}
        >
          <code
            className="block"
            style={{ whiteSpace: 'pre' }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml || code }}
          />
        </pre>

        {/* Show expand/collapse button */}
        {showExpandButton && (needsExpand || isExpanded) && (
          <div className="flex justify-center transition-all duration-300">
            <button
              onClick={handleToggleExpand}
              className="flex items-center text-xs cursor-pointer py-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-3 mr-1 transition-transform duration-200" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-3 mr-1 transition-transform duration-200" />
                  Show More
                </>
              )}
            </button>
          </div>
        )}

        {/* Show highlighting status */}
        {isHighlighting && (
          <div className="absolute top-0 right-0 flex items-center justify-center w-full h-full text-muted-foreground bg-background">
            <div className="text-xs px-2 py-1 rounded">
              <Loader2 className="size-5 animate-spin" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default CodeBlock 