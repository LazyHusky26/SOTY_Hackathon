import React, { useState } from 'react'
import ShinyText from './ShinyText'

function App() {
  const [fragments, setFragments] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [showPopupBox, setShowPopupBox] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        color: '#fff',
        backgroundImage: "url('/imgs/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        fontFamily: 'Inter, system-ui, Arial, sans-serif',
      }}
    >
      {/* Response page overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/imgs/RESPONSEPAGEBG.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: showOverlay ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          zIndex: 10,
        }}
      />
      <style>
        {`
          .reconInput::placeholder { color: rgba(217, 213, 200, 0.55); opacity: 1; }
          
          .loader-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 120px;
            width: auto;
            margin: 2rem;
            font-family: "Poppins", sans-serif;
            font-size: 1.6em;
            font-weight: 600;
            user-select: none;
            color: #fff;
            scale: 2;
          }
          
          .loader {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 1;
            background-color: transparent;
            mask: repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px);
          }
          
          .loader::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%),
              radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%),
              radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%),
              radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%),
              radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%);
            mask: radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%);
            animation: transform-animation 2s infinite alternate, opacity-animation 4s infinite;
            animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
          }
          
          @keyframes transform-animation {
            0% { transform: translate(-55%); }
            100% { transform: translate(55%); }
          }
          
          @keyframes opacity-animation {
            0%, 100% { opacity: 0; }
            15% { opacity: 1; }
            65% { opacity: 0; }
          }
          
          .loader-letter {
            display: inline-block;
            opacity: 0;
            animation: loader-letter-anim 4s infinite linear;
            z-index: 2;
          }
          
          .loader-letter:nth-child(1) { animation-delay: 0.1s; }
          .loader-letter:nth-child(2) { animation-delay: 0.205s; }
          .loader-letter:nth-child(3) { animation-delay: 0.31s; }
          .loader-letter:nth-child(4) { animation-delay: 0.415s; }
          .loader-letter:nth-child(5) { animation-delay: 0.521s; }
          .loader-letter:nth-child(6) { animation-delay: 0.626s; }
          .loader-letter:nth-child(7) { animation-delay: 0.731s; }
          .loader-letter:nth-child(8) { animation-delay: 0.837s; }
          .loader-letter:nth-child(9) { animation-delay: 0.942s; }
          .loader-letter:nth-child(10) { animation-delay: 1.047s; }
          .loader-letter:nth-child(11) { animation-delay: 1.152s; }
          .loader-letter:nth-child(12) { animation-delay: 1.257s; }
          .loader-letter:nth-child(13) { animation-delay: 1.362s; }
          
          @keyframes loader-letter-anim {
            0% { opacity: 0; }
            5% { opacity: 1; text-shadow: 0 0 4px #fff; transform: scale(1.1) translateY(-2px); }
            20% { opacity: 0.2; }
            100% { opacity: 0; }
          }
        `}
      </style>
      {/* Top-left blur overlay */}
      <img
        src={'/imgs/BLUR%20top%20left.png'}
        alt="Decorative blur"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '55vw',
          maxWidth: 600,
          height: 'auto',
          pointerEvents: 'none',
          opacity: isSubmitted ? 0 : 0.55,
          mixBlendMode: 'screen',
          filter: 'blur(1px)',
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
        }}
      />

      {/* Top-left logo */}
      <img
        src={'/imgs/text%20reconstructor.png'}
        alt="Text Reconstructor"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1000,
          pointerEvents: 'none',
          width: '48vw',
          maxWidth: 580,
          height: 'auto',
          opacity: isSubmitted ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
        }}
      />
      {/* Center hero/title composition ("RECONSTRUCT" + small labels) */}
      <img
        src={'/imgs/artifacts.png'}
        alt="Reconstruct title composition"
        style={{
          position: 'absolute',
          top: '22vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '74vw',
          maxWidth: 1100,
          height: 'auto',
          pointerEvents: 'none',
          opacity: isSubmitted ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
        }}
      />

      {/* "Enter the fragments:" label (shiny text) */}
      <div
        style={{
          position: 'absolute',
          top: '49vh',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          textAlign: 'center',
          opacity: isSubmitted ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
        }}
      >
        <ShinyText
          text="Enter the fragments:"
          disabled={false}
          speed={2.3}
          className="custom-class"
        />
      </div>

      {/* Textbox graphic */}
      <img
        src={'/imgs/textbox.png'}
        alt="Textbox backdrop"
        style={{
          position: 'absolute',
          top: '58vh',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '64vw',
          minWidth: 320,
          maxWidth: 1040,
          height: 'auto',
          pointerEvents: 'none',
          filter: 'brightness(0.92)',
          opacity: isSubmitted ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
        }}
      />

      {/* Textbox input overlay */}
      <div
        style={{
          position: 'absolute',
          top: '58vh',
          left: '50.5%',
          transform: 'translateX(-50%)',
          width: '64vw',
          minWidth: 320,
          maxWidth: 1040,
          height: '17.8vh',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '3.8vw',
          paddingRight: '8.2vw',
          boxSizing: 'border-box',
          background: 'transparent',
          borderRadius: '25px',
          border: 'none',
          opacity: isSubmitted ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          zIndex: 30,
        }}
      >
        <input
          value={fragments}
          onChange={(e) => setFragments(e.target.value)}
          placeholder="Analyze ts..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(217, 213, 200, 0.55)',
            fontSize: 'clamp(30px, 2.3vh, 22px)',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 200,
            caretColor: '#d9d5c8',
          }}
          aria-label="Enter the fragments"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="reconInput"
        />
        {/* Send button image at end of textbox */}
        <button
          type="button"
          aria-label="Send fragments"
          onClick={async () => {
            if (fragments.trim()) {
              console.log('Send clicked with fragments:', fragments)
              // Trigger both transitions simultaneously
              setShowOverlay(true)
              setIsSubmitted(true)
              setIsLoading(true)
              setError(null)
              setResults(null)

              // Show popup box near the end of transition
              setTimeout(() => {
                setShowPopupBox(true)
              }, 700)

              // Call the API
              try {
                const response = await fetch('http://localhost:5000/api/reconstruct', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ fragment: fragments }),
                })

                if (!response.ok) {
                  throw new Error('Failed to reconstruct fragment')
                }

                const data = await response.json()
                setResults(data)
                setIsLoading(false)
              } catch (err) {
                setError(err.message)
                setIsLoading(false)
              }
            }
          }}
          style={{
            position: 'absolute',
            right: '3.2vw',
            top: '60%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            lineHeight: 0,
            transition: 'transform 0.15s ease',
          }}
        >
          <img
            src={'/imgs/sendbox.png'}
            alt="Send"
            style={{ width: 120, height: 120, objectFit: 'contain', display: 'block' }}
          />
        </button>
      </div>

      {/* Bottom-right badge */}
      <img
        src={'/imgs/Powered%20by%20google%20gemini.png'}
        alt="Powered by Google Gemini"
        style={{
          position: 'absolute',
          right: '1.5vw',
          bottom: '1.2vh',
          width: '22vw',
          maxWidth: 280,
          height: 'auto',
          pointerEvents: 'none',
          opacity: isSubmitted ? 0 : 1,
          transition: 'opacity 1s ease-in-out',
          zIndex: 20,
        }}
      />

      {/* Popup Box */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${showPopupBox ? 1 : 0})`,
          width: '90vw',
          height: '90vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 100,
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <style>
          {`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e6ba0e;
              border-radius: 10px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #d4a50d;
            }
            
            /* Firefox scrollbar */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #e6ba0e rgba(255, 255, 255, 0.1);
            }
            
            /* 3D Cube Spinner */
            .spinner {
              width: 70.4px;
              height: 70.4px;
              --clr: rgb(230, 186, 14);
              --clr-alpha: rgba(247, 197, 159, 0.1);
              animation: spinner 1.6s infinite ease;
              transform-style: preserve-3d;
            }
            
            .spinner > div {
              background-color: var(--clr-alpha);
              height: 100%;
              position: absolute;
              width: 100%;
              border: 3.5px solid var(--clr);
            }
            
            .spinner div:nth-of-type(1) {
              transform: translateZ(-35.2px) rotateY(180deg);
            }
            
            .spinner div:nth-of-type(2) {
              transform: rotateY(-270deg) translateX(50%);
              transform-origin: top right;
            }
            
            .spinner div:nth-of-type(3) {
              transform: rotateY(270deg) translateX(-50%);
              transform-origin: center left;
            }
            
            .spinner div:nth-of-type(4) {
              transform: rotateX(90deg) translateY(-50%);
              transform-origin: top center;
            }
            
            .spinner div:nth-of-type(5) {
              transform: rotateX(-90deg) translateY(50%);
              transform-origin: bottom center;
            }
            
            .spinner div:nth-of-type(6) {
              transform: translateZ(35.2px);
            }
            
            @keyframes spinner {
              0% {
                transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
              }
              50% {
                transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
              }
              100% {
                transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
              }
            }
          `}
        </style>
        
        {showPopupBox && (
          <>
            {/* Back button - only show when results or error are displayed */}
            {(!isLoading && (results || error)) && (
              <button
                onClick={() => {
                  setShowPopupBox(false)
                  setShowOverlay(false)
                  setIsSubmitted(false)
                  setIsLoading(false)
                  setResults(null)
                  setError(null)
                  setFragments('')
                }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  backgroundColor: '#e6ba0e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  zIndex: 200,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#66490c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e6ba0e'}
              >
                Back
              </button>
            )}

            {/* PDF Download button - only show when results are displayed */}
            {(!isLoading && results) && (
              <button
                onClick={() => {
                  // Create text content for download
                  const content = `
RECONSTRUCTION REPORT

[Original Fragment]
> "${results.original}"

[AI-Reconstructed Text]
> "${results.reconstructed}"

[Contextual Sources]
${results.sources.map(source => `* ${source.link} (${source.description})`).join('\n')}
                  `.trim();

                  // Create a blob and download as text file
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'reconstruction-report.txt';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: '#e6ba0e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  zIndex: 200,
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d4a50d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e6ba0e'}
                title="Download Report"
              >
                <img 
                  src="/imgs/pdf.png" 
                  alt="Download Report" 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    pointerEvents: 'none'
                  }} 
                />
              </button>
            )}

            {isLoading && (
              <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}

            {!isLoading && error && (
              <div style={{
                color: '#ff6b6b',
                textAlign: 'center',
                padding: '2rem',
                fontSize: '1.2rem'
              }}>
                <h3>Error</h3>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && results && (
              <div 
                className="custom-scrollbar"
                style={{
                  color: '#fff',
                  padding: '4rem 2rem 2rem 2rem',
                  height: '100%',
                  overflowY: 'auto',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  fontFamily: 'monospace',
                  borderRadius: '20px',
                  boxSizing: 'border-box'
                }}
              >
                <h2 style={{
                  marginBottom: '1.5rem',
                  color: '#e6ba0e',
                  textAlign: 'center',
                  fontFamily: 'Archivo Black, Inter, system-ui, Arial, sans-serif',
                  fontSize: '2.5rem'
                }}>
                  RECONSTRUCTION REPORT
                </h2>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    color: '#e6ba0e',
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    [Original Fragment]
                  </h3>
                  <p style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: '4px solid #e6ba0e',
                    margin: '0.5rem 0',
                    fontSize: '1rem',
                    color: '#fff'
                  }}>
                    &gt; "{results.original}"
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{
                      color: '#e6ba0e',
                      margin: 0,
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      [AI-Reconstructed Text]
                    </h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(results.reconstructed)
                          .then(() => {
                            // Optional: Add visual feedback here
                            console.log('Text copied to clipboard')
                          })
                          .catch(err => {
                            console.error('Failed to copy text: ', err)
                          })
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(230, 186, 14, 0.1)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="Copy reconstructed text"
                    >
                      <img
                        src="/imgs/copy.png"
                        alt="Copy"
                        style={{
                          width: '20px',
                          height: '20px',
                          filter: 'brightness(0) saturate(100%) invert(77%) sepia(85%) saturate(1352%) hue-rotate(25deg) brightness(95%) contrast(95%)'
                        }}
                      />
                    </button>
                  </div>
                  <p style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    borderLeft: '4px solid #e6ba0e',
                    margin: '0.5rem 0',
                    fontSize: '1rem',
                    color: '#fff'
                  }}>
                    &gt; "{results.reconstructed}"
                  </p>
                </div>

                <div>
                  <h3 style={{
                    color: '#e6ba0e',
                    marginBottom: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    [Contextual Sources]
                  </h3>
                  {results.sources && results.sources.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {results.sources.map((source, index) => (
                        <li key={index} style={{
                          marginBottom: '1rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          padding: '1rem',
                          borderRadius: '8px',
                          borderLeft: '4px solid #e6ba0e'
                        }}>
                          <span style={{ color: '#e6ba0e', marginRight: '0.5rem' }}>*</span>
                          <a
                            href={source.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#fff',
                              textDecoration: 'none',
                              fontWeight: 'bold'
                            }}
                          >
                            {source.link}
                          </a>
                          <span style={{ color: '#fff' }}> ({source.description})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{
                      color: '#fff',
                      fontStyle: 'italic',
                      marginLeft: '1rem'
                    }}>
                      * No relevant sources found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
