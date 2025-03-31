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
    }
  };

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Minimums in Parabolas</h1>
          <p className="text-sky-800">Learn about minimum points in quadratic functions!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          {/* Definition Box */}
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What is a Minimum Point?</h2>
            <p className="text-blue-600">
              The lowest point on a curve is called the "minimum" point. If the curve is a parabola that opens upwards, that point is called the vertex. You can find the minimum or vertex of a curve by identifying it on its graph, or by using the formula:
            </p>
            <div className="flex justify-center -mt-1 mb-3">
              <div className="text-blue-600 text-xl flex items-center justify-center">
                <span className="mr-2 -mt-1">x = </span>
                <div className="inline-block">
                  <div className="border-b border-blue-600">-b</div>
                  <div>2a</div>
                </div>
              </div>
            </div>
            <p className="text-blue-600">
              Practice identifying minimum points below!
            </p>
          </div>

          {/* Examples Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Example</h2>
            <div className="flex space-x-4 mb-4">
              <Button
                onClick={() => setViewType('formula')}
                className={`px-4 py-2 rounded ${
                  viewType === 'formula'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Formula
              </Button>
              <Button
                onClick={() => setViewType('graph')}
                className={`px-4 py-2 rounded ${
                  viewType === 'graph'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Graph
              </Button>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                {viewType === 'formula' && (
                  <div className="space-y-4 pt-4">
                    <p className="text-lg mb-6">Given: y = x² - 2x + 1</p>
                    <div>
                      <p className="font-medium">Step 1: Find x using x = -b/(2a)</p>
                      <div className="ml-8 flex items-center my-2">
                        <span className="mr-2">x = </span>
                        <div className="inline-block mx-1">
                          <div className="border-b border-black">-(-2)</div>
                          <div>2(1)</div>
                        </div>
                        <span className="mx-2">=</span>
                        <div className="inline-block mx-1">
                          <div className="border-b border-black">2</div>
                          <div>2</div>
                        </div>
                        <span className="mx-2">= 1</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Step 2: Find y by plugging x = 1 back into the equation</p>
                      <p className="ml-8">y = (1)² - 2(1) + 1 = 1 - 2 + 1 = 0</p>
                    </div>
                    <p className="font-bold text-green-600 mt-4">Minimum point: (1, 0)</p>
                  </div>
                )}

                {viewType === 'graph' && (
                  <div>
                    <p className="mb-4 mt-4">To find the minimum point on a graph, look for the lowest point on the curve. Follow these steps:</p>
                    <ul className="list-disc ml-6 mb-4">
                      <li>Look for where the curve stops going down and starts going up</li>
                      <li>Read across to the x-axis to find the x-coordinate</li>
                      <li>Read up/down to the y-axis to find the y-coordinate</li>
                    </ul>
                    <div className="w-full h-64 -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={exampleData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="x" 
                            domain={[-5, 5]}
                            type="number"
                            tickCount={11}
                          />
                          <YAxis 
                            domain={[-1, 9]}
                            tickCount={11}
                          />
                          <Tooltip labelFormatter={(label) => `x : ${label}`} />
                          <Line 
                            type="monotone" 
                            dataKey="y" 
                            stroke="#8884d8" 
                            dot={(props) => {
                              const isMinimum = props.payload.x === 1;
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
                          <ReferenceLine x={1} stroke="red" strokeDasharray="3 3" />
                          <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="font-bold text-green-600 mt-4">Minimum point: (1, 0)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Practice Section */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateNewPractice}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Parabola
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">
                f(x) = {currentA}x² {currentB >= 0 ? '+' : ''}{currentB}x {currentC >= 0 ? '+' : ''}{currentC}
              </p>
              <div className="w-full h-64 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={practiceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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

            <div className="space-y-4">
                <p className="text-gray-700 font-medium">Find the minimum point (x, y):</p>
                <div className="flex gap-4 justify-start">
                  <div>
                    <label className="block text-sm text-gray-600">x-coordinate</label>
                    {isXCorrect ? (
                      <p className="text-green-600 font-bold text-lg">{parseFloat(userAnswerX).toFixed(2)}</p>
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
                        className={`w-32 ${hasChecked && !isXCorrect ? 'border-red-500' : ''}`}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">y-coordinate</label>
                    {isYCorrect ? (
                      <p className="text-green-600 font-bold text-lg">{parseFloat(userAnswerY).toFixed(2)}</p>
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
                        className={`w-32 ${hasChecked && !isYCorrect ? 'border-red-500' : ''}`}
                      />
                    )}
                  </div>
                </div>
                {!isCompleted && (
                  <div className="flex gap-4 justify-start mt-4">
                    <Button 
                      onClick={checkAnswer}
                      className="bg-blue-400 hover:bg-blue-500"
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
                      className="bg-gray-400 hover:bg-gray-500"
                    >
                      Skip
                    </Button>
                  </div>
                )}
              </div>

            {isCompleted && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-bold text-lg mb-1">Great Job!</h3>
                <p className="text-green-700">
                  The minimum point is ({parseFloat(userAnswerX).toFixed(2)}, {parseFloat(userAnswerY).toFixed(2)}).
                  Try another parabola to practice more!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding minimums in parabolas is crucial for optimization problems in calculus!
      </p>
    </div>
  );
};

export default MinimumPoint;