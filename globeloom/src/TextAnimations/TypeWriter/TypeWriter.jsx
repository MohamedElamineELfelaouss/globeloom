import React, { useState, useEffect, useCallback } from 'react';

const TypeWriter = ({ 
  // Support both single text and words array for backward compatibility
  text = "", 
  words = [],
  speed = 100, 
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1000,
  delay = 0, 
  className = "",
  colors = [],
  cursor = true,
  cursorChar = "|",
  loop = true,
  onComplete,
  onWordChange
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Use words array if provided, otherwise fallback to single text
  const wordsToType = words.length > 0 ? words : [text];
  const currentWord = wordsToType[currentWordIndex] || "";
  
  // Get current color class
  const currentColorClass = colors.length > 0 ? colors[currentWordIndex % colors.length] : "";

  const typeSpeed = typingSpeed || speed;

  const nextWord = useCallback(() => {
    if (wordsToType.length <= 1) return; // Don't cycle if only one word/text
    
    const nextIndex = (currentWordIndex + 1) % wordsToType.length;
    setCurrentWordIndex(nextIndex);
    setCurrentCharIndex(0);
    setIsDeleting(false);
    setIsPaused(false);
    
    if (onWordChange) {
      onWordChange(nextIndex, wordsToType[nextIndex]);
    }
  }, [currentWordIndex, wordsToType, onWordChange]);
  useEffect(() => {
    if (isComplete && !loop) return;

    // Debug logging
    console.log('TypeWriter state:', {
      currentWordIndex,
      currentCharIndex,
      currentWord,
      isDeleting,
      isPaused,
      displayText
    });

    // Initial delay
    if (currentCharIndex === 0 && !isDeleting && delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentCharIndex(1);
      }, delay);
      return () => clearTimeout(delayTimer);
    }

    // Pause after completing a word (before deleting)
    if (currentCharIndex === currentWord.length && !isDeleting && !isPaused) {
      setIsPaused(true);
      const pauseTimer = setTimeout(() => {
        if (wordsToType.length > 1) {
          setIsDeleting(true);
        } else {
          setIsComplete(true);
          if (onComplete) onComplete();
        }
        setIsPaused(false);
      }, pauseTime);
      return () => clearTimeout(pauseTimer);
    }

    // Typing forward
    if (!isDeleting && currentCharIndex < currentWord.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentWord.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, typeSpeed);
      return () => clearTimeout(timer);
    }

    // Deleting backward
    if (isDeleting && currentCharIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayText(currentWord.slice(0, currentCharIndex - 1));
        setCurrentCharIndex(currentCharIndex - 1);
      }, deletingSpeed);
      return () => clearTimeout(timer);
    }

    // Finished deleting, move to next word
    if (isDeleting && currentCharIndex === 0) {
      nextWord();
    }

  }, [currentCharIndex, currentWord, isDeleting, isPaused, isComplete, typeSpeed, deletingSpeed, pauseTime, delay, onComplete, nextWord, wordsToType.length, loop]);

  return (
    <span className={`${className} ${currentColorClass}`}>
      {displayText}
      {cursor && (
        <span className="animate-pulse ml-1">{cursorChar}</span>
      )}
    </span>
  );
};

export default TypeWriter;