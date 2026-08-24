"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { CitizenProfile } from '../types/scheme';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceIntakeProps {
  onProfileParsed: (profile: Partial<CitizenProfile>) => void;
  speakLabel?: string;
  listeningLabel?: string;
}

export default function VoiceIntake({ onProfileParsed, speakLabel, listeningLabel }: VoiceIntakeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langCode, setLangCode] = useState('en-IN');
  const [langName, setLangName] = useState('Hindi');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        const initialLang = localStorage.getItem('preferredLang') || 'en-IN';
        recognitionRef.current.lang = initialLang;

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setError(`Error: ${event.error}`);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      } else {
        setError('Speech recognition not supported in this browser.');
      }
    }
  }, []);

  useEffect(() => {
    const updateLanguage = () => {
      const stored = localStorage.getItem('preferredLang') || 'en-IN';
      setLangCode(stored);
      
      const names: Record<string, string> = {
        'en-IN': 'English',
        'hi-IN': 'Hindi',
        'ta-IN': 'Tamil',
        'te-IN': 'Telugu',
        'mr-IN': 'Marathi',
        'bn-IN': 'Bengali'
      };
      setLangName(names[stored] || 'Hindi');
      
      if (recognitionRef.current) {
        recognitionRef.current.lang = stored;
      }
    };

    updateLanguage();
    window.addEventListener('languageChanged', updateLanguage);
    return () => window.removeEventListener('languageChanged', updateLanguage);
  }, []);

  useEffect(() => {
    if (!isRecording && transcript && transcript.length > 0) {
      handleParseTranscript(transcript);
    }
  }, [isRecording]);

  const handleParseTranscript = async (text: string) => {
    setIsParsing(true);
    try {
      const response = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, lang: langCode }),
      });
      const data = await response.json();
      if (data.success && data.profile) {
        onProfileParsed(data.profile);
      } else if (data.error === 'PARSE_VALIDATION_FAILED') {
        setError(data.message || "Couldn't understand that clearly. Please fill the form manually instead.");
      } else if (response.status === 429) {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError(data.error || 'Failed to parse — please fill the form manually instead.');
      }
    } catch (err) {
      setError('Network error while parsing');
    } finally {
      setIsParsing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getExampleText = (code: string) => {
    switch (code) {
      case 'bn-IN': return 'যেমন: "আমি মধ্যপ্রদেশের একজন কৃষক, আমার বয়স ৩০ বছর"';
      case 'mr-IN': return 'उदा: "मी मध्य प्रदेशातील एक शेतकरी आहे, माझे वय ३० वर्षे आहे"';
      case 'ta-IN': return 'உ-ம்: "நான் மத்திய பிரதேசத்தை சேர்ந்த ஒரு விவசாயி, எனக்கு 30 வயது"';
      case 'te-IN': return 'ఉదా: "నేను మధ్యప్రదేశ్‌కి చెందిన రైతుని, నా వయసు 30 ఏళ్లు"';
      case 'en-IN': return 'e.g. "I am a farmer from Madhya Pradesh, my age is 30 years"';
      case 'hi-IN':
      default:
        return 'e.g. "मैं मध्य प्रदेश का किसान हूँ, मेरी उम्र ३० साल है"';
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-xl border border-[#e2dfd2] relative shadow-sm w-full">
      <div className="absolute top-4 left-4">
        <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
          {langName}
        </span>
      </div>

      <button
        onClick={toggleRecording}
        className={`p-6 rounded-full transition-all duration-300 mt-4 focus:outline-2 focus:outline-offset-2 focus:outline-blue-800 ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-md'
        }`}
      >
        {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
      </button>
      
      <div className="mt-5 text-center">
        <h3 className="font-bold text-gray-800 text-lg">
          {isRecording ? `${listeningLabel || 'Listening in'} ${langName}...` : (speakLabel || 'Speak your profile details')}
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
          {getExampleText(langCode)}
        </p>
      </div>

      {transcript && (
        <div className="mt-6 p-4 bg-[#fcfbf7] rounded-lg w-full max-w-md border border-[#e2dfd2] shadow-inner">
          <p className="text-gray-700 italic font-medium leading-relaxed text-center">"{transcript}"</p>
        </div>
      )}

      {isParsing && (
        <div className="mt-5 flex items-center text-blue-600 font-bold bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100">
          <Loader2 className="animate-spin mr-2" size={18} />
          <span className="text-sm">Processing profile...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
