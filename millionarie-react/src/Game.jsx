import { useEffect, useMemo, useRef, useState } from "react";

const QUESTION_TIME = 30;
const MONEY_PER_QUESTION = 1000;

const questions = [
  { q: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { q: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
  { q: "What is the largest planet in our solar system?", options: ["Earth", "Jupiter", "Mars", "Saturn"], answer: "Jupiter" },
  { q: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Fe", "Pb"], answer: "Au" },
  { q: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Claude Monet"], answer: "Leonardo da Vinci" },
  { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: "2" },
  { q: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: "Blue Whale" },
  { q: "Who is the author of '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Philip K. Dick"], answer: "George Orwell" },
  { q: "What is the currency of Japan?", options: ["Yen", "Dollar", "Euro", "Pound"], answer: "Yen" },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], answer: "Pacific Ocean" },
  { q: "Who discovered penicillin?", options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Isaac Newton"], answer: "Alexander Fleming" },
  { q: "What is the tallest mountain in the world?", options: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"], answer: "Mount Everest" },
  { q: "What is the chemical formula for water?", options: ["H2O", "CO2", "O2", "NaCl"], answer: "H2O" },
];

export default function Game() {
  // ====== SOUND (put mp3 in /public) ======
  const sfx = useRef(null);

  useEffect(() => {
    // create once (browser blocks autoplay until user clicks Start)
    sfx.current = {
      correct: new Audio("/correct.mp3"),
      win: new Audio("/win.mp3"),
      wrong: new Audio("/wrong.mp3"),
      timeout: new Audio("/wrong.mp3"),
      clock: new Audio("/clock.mp3"),
    };
    sfx.current.clock.loop = true;
    sfx.current.clock.volume = 0.35;
  }, []);

  const safePlay = (a) => {
    try {
      if (!a) return;
      a.currentTime = 0;
      a.play();
    } catch {}
  };

  const startClock = () => {
    try {
      const a = sfx.current?.clock;
      if (!a) return;
      a.currentTime = 0;
      a.play();
    } catch {}
  };

  const stopClock = () => {
    try {
      const a = sfx.current?.clock;
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    } catch {}
  };

  // ====== STATE ======
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [money, setMoney] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(QUESTION_TIME);

  // selected + status like vanilla UI
  const [selected, setSelected] = useState(null); // string
  const [status, setStatus] = useState(""); // message
  const [gameOver, setGameOver] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = useMemo(() => questions[currentIndex], [currentIndex]);

  const showNext = started && locked && !gameOver && !finished;

  // ====== TIMER (only when started & not locked & not over) ======
  useEffect(() => {
    if (!started) return;
    if (locked || gameOver || finished) return;

    startClock();
    setTimer(QUESTION_TIME);

    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          // time out
          clearInterval(id);
          stopClock();
          safePlay(sfx.current?.timeout);
          setMoney(0);
          setGameOver(true);
          setStatus("Time is up ⏳ You lost everything. Total: $0");
          setLocked(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
      stopClock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, currentIndex, locked, gameOver, finished]);

  // ====== ACTIONS ======
  function startGame() {
    // user click unlocks audio policies
    setStarted(true);
    setCurrentIndex(0);
    setMoney(0);
    setLocked(false);
    setSelected(null);
    setStatus("");
    setGameOver(false);
    setFinished(false);
    setTimer(QUESTION_TIME);
  }

  function chooseAnswer(option) {
    if (!started || locked || gameOver || finished) return;

    setSelected(option);
    setLocked(true);
    stopClock();

    const isCorrect = option === q.answer;

    if (isCorrect) {
      safePlay(sfx.current?.correct);
      setMoney((m) => m + MONEY_PER_QUESTION);
      setStatus(`Correct ✅ You won $${MONEY_PER_QUESTION}.`);
    } else {
      safePlay(sfx.current?.wrong);
      setMoney(0);
      setGameOver(true);
      setStatus("Wrong answer ❌ You lost everything. Total: $0");
    }
  }

  function nextQuestion() {
    if (!started) return;

    if (currentIndex >= questions.length - 1) {
      // finished game
      safePlay(sfx.current?.win);
      setFinished(true);
      setStatus((prev) => prev || `You finished the game! 🎉 Total: $${money}`);
      alert(`Congratulations! You finished the game with $${money}! 🎉`);
      return;
    }

    setCurrentIndex((i) => i + 1);
    setLocked(false);
    setSelected(null);
    setStatus("");
    setTimer(QUESTION_TIME);
  }

  function restart() {
    stopClock();
    setStarted(false); // show Start again (like vanilla)
    setCurrentIndex(0);
    setMoney(0);
    setLocked(false);
    setSelected(null);
    setStatus("");
    setGameOver(false);
    setFinished(false);
    setTimer(QUESTION_TIME);
  }

  // ====== UI HELPERS ======
  function getButtonClass(opt) {
    if (!locked) return "";
    if (opt === q.answer) return "correct";
    if (selected === opt && opt !== q.answer) return "wrong";
    return "dim";
  }

  return (
    <div className="game-container">
      <h1>Who Wants to Be a Millionaire - Game</h1>
      <p>Answer the questions correctly to win big!</p>

      {/* Start / Restart */}
      {!started ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <button onClick={restart} style={{ marginBottom: 12 }}>
          Restart
        </button>
      )}

      {/* Top bar */}
      {started && (
        <div className="top">
          <span>💰 ${money}</span>
          <span>⏱ {timer}s</span>
        </div>
      )}

      {/* Question */}
      {started && !finished && (
        <h2 style={{ marginTop: 10 }}>
          Q{currentIndex + 1}: {q.q}
        </h2>
      )}

      {/* Options */}
      {started && !finished && (
        <div className="options">
          {q.options.map((opt) => (
            <button
              key={opt}
              disabled={locked || gameOver || finished}
              className={getButtonClass(opt)}
              onClick={() => chooseAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Status */}
      {started && status && (
        <div style={{ marginTop: 12, fontWeight: 800 }}>{status}</div>
      )}

      {/* Next */}
      {showNext && (
        <button className="next" onClick={nextQuestion}>
          Next Question
        </button>
      )}

      {/* Finished message */}
      {started && finished && (
        <div style={{ marginTop: 12, fontWeight: 900 }}>
          You finished the game! 🎉 Total: ${money}
        </div>
      )}
    </div>
  );
}