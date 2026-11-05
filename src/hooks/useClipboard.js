import { useCallback, useEffect, useRef, useState } from 'react'

export function useClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text, key = null) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
        } else {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          ta.remove()
        }
        setCopied(true)
        setCopiedKey(key)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          setCopied(false)
          setCopiedKey(null)
        }, resetMs)
        return true
      } catch (e) {
        setCopied(false)
        return false
      }
    },
    [resetMs],
  )

  return { copied, copiedKey, copy }
}

export default useClipboard
