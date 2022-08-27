import axios from 'axios';
import { Update, Ctx, Start, Command, Action } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';

@Update()
export class PortalController {
  @Start()
  async start(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.reply('Welcome');
  }

  @Command('films')
  async cinema(@Ctx() ctx: Scenes.SceneContext) {
    const now = new Date();
    const formatedDate = `${now.getFullYear()}-0${now.getMonth() + 1}-${now.getDate()}`;
    const axiosInstance = axios.create({
      baseURL: 'http://online.portalcinema.com.ua/site',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    const data = await axiosInstance.get(`/get-films?date=${formatedDate}`);
    const films = data.data.rez;

    await ctx.reply('Pick a film:', {
      reply_markup: {
        inline_keyboard: films.map((film) => [
          {
            text: film.FilmName,
            callback_data: `FILM_${film.Id}`,
          },
        ]),
      },
    });
  }

  @Action(/FILM_.*/)
  async getFilm(@Ctx() ctx: Scenes.SceneContext) {
    const now = new Date();
    const formatedDate = `${now.getFullYear()}-0${now.getMonth() + 1}-${now.getDate()}`;
    const axiosInstance = axios.create({
      baseURL: 'http://online.portalcinema.com.ua/site',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const [, filmId] = ctx.callbackQuery.data.split('_');
    const data = await axiosInstance.get(`/get-repertuar?id=${filmId}&date=${formatedDate}`);
    const filmScreenings = data.data.cinema_sessions;

    await ctx.reply(
      `Film screenings:\n ${filmScreenings
        .map((fs) => `Hall - ${fs.NameZala}, Time - ${fs.start_time}`)
        .join('\n')}`,
    );
  }
}
