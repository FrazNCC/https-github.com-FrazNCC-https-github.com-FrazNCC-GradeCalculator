import React from 'react';
import { CalculationResult } from '../types';
import { Trophy, GraduationCap, TrendingUp, AlertCircle, Calculator } from 'lucide-react';

interface ResultsPanelProps {
  results: CalculationResult;
  variant?: 'default' | 'compact';
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, variant = 'default' }) => {
  // Chart Logic
  const pointsNeeded = results.nextGradeBoundary ? results.nextGradeBoundary.pointsNeeded : 0;
  const totalTarget = results.totalPoints + pointsNeeded;
  // Prevent division by zero if fresh state
  const percentage = totalTarget > 0 ? (results.totalPoints / totalTarget) * 100 : 0;
  
  // SVG Config
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // COMPACT VARIANT (For Header)
  if (variant === 'compact') {
      return (
          <div className="flex items-center space-x-6 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center border-r border-slate-200 pr-6">
                  <div className="text-right mr-3">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Grade</div>
                      <div className="text-2xl font-extrabold text-brand-600 leading-none">{results.grade}</div>
                  </div>
                  <Trophy className="w-5 h-5 text-brand-500 opacity-80" />
              </div>
              
              <div className="flex items-center space-x-6">
                  <div>
                       <div className="flex items-center text-[10px] text-slate-500 uppercase font-semibold mb-0.5">
                          <GraduationCap className="w-3 h-3 mr-1" /> UCAS
                       </div>
                       <div className="text-lg font-bold text-slate-700 leading-none">{results.ucasPoints}</div>
                  </div>

                  <div>
                       <div className="flex items-center text-[10px] text-slate-500 uppercase font-semibold mb-0.5">
                          <Calculator className="w-3 h-3 mr-1" /> Points
                       </div>
                       <div className="text-lg font-bold text-slate-700 leading-none">{results.totalPoints}</div>
                  </div>
              </div>

               {results.nextGradeBoundary && (
                  <div className="hidden xl:flex items-center text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 ml-4">
                      <AlertCircle className="w-3 h-3 mr-1.5" />
                      <span><strong>{results.nextGradeBoundary.pointsNeeded}</strong> to <strong>{results.nextGradeBoundary.grade}</strong></span>
                  </div>
              )}
          </div>
      );
  }

  // DEFAULT VARIANT (Card)
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-brand-500" />
        Projected Outcome
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Stats */}
        <div className="space-y-6">
          <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
            <div className="text-sm text-brand-600 mb-1 flex items-center">
                <Trophy className="w-4 h-4 mr-2" /> Projected Grade
            </div>
            <div className="text-4xl font-extrabold text-brand-700">
              {results.grade}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-500 mb-1 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" /> UCAS Points
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {results.ucasPoints}
            </div>
          </div>

          {results.nextGradeBoundary && (
             <div className="flex items-start bg-amber-50 p-3 rounded-md text-amber-700 text-sm border border-amber-100">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-amber-500" />
                <span>
                    You need <strong>{results.nextGradeBoundary.pointsNeeded}</strong> more points to reach <strong>{results.nextGradeBoundary.grade}</strong>.
                </span>
             </div>
          )}
        </div>

        {/* Right: Chart */}
        <div className="h-48 relative flex items-center justify-center">
           <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              {/* Background Circle */}
              <circle
                stroke="#f1f5f9" 
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress Circle */}
              <circle
                stroke="#0ea5e9"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total</div>
             <div className="text-2xl font-bold text-slate-800">{results.totalPoints}</div>
             <div className="text-[10px] text-slate-400">Points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;