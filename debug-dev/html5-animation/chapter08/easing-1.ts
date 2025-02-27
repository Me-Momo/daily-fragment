import createCavans from '../base/createCanvas';
import Ball from '../classes/ball';
import easingMove from '../base/actions/easing';

export function run() {
  const canvas = createCavans();
  const context: CanvasRenderingContext2D = canvas.getContext('2d');
  const ball: Ball = new Ball({
    x: 0,
    y: 0,
  });

  const radius = ball.getRadius();
  const easing = 4 * radius / 1000; // 缓动系数 - 针对ms级别做适应

  // 设置目标点
  const targetX = canvas.width - 2 * radius;
  const targetY = canvas.height - 2 * radius;
  context.fillText('目标', targetX, targetY);

  function drawFrame() {
    (window as any).requestAnimationFrame(drawFrame, canvas);
    
    easingMove(ball, targetX, targetY, easing);
    ball.draw(context);
  }

  drawFrame();
}
