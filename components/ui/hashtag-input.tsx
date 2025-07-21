"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Hash } from 'lucide-react';

interface HashtagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
}

export default function HashtagInput({ 
  tags, 
  onChange, 
  placeholder = "Add hashtags...", 
  disabled = false,
  maxTags = 10 
}: HashtagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().replace(/^#/, '').toLowerCase();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < maxTags) {
      onChange([...tags, cleanTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Auto-add tag when user types # followed by text and space/enter
    if (value.includes('#')) {
      const hashtagMatch = value.match(/#(\w+)/g);
      if (hashtagMatch) {
        const newTag = hashtagMatch[hashtagMatch.length - 1].substring(1);
        if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
          addTag(newTag);
          setInputValue(value.replace(/#(\w+)/g, '').trim());
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const hashtags = pastedText.match(/#(\w+)/g) || [];
    
    hashtags.forEach(hashtag => {
      const tag = hashtag.substring(1);
      if (tag && !tags.includes(tag) && tags.length < maxTags) {
        addTag(tag);
      }
    });
  };

  return (
    <div className="w-full">
      <div
        className={`min-h-[56px] px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-transparent transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {/* Existing Tags */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium"
            >
              <Hash className="w-3 h-3" />
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-yellow-600 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          
          {/* Input Field */}
          {tags.length < maxTags && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={tags.length === 0 ? placeholder : "Add another hashtag..."}
              disabled={disabled}
              className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-gray-400"
            />
          )}
        </div>
      </div>
      
      {/* Helper Text */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-gray-400">
          Press Enter, comma, or type # to add hashtags
        </span>
        <span className="text-gray-400">
          {tags.length}/{maxTags}
        </span>
      </div>
    </div>
  );
} 