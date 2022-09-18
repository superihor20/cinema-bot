import { Scenes } from 'telegraf';

export const getIdFromAction = (ctx: Scenes.SceneContext): string => {
  return ctx.callbackQuery.data.split('_').pop();
};
