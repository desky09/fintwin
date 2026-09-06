import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/Card';
import { 
  Cpu, 
  Activity, 
  Wifi, 
  Radio, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';

export const ESP32MeterView: React.FC = () => {
  const { esp32State, cycleEsp32Screen, healthScore, userProfile, activeSimulation } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);

  const screens = [
    {
      title: 'SCREEN 0: OVERALL HEALTH',
      content: (
        <div className="space-y-1 text-center py-2">
          <div className="text-[11px] tracking-widest text-cyan-400">== FINTWIN IOT ==</div>
          <div className="text-xl font-bold tracking-wider text-cyan-200">
            SCORE: {healthScore.totalScore}/100
          </div>
          <div className="text-[10px] text-cyan-400 font-bold">
            [{healthScore.tier.toUpperCase()}]
          </div>
          <div className="text-[9px] text-cyan-600">PRESS BTN TO CYCLE</div>
        </div>
      )
    },
    {
      title: 'SCREEN 1: EMERGENCY BUFFER',
      content: (
        <div className="space-y-1 text-center py-2">
          <div className="text-[10px] tracking-widest text-cyan-400">EMERGENCY FUND</div>
          <div className="text-lg font-bold text-cyan-200">
            {healthScore.emergencyCoverageMonths} MONTHS
          </div>
          <div className="text-[10px] text-cyan-300">
            BUF: ₹{userProfile.currentSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-[9px] text-cyan-600">TARGET: 3-6 MO</div>
        </div>
      )
    },
    {
      title: 'SCREEN 2: SAVINGS & DTI',
      content: (
        <div className="space-y-1 text-center py-2">
          <div className="text-[10px] tracking-widest text-cyan-400">CASHFLOW STATS</div>
          <div className="text-xs font-bold text-cyan-200">
            SAVING RATE: {healthScore.savingsRatePercent}%
          </div>
          <div className="text-xs font-bold text-cyan-300">
            DTI RATIO: {healthScore.debtToIncomePercent}%
          </div>
          <div className="text-[9px] text-cyan-600">STATUS: ACTIVE</div>
        </div>
      )
    },
    {
      title: 'SCREEN 3: WHAT-IF RISK RADAR',
      content: (
        <div className="space-y-1 text-center py-2">
          <div className="text-[10px] tracking-widest text-cyan-400">WHAT-IF SIMULATION</div>
          <div className="text-xs font-bold text-cyan-200 truncate">
            {activeSimulation?.input.purchaseItem || 'Phone Purchase'}
          </div>
          <div className={`text-xs font-bold ${activeSimulation?.options.cashOption.riskLevel === 'critical' ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
            RISK: {activeSimulation?.options.cashOption.riskLevel.toUpperCase() || 'EVALUATED'}
          </div>
          <div className="text-[9px] text-cyan-600">LED REFLECTS RISK</div>
        </div>
      )
    }
  ];

  const currentScreen = screens[esp32State.screenIndex];

  const esp32InoCode = `/*
 * FinTwin — ESP32 Physical Financial Health Meter
 * Hardware: ESP32 DevKit V1 + SSD1306 0.96" OLED (I2C) + Common Cathode RGB LED + Push Button
 * Hackathon Embedded Firmware
 */

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Pin Definitions
#define PIN_BUTTON 15
#define PIN_LED_RED 25
#define PIN_LED_GREEN 26
#define PIN_LED_BLUE 27

// WiFi & FinTwin API config
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* fintwin_api_url = "https://fintwin.api/health-meter";

int currentScreen = 0;
int healthScore = 78;
float emergencyMonths = 3.5;
String riskStatus = "LOW";

void setRGB(int r, int g, int b) {
  analogWrite(PIN_LED_RED, r);
  analogWrite(PIN_LED_GREEN, g);
  analogWrite(PIN_LED_BLUE, b);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUTTON, INPUT_PULLUP);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_BLUE, OUTPUT);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(10, 20);
  display.println("FinTwin IoT Booting...");
  display.display();

  setRGB(0, 255, 0); // Default Green
}

void loop() {
  if (digitalRead(PIN_BUTTON) == LOW) {
    currentScreen = (currentScreen + 1) % 4;
    delay(200);
  }

  // Update RGB LED based on Risk / Health Score
  if (healthScore >= 75) {
    setRGB(0, 255, 0); // Green (Safe)
  } else if (healthScore >= 50) {
    setRGB(255, 180, 0); // Amber (Caution)
  } else {
    setRGB(255, 0, 0); // Red (Critical Alert)
  }

  renderScreen(currentScreen);
  delay(100);
}

void renderScreen(int screen) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("=== FINTWIN METER ===");
  if (screen == 0) {
    display.setCursor(0, 20);
    display.print("HEALTH SCORE: ");
    display.println(healthScore);
    display.setCursor(0, 40);
    display.print("STATUS: ");
    display.println(riskStatus);
  } else if (screen == 1) {
    display.setCursor(0, 20);
    display.print("EMERGENCY BUF: ");
    display.print(emergencyMonths, 1);
    display.println(" Mo");
  }
  display.display();
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(esp32InoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([esp32InoCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fintwin_esp32.ino';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-slide-up pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-fintwin-ink dark:text-white tracking-tight">
            ESP32 Physical Financial Health Meter (IoT Simulator)
          </h1>
          <Badge variant="mint" size="sm" icon={<Radio className="w-3 h-3" />}>
            Hardware Visualizer
          </Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Simulate the connected physical desk gadget featuring a 128x64 OLED display, tactile push button, and multi-color RGB LED reflecting live financial risk.
        </p>
      </div>

      {/* HARDWARE BENCHTOP SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Physical Device Mockup Card (7 cols) */}
        <Card className="p-8 lg:col-span-7 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-2 border-slate-800 shadow-2xl relative overflow-hidden rounded-3xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
            <span className="flex items-center gap-2 text-slate-400">
              <Cpu className="w-4 h-4 text-cyan-400" /> ESP32-WROOM-32D (80MHz)
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BLE SYNCED
            </span>
          </div>

          {/* Interactive Hardware Gadget Chassis */}
          <div className="my-8 p-6 rounded-3xl bg-slate-800/90 border-4 border-slate-700 shadow-inner max-w-sm w-full space-y-5">
            {/* Top RGB LED and Photoresistor */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div 
                  className={`w-5 h-5 rounded-full transition-all duration-300 shadow-lg ${
                    esp32State.ledColor === 'green' 
                      ? 'bg-emerald-400 shadow-glow-mint ring-4 ring-emerald-500/30' 
                      : esp32State.ledColor === 'amber' 
                        ? 'bg-amber-400 shadow-glow-amber ring-4 ring-amber-500/30' 
                        : 'bg-rose-500 shadow-glow-coral ring-4 ring-rose-500/30 animate-pulse'
                  }`} 
                />
                <span className="text-[10px] font-mono text-slate-300">
                  RGB: {esp32State.ledColor.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">SSD1306 128x64</span>
            </div>

            {/* Simulated 128x64 OLED Blue Monochrome Display */}
            <div className="oled-screen rounded-xl p-4 h-36 flex flex-col justify-center select-none border-2 border-slate-600">
              {currentScreen.content}
            </div>

            {/* Push Button Trigger */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-400">GPIO 15 Tactile Key</span>
              <button
                onClick={cycleEsp32Screen}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-300 font-mono text-xs font-bold shadow-md active:translate-y-0.5 active:bg-slate-800 transition-all border border-slate-600 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Press Switch (Screen {esp32State.screenIndex + 1}/4)
              </button>
            </div>
          </div>

          <div className="w-full text-center text-xs text-slate-400 font-mono">
            {currentScreen.title}
          </div>
        </Card>

        {/* Arduino Firmware Source Code Viewer (5 cols) */}
        <Card className="p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-fintwin-indigo" />
                <h3 className="font-extrabold text-sm text-fintwin-ink dark:text-white">
                  fintwin_esp32.ino Firmware
                </h3>
              </div>
              <Badge variant="indigo" size="sm">
                C++ / Arduino
              </Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Ready-to-flash Arduino firmware for your live hackathon physical hardware demonstration.
            </p>

            <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-y-auto max-h-72 border border-slate-800 shadow-inner">
              {esp32InoCode}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopy}
            >
              {copiedCode ? 'Copied to Clipboard!' : 'Copy C++ Code'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download .ino File
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
