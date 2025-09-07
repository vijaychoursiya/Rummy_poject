import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const deck = ["A♠", "K♠", "Q♠", "J♠", "10♠", "9♠", "8♠", "7♠", "6♠", "5♠", "4♠", "3♠", "2♠"];

export default function RummyGame() {
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [bet, setBet] = useState(0);

  const handleLogin = () => {
    const existingPlayer = players.find((p) => p.name === username);
    if (existingPlayer) {
      setCurrentUser(existingPlayer);
    } else {
      const newPlayer = { name: username, money: 1000 };
      setPlayers([...players, newPlayer]);
      setCurrentUser(newPlayer);
    }
    setUsername("");
  };

  const dealCards = () => {
    const hand = Array.from({ length: 7 }, () => deck[Math.floor(Math.random() * deck.length)]);
    setPlayerHand(hand);
  };

  const placeBet = (amount) => {
    if (!currentUser) return;
    if (amount > 0 && amount <= currentUser.money) {
      const updatedUser = { ...currentUser, money: currentUser.money - amount };
      setPlayers(players.map((p) => (p.name === currentUser.name ? updatedUser : p)));
      setCurrentUser(updatedUser);
      setBet(amount);
      dealCards();
    }
  };

  const winRound = () => {
    if (!currentUser) return;
    const winnings = bet * 2;
    const updatedUser = { ...currentUser, money: currentUser.money + winnings };
    setPlayers(players.map((p) => (p.name === currentUser.name ? updatedUser : p)));
    setCurrentUser(updatedUser);
    setBet(0);
    setPlayerHand([]);
  };

  const loseRound = () => {
    setBet(0);
    setPlayerHand([]);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col gap-4">
            <motion.h1 className="text-2xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Login</motion.h1>
            <Input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Button onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <motion.h1 className="text-4xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Rummy Game</motion.h1>
      <Card className="w-full max-w-md mb-4">
        <CardContent className="text-center">
          <p className="text-lg">Welcome, {currentUser.name}</p>
          <p className="text-lg">Balance: ₹{currentUser.money}</p>
          <div className="flex justify-center gap-2 mt-4">
            <Button onClick={() => placeBet(100)}>Bet ₹100</Button>
            <Button onClick={() => placeBet(200)}>Bet ₹200</Button>
            <Button onClick={() => placeBet(500)}>Bet ₹500</Button>
          </div>
          <div className="mt-4">
            <p className="text-lg">Current Bet: ₹{bet}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardContent className="text-center">
          <p className="font-semibold">Your Hand:</p>
          <div className="flex justify-center gap-2 flex-wrap mt-2">
            {playerHand.map((card, index) => (
              <motion.div key={index} className="p-2 border rounded bg-white shadow" whileHover={{ scale: 1.1 }}>
                {card}
              </motion.div>
            ))}
          </div>
          {bet > 0 && (
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="default" onClick={winRound}>Win</Button>
              <Button variant="destructive" onClick={loseRound}>Lose</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
