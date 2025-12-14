import React, { useMemo } from 'react';

interface MathTextProps {
  text: string;
  className?: string;
  large?: boolean; // For main question text
}

export const MathText: React.FC<MathTextProps> = ({ text, className = "", large = false }) => {
  
  const parsedContent = useMemo(() => {
    if (!text) return null;

    // Split text by spaces to handle words vs math, but keep delimiters
    // We'll process the whole string with regex replacements for specific math patterns
    
    let processed = text;

    // 1. Symbol Replacements
    processed = processed.replace(/\*/g, '×');
    processed = processed.replace(/<=/g, '≤');
    processed = processed.replace(/>=/g, '≥');
    // Replace hyphen with minus sign if it looks like math (surrounded by spaces or numbers)
    processed = processed.replace(/(\d|\s)-(\d|\s)/g, '$1−$2'); 
    processed = processed.replace(/^-(\d)/g, '−$1'); // Negative number at start

    // 2. Tokenize for HTML structures (Fractions and Exponents)
    // We split by a regex that captures the complex parts
    const tokens = processed.split(/(\d+\/\d+|\w\^\d+|[xy]\b)/g);

    return tokens.map((token, index) => {
        // A. Fractions: "1/2" -> Vertical Fraction
        if (/^\d+\/\d+$/.test(token)) {
            const [num, den] = token.split('/');
            return (
                <span key={index} className="inline-flex flex-col items-center justify-center align-middle mx-0.5 leading-none" style={{ verticalAlign: '0.2em' }}>
                    <span className="text-[0.7em] border-b border-current px-0.5 pb-[1px] mb-[1px] block">{num}</span>
                    <span className="text-[0.7em] px-0.5 pt-[1px] block">{den}</span>
                </span>
            );
        }

        // B. Exponents: "x^2" or "10^5"
        if (/\^\d+$/.test(token)) {
            const [base, exp] = token.split('^');
            return (
                <span key={index}>
                    <i className="font-serif font-bold">{base}</i>
                    <sup className="text-[0.7em] ml-0.5">{exp}</sup>
                </span>
            );
        }

        // C. Variables: "x" or "y" (isolated) -> Italic serif
        if (/^[xy]$/.test(token)) {
            return <i key={index} className="font-serif font-bold mx-0.5">{token}</i>;
        }

        // D. Regular Text/Numbers
        return <span key={index}>{token}</span>;
    });

  }, [text]);

  return (
    <span className={`${className} ${large ? 'leading-loose' : ''}`}>
      {parsedContent}
    </span>
  );
};
