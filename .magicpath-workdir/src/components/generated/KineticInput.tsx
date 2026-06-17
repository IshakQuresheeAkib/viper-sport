import React, { useState, useRef, type CSSProperties, type ReactNode } from 'react';

type InputState = 'idle' | 'focused' | 'filled' | 'error' | 'disabled';

interface DemoField {
  label: string;
  placeholder: string;
  icon: ReactNode;
  state: InputState;
  value?: string;
  errorMsg?: string;
  type?: string;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6.93 6.93l.75-.75a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17v-.08z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function GlowDot({ active }: { active: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: active ? '#d3ed86' : '#45483a',
        boxShadow: active ? '0 0 8px rgba(211,237,134,0.7)' : 'none',
        transition: 'background 0.3s, box-shadow 0.3s',
      }}
    />
  );
}

function StaticField({
  label,
  placeholder,
  icon,
  state,
  value = '',
  errorMsg,
  type = 'text',
}: DemoField) {
  const isFocused = state === 'focused';
  const isError = state === 'error';
  const isDisabled = state === 'disabled';

  const wrapperStyle: CSSProperties = {
    background: 'rgba(50, 47, 48, 0.40)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: isError
      ? '1px solid #ffb4ab'
      : isFocused
      ? '1px solid #d3ed86'
      : '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    boxShadow: isFocused
      ? '0 0 0 3px rgba(211,237,134,0.15), 0 0 18px rgba(211,237,134,0.2)'
      : isError
      ? '0 0 0 3px rgba(255,180,171,0.12)'
      : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.25s ease',
    opacity: isDisabled ? 0.45 : 1,
    display: 'flex',
    alignItems: 'center',
    height: 52,
    padding: '0 14px',
    gap: 10,
  };

  const iconColor = isFocused ? '#d3ed86' : isError ? '#ffb4ab' : '#909281';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isError ? '#ffb4ab' : '#909281',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {label}
      </label>
      <div style={wrapperStyle}>
        <span style={{ color: iconColor, transition: 'color 0.2s', flexShrink: 0 }}>{icon}</span>
        <span
          style={{
            flex: 1,
            fontSize: 15,
            color: value ? '#e4e3d8' : 'rgba(206,196,194,0.4)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value || placeholder}
        </span>
        {type === 'password' && (
          <span style={{ color: '#909281', flexShrink: 0 }}>
            <EyeIcon open={false} />
          </span>
        )}
      </div>
      {isError && errorMsg && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#ffb4ab',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {errorMsg}
        </span>
      )}
    </div>
  );
}

function LivePasswordField() {
  const [showPw, setShowPw] = useState(false);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const wrapperStyle: CSSProperties = {
    background: 'rgba(50, 47, 48, 0.40)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: focused ? '1px solid #d3ed86' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    boxShadow: focused
      ? '0 0 0 3px rgba(211,237,134,0.15), 0 0 18px rgba(211,237,134,0.2)'
      : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    height: 52,
    padding: '0 4px 0 14px',
    gap: 10,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#909281',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Password
      </label>
      <div style={wrapperStyle}>
        <span style={{ color: focused ? '#d3ed86' : '#909281', transition: 'color 0.2s', flexShrink: 0 }}>
          <LockIcon />
        </span>
        <input
          ref={inputRef}
          type={showPw ? 'text' : 'password'}
          value={value}
          placeholder="Enter password"
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#e4e3d8',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#909281',
            padding: '0 10px',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#e4e3d8')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#909281')}
          aria-label={showPw ? 'Hide password' : 'Show password'}
        >
          <EyeIcon open={showPw} />
        </button>
      </div>
    </div>
  );
}

function LiveSearchField() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const wrapperStyle: CSSProperties = {
    background: 'rgba(50, 47, 48, 0.40)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: focused ? '1px solid #d3ed86' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8,
    boxShadow: focused
      ? '0 0 0 3px rgba(211,237,134,0.15), 0 0 18px rgba(211,237,134,0.2)'
      : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    height: 52,
    padding: '0 14px',
    gap: 10,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#909281',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        Search
      </label>
      <div style={wrapperStyle}>
        <span style={{ color: focused ? '#d3ed86' : '#909281', transition: 'color 0.2s', flexShrink: 0 }}>
          <SearchIcon />
        </span>
        <input
          type="search"
          value={value}
          placeholder="Search by phone, name or ID..."
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#e4e3d8',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        />
      </div>
    </div>
  );
}

export const KineticInput = () => {
  const [activeState, setActiveState] = useState<InputState>('idle');

  const stateLabels: { key: InputState; label: string }[] = [
    { key: 'idle', label: 'Idle' },
    { key: 'focused', label: 'Focus' },
    { key: 'filled', label: 'Filled' },
    { key: 'error', label: 'Error' },
    { key: 'disabled', label: 'Disabled' },
  ];

  const demoValue = activeState === 'filled' ? 'Fuad Abdul-Aziz' : '';
  const isFocused = activeState === 'focused';
  const isError = activeState === 'error';
  const isDisabled = activeState === 'disabled';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#13140d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#d3ed86',
              marginBottom: 8,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            ViperSport Design System
          </p>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#e4e3d8',
              margin: 0,
              lineHeight: 1.1,
              fontFamily: "'Anybody', sans-serif",
              textTransform: 'uppercase',
            }}
          >
            Kinetic Input
          </h1>
          <p style={{ color: '#909281', fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>
            Unified input component — glassmorphic, animated, fully accessible.
          </p>
        </div>

        {/* State Switcher */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 28,
            padding: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            width: 'fit-content',
          }}
        >
          {stateLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveState(key)}
              style={{
                padding: '6px 14px',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background:
                  activeState === key
                    ? key === 'error'
                      ? '#ffb4ab'
                      : '#d3ed86'
                    : 'transparent',
                color:
                  activeState === key
                    ? '#13140d'
                    : '#909281',
                transition: 'all 0.18s ease',
              }}
            >
              <GlowDot active={activeState === key} />
              {' '}
              {label}
            </button>
          ))}
        </div>

        {/* Demo Card */}
        <div
          style={{
            background: 'rgba(52, 53, 46, 0.30)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 14,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Accent top bar */}
          <div
            style={{
              position: 'absolute',
              left: 28,
              right: 28,
              top: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #d3ed86, transparent)',
              borderRadius: '0 0 4px 4px',
              opacity: 0.5,
            }}
          />

          <StaticField
            label="Full Name"
            placeholder="Enter your full name"
            icon={<UserIcon />}
            state={isFocused ? 'focused' : isError ? 'error' : isDisabled ? 'disabled' : 'idle'}
            value={demoValue}
            errorMsg="Name is required"
          />

          <StaticField
            label="Phone Number"
            placeholder="01XXXXXXXX"
            icon={<PhoneIcon />}
            state={isError ? 'error' : isDisabled ? 'disabled' : 'idle'}
            value={activeState === 'filled' ? '01712345678' : ''}
            errorMsg="Enter a valid BD phone number"
          />

          <LivePasswordField />
          <LiveSearchField />
        </div>

        {/* States Row — static snapshots */}
        <div style={{ marginTop: 8 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#45483a',
              marginBottom: 12,
            }}
          >
            All States at a Glance
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {stateLabels.map(({ key, label }) => (
              <div key={key}>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: key === 'error' ? '#ffb4ab' : key === 'focused' ? '#d3ed86' : '#45483a',
                    marginBottom: 6,
                  }}
                >
                  {label}
                </p>
                <StaticField
                  label="Email"
                  placeholder="you@example.com"
                  icon={<UserIcon />}
                  state={key}
                  value={key === 'filled' ? 'fuad@viper.io' : ''}
                  errorMsg="Invalid email address"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
