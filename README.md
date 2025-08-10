# 🦸‍♂️ Marvel Tetris

<div align="center">
  <h3>⚡🤖🛡️🕷️💪</h3>
  <p><strong>A superhero-themed Tetris game featuring your favorite Marvel heroes!</strong></p>
  
  ![Game Status](https://img.shields.io/badge/Status-Complete-brightgreen)
  ![React](https://img.shields.io/badge/React-18+-blue)
  ![License](https://img.shields.io/badge/License-MIT-yellow)
  ![Responsive](https://img.shields.io/badge/Responsive-Yes-success)
</div>

## 🎮 About

Marvel Tetris brings the classic puzzle game to life with iconic Marvel superheroes! Each Tetris piece represents a different hero with unique symbols and colors. Assemble your favorite heroes while clearing lines in this action-packed, superhero-themed twist on the beloved classic.

### 🦸‍♂️ Featured Heroes

| Hero | Symbol | Special Shape | Color |
|------|--------|---------------|-------|
| **Thor** ⚡ | Lightning Bolt | T-Shape (Hammer) | Gold |
| **Iron Man** 🤖 | Robot Face | I-Shape (Suit) | Orange Red |
| **Captain America** 🛡️ | Shield | O-Shape (Shield) | Royal Blue |
| **Black Widow** 🕷️ | Spider | S-Shape (Web) | Hot Pink |
| **Hulk** 💪 | Flexed Bicep | Z-Shape (Smash) | Lime Green |

## ✨ Features

- 🎯 **Classic Tetris Gameplay** - All traditional mechanics included
- 🦸‍♂️ **Marvel Hero Pieces** - Each piece represents a different superhero
- 🎨 **Stunning Visual Design** - Animated borders, gradients, and effects
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⌨️ **Dual Control Support** - Keyboard arrows or on-screen buttons
- 🏆 **Score Tracking** - Progressive difficulty and scoring system
- 🔄 **Smooth Animations** - Falling pieces, line clearing, and visual feedback
- 🌙 **Dark Theme** - Sleek black background with colorful heroes

## 🎮 How to Play

### Controls
- **← →** Move pieces left/right
- **↑** Rotate piece clockwise
- **↓** Soft drop (faster fall)
- **Space** Hard drop (instant drop)

### Objective
1. **Assemble Heroes** - Control falling Marvel hero pieces
2. **Clear Lines** - Fill complete horizontal rows to clear them
3. **Score Points** - Earn points for cleared lines (more lines = higher multiplier)
4. **Survive** - Keep pieces from reaching the top of the board

### Scoring System
- **Single Line** - 100 points
- **Double Lines** - 200 points
- **Triple Lines** - 300 points
- **Tetris (4 Lines)** - 800 points
- **Speed Bonus** - Game speeds up as you progress

## 🚀 Installation & Setup

### Prerequisites
- Node.js (16+ recommended)
- npm or yarn package manager

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/marvel-tetris.git

# Navigate to project directory
cd marvel-tetris

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000 in your browser
```

### Build for Production
```bash
# Create production build
npm run build

# Serve production build locally (optional)
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
marvel-tetris/
├── src/
│   ├── components/
│   │   └── MarvelTetris.js      # Main game component
│   ├── styles/
│   │   └── index.css            # Enhanced CSS styling
│   ├── App.js                   # Root application component
│   └── index.js                 # Application entry point
├── public/
│   ├── index.html               # HTML template
│   └── favicon.ico              # App icon
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🛠️ Technical Details

### Built With
- **React 18+** - Modern React with hooks
- **CSS3** - Custom animations and responsive design
- **ES6+** - Modern JavaScript features

### Key Components
- **Game Logic** - Collision detection, line clearing, piece rotation
- **State Management** - React hooks for game state
- **Animation System** - CSS keyframes and transitions
- **Responsive Design** - Mobile-first approach

### Performance Features
- **Optimized Rendering** - Efficient grid updates
- **Memory Management** - Proper cleanup of intervals
- **Smooth 60fps** - Hardware-accelerated animations
- **Minimal Bundle** - No external game libraries

## 🎨 Customization

### Adding New Heroes
```javascript
// Add to HEROES array in MarvelTetris.js
const NEW_HERO = {
  name: "Spider-Man", 
  symbol: "🕸️", 
  color: "#FF0000",
  bg: "#4A0000"
};
```

### Modifying Game Settings
```javascript
// Adjust these constants in MarvelTetris.js
const WIDTH = 10;        // Board width
const HEIGHT = 20;       // Board height
const CELL_SIZE = 30;    // Cell size in pixels
```

### Custom Styling
- Edit `src/styles/index.css` for visual customizations
- Modify colors, animations, and layout
- All styles are vanilla CSS for easy customization

## 🐛 Known Issues & Solutions

### Common Issues
1. **Pieces not visible** - Ensure `index.css` is properly imported
2. **Controls not working** - Check for browser focus on the game area
3. **Performance lag** - Reduce animation complexity in CSS

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute
- 🐛 Report bugs and issues
- 💡 Suggest new features or heroes
- 🎨 Improve visual design
- 📚 Update documentation
- 🔧 Submit bug fixes

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Submit a Pull Request

