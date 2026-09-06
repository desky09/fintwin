import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CloudWatchFormProps {
  onSuccess?: (userData: { name: string; email: string; mode: 'signin' | 'signup' }) => void;
  defaultMode?: 'signin' | 'signup';
}

export default function CloudWatchForm({ onSuccess, defaultMode = 'signup' }: CloudWatchFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [name, setName] = useState("Souvik Chakraborty");
  const [email, setEmail] = useState("souvikchakraborty0918@gmail.com");
  const [username, setUsername] = useState("souvik_123");
  const [password, setPassword] = useState("souvik0918");
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  const fillSouvikCredentials = () => {
    setName("Souvik Chakraborty");
    setEmail("souvikchakraborty0918@gmail.com");
    setUsername("souvik_123");
    setPassword("souvik0918");
  };

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 40; // bigger range
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 20;
    setEyePos({ x: offsetX, y: offsetY });
  }, [cursor]);

  // Blinking every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccess) {
      onSuccess({
        name: name || "Souvik Chakraborty",
        email: email || "souvikchakraborty0918@gmail.com",
        mode
      });
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-[#121824]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-6 w-full max-w-md border border-slate-800">
        
        {/* Toggle Mode: Sign In vs Sign Up */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 w-full max-w-xs border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-[#EEFC57] text-[#0B0F17] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-[#EEFC57] text-[#0B0F17] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Cartoon Face */}
        <div className="relative w-70 h-40 rounded-2xl overflow-hidden shadow-inner bg-slate-900/80 flex items-center justify-center border border-slate-800">
          <img
            src="https://cdn.21st.dev/assets/mirror/2e/2e429af66b2ad5c13c11326bead739b6e7746470c7af7ac4fd7892d0190b4ab8.jpg"
            alt="cartoon"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {["left", "right"].map((side, idx) => (
            <div
              key={side}
              className="absolute flex justify-center items-end overflow-hidden shadow-sm"
              style={{
                top: 60,
                left: idx === 0 ? 80 : 150,
                width: 28,
                height: isTyping
                  ? 4 // fully closed when typing password
                  : blink
                  ? 6 // temporary blink
                  : 40, // open eye
                borderRadius: isTyping || blink ? "2px" : "50% / 60%",
                backgroundColor: isTyping ? "black" : "white", // black line when typing
                transition: "all 0.15s ease",
              }}
            >
              {!isTyping && (
                <div
                  className="bg-black"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    marginBottom: 4, // pupil at bottom
                    transform: `translate(${eyePos.x}px, 0px)`,
                    transition: "all 0.1s ease",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Header */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-black text-white tracking-tight">
            {mode === 'signup' ? 'Start Your Financial Digital Twin' : 'Welcome Back to FinTwin'}
          </h3>
          <p className="text-xs text-slate-400">
            {isTyping 
              ? '🙈 Shh! Cloud is covering eyes to protect your password privacy!'
              : '👀 Cloud watches cursor & safeguards your financial twin.'}
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-bold text-slate-300">Full Name</Label>
              <Input 
                placeholder="Souvik Chakraborty" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required={mode === 'signup'}
                className="bg-slate-900/90 border-slate-800 text-white text-xs font-medium focus:border-[#EEFC57]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label className="text-xs font-bold text-slate-300">Email Address</Label>
            <Input 
              type="email" 
              placeholder="souvikchakraborty0918@gmail.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="bg-slate-900/90 border-slate-800 text-white text-xs font-medium focus:border-[#EEFC57]"
            />
          </div>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-bold text-slate-300">Username</Label>
              <Input 
                placeholder="souvik_123" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="bg-slate-900/90 border-slate-800 text-white text-xs font-medium focus:border-[#EEFC57]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label className="text-xs font-bold text-slate-300">Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              required
              className="bg-slate-900/90 border-slate-800 text-white text-xs font-medium focus:border-[#EEFC57]"
            />
          </div>

          <Button 
            type="submit" 
            className="mt-2 w-full bg-[#EEFC57] hover:bg-[#EEFC57]/90 text-[#0B0F17] font-black text-sm py-2.5 rounded-xl shadow-lg transition-all"
          >
            {mode === 'signup' ? 'Create Digital Twin Account' : 'Sign In to FinTwin'}
          </Button>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            {mode === 'signup' ? (
              <>
                Already have a digital twin?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); fillSouvikCredentials(); }}
                  className="text-[#EEFC57] font-bold hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New to FinTwin?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); fillSouvikCredentials(); }}
                  className="text-[#EEFC57] font-bold hover:underline"
                >
                  Create an account
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
