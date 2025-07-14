'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createHighlighter } from 'shiki'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Code, X } from 'lucide-react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  onLanguageChange: (language: string) => void
  placeholder?: string
  rows?: number
  onRemove?: () => void
  showRemoveButton?: boolean
}



export default function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  rows = 3,
  onRemove,
  showRemoveButton = true
}: CodeEditorProps) {
  const programmingLanguages = useSelector((state: RootState) => state.programmingLanguages?.languages || [])
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighting, setIsHighlighting] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const highlighterRef = useRef<any>(null)

  // Highlight code like CodeBlock with caching
  const highlightCode = useCallback(async (code: string, lang: string) => {
    if (!code) {
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

      // Check if the highlighted HTML has the same line count as the original code
      const originalLines = code.split('\n')
      const highlightedLines = html.split('\n')
      
      // If there's a mismatch in line count, use the original content with highlighting
      if (originalLines.length !== highlightedLines.length) {
        // Use the original code structure but with basic highlighting
        const fallbackHtml = code.replace(/\n/g, '<br>')
        setHighlightedHtml(fallbackHtml)
      } else {
        setHighlightedHtml(html)
      }
    } catch (error) {
      console.error('Failed to highlight code:', error)
      // Fallback to plain text with preserved line structure
      setHighlightedHtml(code.replace(/\n/g, '<br>'))
    } finally {
      setIsHighlighting(false)
    }
  }, [])



  // Highlight when value or language changes with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current)
    }

    // Debounce highlighting to avoid excessive calls
    highlightTimeoutRef.current = setTimeout(() => {
      highlightCode(value, language)
    }, 300) // 300ms delay

    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [value, language, highlightCode])



  // Watch for theme changes like CodeBlock
  useEffect(() => {
    const htmlEl = document.documentElement
    const observer = new MutationObserver(() => {
      if (value) {
        // Clear previous timeout
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current)
        }
        
        // Debounce theme change highlighting too
        highlightTimeoutRef.current = setTimeout(() => {
          highlightCode(value, language)
        }, 100) // Shorter delay for theme changes
      }
    })

    observer.observe(htmlEl, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [value, language, highlightCode])

  // Cleanup highlighter on unmount
  useEffect(() => {
    return () => {
      if (highlighterRef.current) {
        highlighterRef.current.dispose()
      }
    }
  }, [])

  // Handle textarea input
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const newPosition = e.currentTarget.selectionStart
    onChange(newValue)
    setCursorPosition(newPosition)
  }

    // Handle textarea key up to sync cursor position
  const handleTextareaKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart)
  }

  // Handle textarea scroll sync (horizontal only)
  const handleTextareaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (editorRef.current) {
      editorRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  // Handle editor scroll sync (horizontal only)
  const handleEditorScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (textareaRef.current) {
      textareaRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  // Handle textarea selection
  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart)
  }

  // Handle textarea key events
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after tab
      setTimeout(() => {
        target.setSelectionRange(start + 2, start + 2)
        setCursorPosition(start + 2)
      }, 0)
    }
  }

  // Sync textarea with highlighted content (but don't interfere with cursor)
  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== value) {
      textareaRef.current.value = value
    }
  }, [value])

  // Sync cursor position on focus
  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart)
  }



  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="text-xs h-8 w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {programmingLanguages.map((lang: string) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showRemoveButton && onRemove && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      
      {/* VS Code-like Editor */}
      <div 
        className="relative rounded-lg overflow-hidden cursor-text group"
        dir="ltr"
      >
        {/* Hidden textarea for input */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaInput}
          onScroll={handleTextareaScroll}
          onSelect={handleTextareaSelect}
          onKeyDown={handleTextareaKeyDown}
          onKeyUp={handleTextareaKeyUp}
          onFocus={handleTextareaFocus}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="relative resize-none !bg-transparent border-0 rounded-lg outline-none z-50 !text-sm text-transparent w-full overflow-x-auto overflow-y-hidden"
          style={{
            color: 'transparent !important',
            caretColor: '#3b82f6',
            whiteSpace: 'pre',
            lineHeight: '1.501 !important',
            fontFamily: 'var(--font-family)',
            fontSize: '14px !important',
            pointerEvents: 'auto',
            userSelect: 'text',
            padding: '16px'
          }}
        />
        
        {/* Syntax highlighted overlay like CodeBlock */}
        <div
          ref={editorRef}
          onScroll={handleEditorScroll}
          className="absolute top-0 left-0 right-0 bottom-0 text-sm whitespace-pre bg-[#f8f8f8] dark:bg-background z-10 pointer-events-none overflow-x-auto overflow-y-hidden"
          style={{
            lineHeight: '1.501 !important',
            fontFamily: 'var(--font-family)',
            fontSize: '14px !important',
            padding: '16px'
          }}
          dangerouslySetInnerHTML={{ __html: highlightedHtml || value.replace(/\n/g, '<br>') }}
        />
        
        {/* Show highlighting status */}
        {isHighlighting && (
          <div className="absolute top-2 right-2 z-20">
            <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Highlighting...
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 