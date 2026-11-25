// Copie para RUN/scenes/my-diagram.js e defina scene.renderer nesse manifesto.
// Tudo deve depender de t/progress e dados. Sem Date, Math.random ou timers.
window.customDraw = ({ctx, width, height, progress, colors, helpers}) => {
  const {line, dot, text} = helpers;
  const x = width * .2 + width * .6 * progress;
  line(width * .2, height * .51, width * .8, height * .51, colors.blue, 4);
  dot(x, height * .51, 22, colors.mint);
  text('Processo ao longo do tempo', width / 2, height * .63, 40, colors.fg, 'center');
};
