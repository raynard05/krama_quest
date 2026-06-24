import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, ViewStyle } from 'react-native';
import Svg, { Line, Path, Circle, Defs, LinearGradient } from 'react-native-svg';
import { 
  BOARD_ROWS, 
  BOARD_COLS, 
  TOTAL_CELLS,
  SNAKES, 
  LADDERS, 
  getGridPosition, 
  getPercentPosition,
  PercentPosition
} from '../../constants';
import { Player } from '../../types';

interface BoardProps {
  players: Player[];
}

// Helper to calculate offset coordinate when multiple players land on the same cell
function getPlayerOffsetPosition(cell: number, playerId: number, players: Player[]): PercentPosition {
  const basePos = getPercentPosition(cell);
  
  if (cell === 0) {
    // Starting area (before cell 1) - aligned neatly below the board
    const playersAtStart = players.filter(p => p.position === 0);
    const index = playersAtStart.findIndex(p => p.id === playerId);
    if (index === -1) return basePos;
    
    const count = playersAtStart.length;
    const spacing = 6; // % spacing
    const startX = 50 - ((count - 1) * spacing) / 2;
    return {
      x: startX + index * spacing,
      y: 95, // near the bottom edge
    };
  }

  // Find all players currently on this cell
  const playersAtCell = players.filter(p => p.position === cell);
  const index = playersAtCell.findIndex(p => p.id === playerId);
  if (index <= 0 || playersAtCell.length <= 1) {
    return basePos; // single player is centered
  }

  const count = playersAtCell.length;
  // Offset dimensions (board is 10 cols x 5 rows, so each cell is 10% x 20%)
  const offsetDistanceX = 2.2; 
  const offsetDistanceY = 4.5;

  if (count === 2) {
    return {
      x: basePos.x + (index === 0 ? -offsetDistanceX : offsetDistanceX),
      y: basePos.y + (index === 0 ? -offsetDistanceY : offsetDistanceY),
    };
  } else if (count === 3) {
    if (index === 0) return { x: basePos.x - offsetDistanceX, y: basePos.y + offsetDistanceY };
    if (index === 1) return { x: basePos.x + offsetDistanceX, y: basePos.y + offsetDistanceY };
    return { x: basePos.x, y: basePos.y - offsetDistanceY };
  } else {
    // 4 players
    if (index === 0) return { x: basePos.x - offsetDistanceX, y: basePos.y - offsetDistanceY };
    if (index === 1) return { x: basePos.x + offsetDistanceX, y: basePos.y - offsetDistanceY };
    if (index === 2) return { x: basePos.x - offsetDistanceX, y: basePos.y + offsetDistanceY };
    return { x: basePos.x + offsetDistanceX, y: basePos.y + offsetDistanceY };
  }
}

// Individual animated token component
function Token({ player, players }: { player: Player; players: Player[] }) {
  const targetPos = getPlayerOffsetPosition(player.position, player.id, players);
  
  // Keep track of animated X and Y positions
  const animX = useRef(new Animated.Value(targetPos.x)).current;
  const animY = useRef(new Animated.Value(targetPos.y)).current;

  useEffect(() => {
    // Smooth transition from previous location to the new coordinates
    Animated.parallel([
      Animated.spring(animX, {
        toValue: targetPos.x,
        friction: 6,
        tension: 40,
        useNativeDriver: false, // Layout animations on styles need false
      }),
      Animated.spring(animY, {
        toValue: targetPos.y,
        friction: 6,
        tension: 40,
        useNativeDriver: false,
      }),
    ]).start();
  }, [targetPos.x, targetPos.y]);

  return (
    <Animated.View
      style={[
        styles.token,
        {
          left: animX.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          top: animY.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
          backgroundColor: player.color,
          shadowColor: player.color,
        },
      ]}
    >
      <Text style={styles.tokenIcon}>{player.icon}</Text>
    </Animated.View>
  );
}

export default function Board({ players }: BoardProps) {
  // Generate all grid cells
  const renderCells = () => {
    const cells = [];
    
    // Render row 4 (top) down to row 0 (bottom)
    for (let r = BOARD_ROWS - 1; r >= 0; r--) {
      for (let c = 0; c < BOARD_COLS; c++) {
        // Calculate cell number based on boustrophedon (snake-like) pattern
        let cellNum: number;
        if (r % 2 === 0) {
          // Even row (0, 2, 4): Left to Right
          cellNum = r * BOARD_COLS + c + 1;
        } else {
          // Odd row (1, 3): Right to Left
          cellNum = r * BOARD_COLS + (BOARD_COLS - 1 - c) + 1;
        }

        const isEvenIndex = (r + c) % 2 === 0;
        const cellStyle = [
          styles.cell,
          isEvenIndex ? styles.cellEven : styles.cellOdd,
          cellNum === 1 && styles.cellStart,
          cellNum === TOTAL_CELLS && styles.cellFinish,
        ] as ViewStyle[];

        cells.push(
          <View key={`cell-${cellNum}`} style={cellStyle}>
            <Text style={styles.cellNumber}>{cellNum}</Text>
            
            {cellNum === 1 && <Text style={styles.cellLabel}>START</Text>}
            {cellNum === TOTAL_CELLS && <Text style={styles.cellLabel}>FINISH</Text>}
          </View>
        );
      }
    }
    return cells;
  };

  // Render SVG elements for ladders
  const renderLadders = () => {
    return Object.entries(LADDERS).map(([startStr, endStr]) => {
      const start = parseInt(startStr);
      const end = endStr;
      
      const p1 = getPercentPosition(start);
      const p2 = getPercentPosition(end);

      // Math to find parallel rails of the ladder
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      // Normalized normal vector
      const nx = -dy / len;
      const ny = dx / len;
      
      // Rail offset width (in percentage units)
      const offset = 1.3;
      
      // Rail 1
      const r1x1 = p1.x + nx * offset;
      const r1y1 = p1.y + ny * offset;
      const r1x2 = p2.x + nx * offset;
      const r1y2 = p2.y + ny * offset;

      // Rail 2
      const r2x1 = p1.x - nx * offset;
      const r2y1 = p1.y - ny * offset;
      const r2x2 = p2.x - nx * offset;
      const r2y2 = p2.y - ny * offset;

      // Generate rungs (horizontal bars)
      const rungs = [];
      const rungCount = Math.max(3, Math.floor(len / 6));
      for (let i = 1; i < rungCount; i++) {
        const t = i / rungCount;
        const cx = p1.x + t * dx;
        const cy = p1.y + t * dy;
        
        rungs.push(
          <Line
            key={`rung-${start}-${end}-${i}`}
            x1={cx + nx * offset}
            y1={cy + ny * offset}
            x2={cx - nx * offset}
            y2={cy - ny * offset}
            stroke="#00F2FE"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            opacity={0.8}
          />
        );
      }

      return (
        <React.Fragment key={`ladder-${start}-${end}`}>
          {/* Neon Glow Underlay */}
          <Line
            x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2}
            stroke="#00F2FE" strokeWidth={6} opacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
          <Line
            x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2}
            stroke="#00F2FE" strokeWidth={6} opacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
          {/* Main Rails */}
          <Line
            x1={r1x1} y1={r1y1} x2={r1x2} y2={r1y2}
            stroke="#00F2FE" strokeWidth={3}
            vectorEffect="non-scaling-stroke"
          />
          <Line
            x1={r2x1} y1={r2y1} x2={r2x2} y2={r2y2}
            stroke="#00F2FE" strokeWidth={3}
            vectorEffect="non-scaling-stroke"
          />
          {/* Rungs */}
          {rungs}
        </React.Fragment>
      );
    });
  };

  // Render SVG elements for snakes (bezier curves)
  const renderSnakes = () => {
    return Object.entries(SNAKES).map(([headStr, tailStr]) => {
      const head = parseInt(headStr);
      const tail = tailStr;
      
      const pHead = getPercentPosition(head);
      const pTail = getPercentPosition(tail);

      // Midpoint
      const mx = (pHead.x + pTail.x) / 2;
      const my = (pHead.y + pTail.y) / 2;
      
      // Vector
      const dx = pTail.x - pHead.x;
      const dy = pTail.y - pHead.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      // Control point offset perpendicular to create snake curve
      const nx = -dy / len;
      const ny = dx / len;
      
      // Control points for bezier curve (wavy snake)
      // We offset the midpoint to make a curvy path
      const offset = 8; // percentage offset
      const cpx = mx + nx * offset;
      const cpy = my + ny * offset;

      const pathData = `M ${pHead.x} ${pHead.y} Q ${cpx} ${cpy} ${pTail.x} ${pTail.y}`;

      return (
        <React.Fragment key={`snake-${head}-${tail}`}>
          {/* Glow background */}
          <Path
            d={pathData}
            fill="none"
            stroke="#FF3366"
            strokeWidth={8}
            opacity={0.25}
            vectorEffect="non-scaling-stroke"
          />
          {/* Main snake body */}
          <Path
            d={pathData}
            fill="none"
            stroke="#FF3366"
            strokeWidth={3.5}
            strokeDasharray="4,2"
            vectorEffect="non-scaling-stroke"
          />
        </React.Fragment>
      );
    });
  };

  return (
    <View style={styles.boardWrapper}>
      {/* 2:1 Aspect Ratio Game Board */}
      <View style={styles.boardContainer}>
        {/* Cell Grid */}
        <View style={styles.grid}>{renderCells()}</View>

        {/* SVG overlay for snakes and ladders */}
        <Svg 
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {renderLadders()}
          {renderSnakes()}
        </Svg>

        {/* Emojis at head of snakes */}
        {Object.keys(SNAKES).map((headStr) => {
          const head = parseInt(headStr);
          const pos = getPercentPosition(head);
          return (
            <Text
              key={`snake-emoji-${head}`}
              style={[styles.snakeHeadEmoji, { left: `${pos.x - 2}%`, top: `${pos.y - 4.5}%` }]}
            >
              👿
            </Text>
          );
        })}

        {/* Animated Tokens */}
        {players.map((player) => (
          <Token key={`token-${player.id}`} player={player} players={players} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  boardContainer: {
    width: '100%',
    aspectRatio: 2, // 10 columns by 5 rows is exactly 2:1 aspect ratio
    backgroundColor: '#0F0F1A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3F3F5F',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '10%', // 10 columns
    height: '20%', // 5 rows
    borderWidth: 0.5,
    borderColor: 'rgba(63, 63, 95, 0.25)',
    justifyContent: 'space-between',
    padding: 3,
  },
  cellEven: {
    backgroundColor: '#161626',
  },
  cellOdd: {
    backgroundColor: '#1B1B2F',
  },
  cellStart: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderColor: '#00F2FE',
    borderWidth: 1.5,
  },
  cellFinish: {
    backgroundColor: 'rgba(255, 222, 67, 0.15)',
    borderColor: '#FFDE43',
    borderWidth: 1.5,
  },
  cellNumber: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.45)',
  },
  cellLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    opacity: 0.9,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  snakeHeadEmoji: {
    position: 'absolute',
    fontSize: 13,
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  token: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    marginLeft: -11, // half of width to center
    marginTop: -11, // half of height to center
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  tokenIcon: {
    fontSize: 10,
    color: '#FFF',
  },
});
