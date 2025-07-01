import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

// Utility functions for localStorage
const saveGameData = (data: any) => {
  localStorage.setItem("rubleClickerGame", JSON.stringify(data));
};

const loadGameData = () => {
  const saved = localStorage.getItem("rubleClickerGame");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load game data:", e);
    }
  }
  return null;
};

const RubleClicker = () => {
  // Initialize state with saved data
  const savedData = loadGameData();

  const [clicks, setClicks] = useState(savedData?.clicks || 0);
  const [rubles, setRubles] = useState(savedData?.rubles || 0);
  const [autoLevel, setAutoLevel] = useState(savedData?.autoLevel || 0);
  const [rubPerClick, setRubPerClick] = useState(savedData?.rubPerClick || 1);
  const [x2Active, setX2Active] = useState(false);
  const [goldenBorder, setGoldenBorder] = useState(
    savedData?.goldenBorder || false,
  );
  const [vibroActive, setVibroActive] = useState(
    savedData?.vibroActive || false,
  );
  const [rubIconPosition, setRubIconPosition] = useState({ x: 50, y: 50 });

  const autoClickData = [
    { cost: 10, cps: 5, name: "Базовый" },
    { cost: 50, cps: 15, name: "Продвинутый" },
    { cost: 100, cps: 35, name: "Профи" },
    { cost: 500, cps: 50, name: "Эксперт" },
    { cost: 1000, cps: 75, name: "Мастер" },
  ];

  const moveRubIcon = useCallback(() => {
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    setRubIconPosition({ x, y });
  }, []);

  const handleClick = () => {
    const gain = rubPerClick * (x2Active ? 2 : 1);
    setClicks((prev) => prev + gain);

    if (vibroActive) {
      document.body.style.transform = "scale(1.02)";
      setTimeout(() => {
        document.body.style.transform = "scale(1)";
      }, 100);
    }

    moveRubIcon();
  };

  useEffect(() => {
    setRubles(Math.floor(clicks / 10));
  }, [clicks]);

  useEffect(() => {
    if (autoLevel > 0) {
      const interval = setInterval(() => {
        const upgrade = autoClickData[autoLevel - 1];
        if (upgrade) {
          setClicks((prev) => prev + upgrade.cps);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoLevel]);

  // Auto-save game data
  useEffect(() => {
    const gameData = {
      clicks,
      rubles,
      autoLevel,
      rubPerClick,
      goldenBorder,
      vibroActive,
    };
    saveGameData(gameData);
  }, [clicks, rubles, autoLevel, rubPerClick, goldenBorder, vibroActive]);

  const buyAutoClicker = () => {
    if (autoLevel >= autoClickData.length) {
      alert("Максимальный уровень автокликера!");
      return;
    }
    const upgrade = autoClickData[autoLevel];
    if (clicks >= upgrade.cost) {
      setClicks((prev) => prev - upgrade.cost);
      setAutoLevel((prev) => prev + 1);
    } else {
      alert("Не хватает кликов!");
    }
  };

  const buyX2 = () => {
    if (rubles < 300) {
      alert("Не хватает рублей!");
      return;
    }
    setRubles((prev) => prev - 300);
    setX2Active(true);
    setTimeout(() => setX2Active(false), 30000);
  };

  const buyClickBoost = () => {
    if (rubles < 200) {
      alert("Не хватает рублей!");
      return;
    }
    setRubles((prev) => prev - 200);
    setRubPerClick((prev) => prev + 1);
  };

  const buyGoldBorder = () => {
    if (rubles < 500 || goldenBorder) {
      alert("Не хватает рублей или уже куплено!");
      return;
    }
    setRubles((prev) => prev - 500);
    setGoldenBorder(true);
  };

  const buyVibro = () => {
    if (rubles < 150 || vibroActive) {
      alert("Не хватает рублей или уже включено!");
      return;
    }
    setRubles((prev) => prev - 150);
    setVibroActive(true);
  };

  return (
    <div
      className={`min-h-screen bg-black text-cyan-400 font-mono transition-all duration-300 ${goldenBorder ? "shadow-[inset_0_0_60px_gold]" : ""}`}
    >
      {/* Floating Ruble Icon */}
      <div
        className="fixed text-6xl pointer-events-none transition-all duration-200 z-10"
        style={{
          left: `${rubIconPosition.x}%`,
          top: `${rubIconPosition.y}%`,
          textShadow: "0 0 20px #00ffff",
        }}
      >
        ₽
      </div>

      <div className="container mx-auto px-4 py-8 text-center">
        {/* Header Stats */}
        <div className="mb-8">
          <h1
            className="text-5xl font-bold text-green-400 mb-4"
            style={{ textShadow: "0 0 20px #00ff00" }}
          >
            💰 Рублей <span className="text-yellow-400">{rubles}</span>
          </h1>
          <h2
            className="text-3xl font-bold mb-6"
            style={{ textShadow: "0 0 15px #00ffff" }}
          >
            👆 Кликов <span className="text-cyan-300">{clicks}</span>
          </h2>
        </div>

        {/* Main Click Button */}
        <Button
          onClick={handleClick}
          className="text-3xl px-12 py-8 mb-8 bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_30px_#00ffff] hover:shadow-[0_0_50px_#00ffff]"
          style={{ borderRadius: "15px" }}
        >
          {x2Active && <span className="mr-2 text-yellow-400">2X</span>}
          КЛИК ₽
        </Button>

        {/* Card with Bank Icon */}
        <div className="mb-12">
          <div
            className="inline-block text-6xl cursor-pointer transition-transform hover:scale-110"
            onClick={() => alert("Показать карту 💳")}
          >
            💳
          </div>
        </div>

        {/* Upgrades Section */}
        <Card className="max-w-4xl mx-auto bg-gray-900 border-2 border-cyan-400 shadow-[0_0_30px_#00ffff] p-6">
          <h2
            className="text-2xl font-bold text-green-400 mb-6"
            style={{ textShadow: "0 0 15px #00ff00" }}
          >
            Апгрейды
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auto Clicker */}
            <Button
              onClick={buyAutoClicker}
              disabled={autoLevel >= autoClickData.length}
              className="bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black p-4 h-auto shadow-[0_0_15px_#00ffff]"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Settings" size={20} />
                  <span>Автокликер (ур. {autoLevel})</span>
                </div>
                {autoLevel < autoClickData.length && (
                  <div className="text-sm opacity-80">
                    Стоимость: {autoClickData[autoLevel].cost} кликов
                  </div>
                )}
              </div>
            </Button>

            {/* X2 Boost */}
            <Button
              onClick={buyX2}
              disabled={x2Active}
              className="bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black p-4 h-auto shadow-[0_0_15px_#00ffff]"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Zap" size={20} />
                  <span>X2 клики (30 сек)</span>
                </div>
                <div className="text-sm opacity-80">300₽</div>
              </div>
            </Button>

            {/* Click Boost */}
            <Button
              onClick={buyClickBoost}
              className="bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black p-4 h-auto shadow-[0_0_15px_#00ffff]"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="TrendingUp" size={20} />
                  <span>+₽ за клик</span>
                </div>
                <div className="text-sm opacity-80">
                  200₽ | Текущий: {rubPerClick}
                </div>
              </div>
            </Button>

            {/* Golden Border */}
            <Button
              onClick={buyGoldBorder}
              disabled={goldenBorder}
              className="bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black p-4 h-auto shadow-[0_0_15px_#00ffff]"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Crown" size={20} />
                  <span>Золотая рамка</span>
                </div>
                <div className="text-sm opacity-80">500₽</div>
              </div>
            </Button>

            {/* Vibro Click */}
            <Button
              onClick={buyVibro}
              disabled={vibroActive}
              className="bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black p-4 h-auto shadow-[0_0_15px_#00ffff] md:col-span-2"
            >
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Waves" size={20} />
                  <span>Вибро-Клик</span>
                </div>
                <div className="text-sm opacity-80">150₽</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RubleClicker;
