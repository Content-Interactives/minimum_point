import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

const MinimumPoint = () => {
  // Generate points for a parabola: y = ax² + bx + c
  const generateParabolaPoints = (a, b, c, start = -5, end = 5, steps = 50) => {
    const points = [];
    
    // Calculate vertex
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    
    // Ensure vertex is within our domain
    const effectiveStart = Math.max(start, vertexX - 5);
    const effectiveEnd = Math.min(end, vertexX + 5);
    
    // Calculate points symmetrically around vertex
    const halfSteps = Math.floor(steps / 2);
    const stepSize = Math.min(
      (effectiveEnd - vertexX) / halfSteps,
      (vertexX - effectiveStart) / halfSteps
    );

    // Generate points to the left of vertex
    for (let i = halfSteps; i > 0; i--) {
      const x = vertexX - (i * stepSize);
      const y = a * x * x + b * x + c;
      points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    
    // Add vertex point
    points.push({
      x: parseFloat(vertexX.toFixed(2)),
      y: parseFloat(vertexY.toFixed(2))
    });
    
    // Generate points to the right of vertex
    for (let i = 1; i <= halfSteps; i++) {
      const x = vertexX + (i * stepSize);
      const y = a * x * x + b * x + c;
      points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    
    // Add extra points to fill the full domain if needed
    if (effectiveStart > start) {
      const x = start;
      const y = a * x * x + b * x + c;
      points.unshift({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    if (effectiveEnd < end) {
      const x = end;
      const y = a * x * x + b * x + c;
      points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
    
    return points;
  };

  // Example parabola: y = x² - 2x + 1 (minimum at x = 1, y = 0)
  const exampleData = generateParabolaPoints(1, -2, 1);
  const [viewType, setViewType] = useState('formula');
  
  // Practice state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [practiceData, setPracticeData] = useState(generateParabolaPoints(1, 0, 0));
  const [userAnswerX, setUserAnswerX] = useState('');
  const [userAnswerY, setUserAnswerY] = useState('');
  const [hasChecked, setHasChecked] = useState(false);
  const [isXCorrect, setIsXCorrect] = useState(false);
  const [isYCorrect, setIsYCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentA, setCurrentA] = useState(1);
  const [currentB, setCurrentB] = useState(0);
  const [currentC, setCurrentC] = useState(0);
  const [score, setScore] = useState(0);

  const generateNewPractice = () => {
    // Generate random coefficients
    const a = Math.floor(Math.random() * 4) + 1;  // 1 to 4
    const b = Math.floor(Math.random() * 4) + 1;  // 1 to 4
    const c = Math.floor(Math.random() * 9) + 1;  // 1 to 9
    
    setCurrentA(a);
    setCurrentB(b);
    setCurrentC(c);
    setPracticeData(generateParabolaPoints(a, b, c));
    setUserAnswerX('');
    setUserAnswerY('');
    setHasChecked(false);
    setIsXCorrect(false);
    setIsYCorrect(false);
    setIsCompleted(false);
  };

  const checkAnswer = () => {
    // For a parabola y = ax² + bx + c
    // Minimum occurs at x = -b/(2a)
    const expectedX = -currentB / (2 * currentA);
    const expectedY = currentA * expectedX * expectedX + currentB * expectedX + currentC;
    
    const xCorrect = Math.abs(parseFloat(userAnswerX) - expectedX) < 0.1;
    const yCorrect = Math.abs(parseFloat(userAnswerY) - expectedY) < 0.1;
    
    setHasChecked(true);
    setIsXCorrect(xCorrect);
    setIsYCorrect(yCorrect);
    
    if (xCorrect && yCorrect) {
      setIsCompleted(true);
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < 4) {
      setCurrentQuestion(currentQuestion + 1);
      generateNewPractice();
    } else {
      setCurrentQuestion(0);
      setScore(0);
      generateNewPractice();
    }
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: rgb(250, 245, 255);
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">Finding Minimum Points in Parabolas</h2>
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                generateNewPractice();
              }}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Practice Section */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Question {currentQuestion + 1}</h2>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`rounded-full transition-all duration-300 ${
                      num < currentQuestion || (num === currentQuestion && isCompleted) ? 'w-3 h-3 bg-[#008545]' : 
                      num === currentQuestion ? 'w-2 h-2 bg-[#5750E3] mt-0.5' : 
                      'w-3 h-3 bg-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="font-medium text-sm">Find the minimum point of the quadratic function:</p>
              <p className="mt-2 font-semibold text-sm">
                f(x) = {currentA}x² {currentB >= 0 ? '+' : ''}{currentB}x {currentC >= 0 ? '+' : ''}{currentC}
              </p>
              <div className="w-full h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={practiceData}
                    margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      domain={[-5, 5]}
                      type="number"
                      tickCount={11}
                    />
                    <YAxis 
                      domain={[-5, 15]}
                      tickCount={11}
                    />
                    <Tooltip labelFormatter={(label) => `x : ${label}`} />
                    <Line 
                      type="monotone" 
                      dataKey="y" 
                      stroke="#8884d8" 
                      dot={(props) => {
                        const x = -currentB / (2 * currentA);
                        const isMinimum = Math.abs(props.payload.x - x) < 0.1;
                        return isMinimum ? (
                          <circle 
                            cx={props.cx} 
                            cy={props.cy} 
                            r={12} 
                            fill="transparent" 
                            style={{ pointerEvents: 'all' }}
                          />
                        ) : null;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="space-y-4">
                <div className="flex gap-4 justify-start">
                  <div>
                    <label className="block text-sm text-gray-600">x-coordinate</label>
                    {isXCorrect ? (
                      <p className="text-[#008545] font-bold text-lg">{parseFloat(userAnswerX).toFixed(2)}</p>
                    ) : (
                      <Input
                        type="number"
                        step="0.1"
                        value={userAnswerX}
                        onChange={(e) => {
                          setUserAnswerX(e.target.value);
                          setHasChecked(false);
                          setIsXCorrect(false);
                        }}
                        placeholder="x"
                        className={`w-32 ${hasChecked && !isXCorrect ? 'border-yellow-500' : ''}`}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">y-coordinate</label>
                    {isYCorrect ? (
                      <p className="text-[#008545] font-bold text-lg">{parseFloat(userAnswerY).toFixed(2)}</p>
                    ) : (
                      <Input
                        type="number"
                        step="0.1"
                        value={userAnswerY}
                        onChange={(e) => {
                          setUserAnswerY(e.target.value);
                          setHasChecked(false);
                          setIsYCorrect(false);
                        }}
                        placeholder="y"
                        className={`w-32 ${hasChecked && !isYCorrect ? 'border-yellow-500' : ''}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              {!isCompleted && (
                <div className="glow-button simple-glow">
                  <div className="flex gap-2">
                    <Button
                      onClick={checkAnswer}
                      className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded"
                    >
                      Check
                    </Button>
                    <Button
                      onClick={() => {
                        const x = -currentB / (2 * currentA);
                        const y = currentA * x * x + currentB * x + currentC;
                        setUserAnswerX(x.toFixed(2));
                        setUserAnswerY(y.toFixed(2));
                        setIsXCorrect(true);
                        setIsYCorrect(true);
                        setIsCompleted(true);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}
              {isCompleted && (
                <div className="flex items-center gap-3">
                  <p className="text-[#008545] font-medium text-sm">Great Job!</p>
                  <div className="glow-button simple-glow">
                    <Button
                      onClick={nextQuestion}
                      className="bg-[#008545] hover:bg-[#00703d] text-white text-sm px-4 py-2 rounded"
                    >
                      {currentQuestion >= 4 ? "Start Over" : "Next Question"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MinimumPoint;