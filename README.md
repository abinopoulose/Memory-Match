# 🧠 Memory Match Game

A beautiful, modern browser-based memory match game built with HTML, CSS, and JavaScript. Test your memory skills by matching pairs of cards while enjoying smooth animations, sound effects, and a clean user interface.

## 🎮 Features

### Core Gameplay
- **Memory Match**: Find matching pairs of cards with fun emoji symbols
- **Scoring System**: Earn points for matches with time and move bonuses
- **Timer**: Track your completion time
- **Move Counter**: See how many moves you've made
- **Progressive Difficulty**: Cards are shuffled for each new game

### Visual & Audio
- **Smooth Animations**: Card flip animations, hover effects, and success celebrations
- **Sound Effects**: Audio feedback for card flips, matches, and theme changes
- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### User Experience
- **Local Leaderboard**: Save your best scores in browser local storage
- **Mobile-Friendly**: Touch gestures and responsive layout
- **Keyboard Shortcuts**: Quick access to game functions
- **Persistent Settings**: Theme preference and leaderboard are saved between sessions

## 🚀 How to Play

1. **Start the Game**: Click "New Game" or press `N` to begin
2. **Find Matches**: Click on cards to flip them and find matching pairs
3. **Complete the Board**: Match all 8 pairs to finish the game
4. **Save Your Score**: Enter your name to save your score to the leaderboard
5. **View Leaderboard**: Click the trophy icon or press `L` to see top scores

## 🎯 Scoring System

- **Base Score**: 100 points per match
- **Quick Match Bonus**: +50 points for efficient play
- **Time Bonus**: Up to 1000 points based on completion speed
- **Move Bonus**: Up to 500 points for fewer moves

## ⌨️ Controls

### Keyboard Shortcuts
- `N` - Start new game
- `L` - Show leaderboard
- `T` - Toggle dark/light theme
- `Enter` - Save score (in game over modal)

### Touch Gestures (Mobile)
- **Swipe Left** - Start new game
- **Swipe Right** - Show leaderboard
- **Tap Cards** - Flip cards to find matches

## 🎨 Customization

### Theme Toggle
- Click the moon/sun icon in the top-right corner
- Theme preference is automatically saved
- Smooth transition animations between themes

### Secret Mode
- Click the title 5 times quickly to activate secret mode
- All cards become the same symbol for an extra challenge!

## 📱 Mobile Support

The game is fully optimized for mobile devices:
- Touch-friendly card interactions
- Responsive grid layout (adapts to screen size)
- Swipe gestures for quick actions
- Optimized for both portrait and landscape orientations

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Web Audio API**: Dynamic sound generation
- **Local Storage**: Persistent leaderboard and settings

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Efficient card shuffling algorithm
- Optimized animations with CSS transforms
- Minimal DOM manipulation
- Responsive design with CSS Grid

## 🎵 Sound Effects

The game uses the Web Audio API to generate dynamic sound effects:
- **Card Flip**: 600Hz sine wave
- **Match Found**: 800Hz sine wave with longer duration
- **No Match**: 200Hz sawtooth wave
- **Theme Change**: 800Hz square wave
- **Success**: 1000Hz sine wave

## 📊 Leaderboard

The local leaderboard stores:
- Player name
- Final score
- Completion time
- Number of moves
- Date and time

Scores are sorted by:
1. Highest score first
2. Fastest time (for tied scores)
3. Top 10 scores are maintained

**Note**: Leaderboard data is stored locally in your browser and will persist between sessions. Clearing browser data will reset the leaderboard.

## 🔧 Getting Started

1. **Download**: Clone or download the project files
2. **Open**: Open `index.html` in your web browser
3. **Play**: Start playing immediately - no installation or server required!

### File Structure
```
memory-match-game/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # Game logic and functionality
└── README.md           # This file
```

## 🎉 Easter Eggs

- **Secret Mode**: Click the title 5 times quickly
- **Hidden Animations**: Hover over cards for subtle effects
- **Sound Variety**: Different sound types for different actions

## 🤝 Contributing

Feel free to enhance the game with:
- Additional card themes
- More difficulty levels
- Enhanced sound effects
- Additional animations
- Multiplayer features

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy playing Memory Match! 🎮✨** 