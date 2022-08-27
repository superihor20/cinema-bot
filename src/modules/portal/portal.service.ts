import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Scenes } from 'telegraf';

import { CinemaSessionDto } from '../../dtos/cinemaSession.dto';
import { FilmDto } from '../../dtos/film.dto';

@Injectable()
export class PortalService {
  today: string;
  todaysFilms: FilmDto[];

  constructor(private readonly httpService: HttpService) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString();
    const normalizedMonth = month.length === 1 ? '0' + month : month;
    const date = now.getDate().toString().length === 1 ? '0' + now.getDate() : now.getDate();

    this.today = `${year}-${normalizedMonth}-${date}`;
  }

  greetingsMessage = (): string => {
    return `Вітаю! Тут ви можете дізнатися перелік кінострічок на сьогодні`;
  };

  films = async (): Promise<FilmDto[]> => {
    const data = await this.httpService.axiosRef.get<{ code: number; rez: FilmDto[] }>(
      `/get-films?date=${this.today}`,
    );
    this.todaysFilms = data.data.rez;

    return this.todaysFilms;
  };

  generateFilmButtons = (films: FilmDto[]): { text: string; callback_data: string }[][] => {
    return films.map((film) => [
      {
        text: film.FilmName,
        callback_data: `FILM_${film.Id}`,
      },
    ]);
  };

  getFilmId = (ctx: Scenes.SceneContext): string => {
    return ctx.callbackQuery.data.split('_').pop();
  };

  repertuar = async (filmId: string): Promise<CinemaSessionDto[]> => {
    const data = await this.httpService.axiosRef.get<{
      code: number;
      cinema_sessions: CinemaSessionDto[];
    }>(`/get-repertuar?id=${filmId}&date=${this.today}`);

    return data.data.cinema_sessions;
  };

  generateRepertuarMessage = (repertuar: CinemaSessionDto[], filmId: string): string => {
    const selectedFilm = this.todaysFilms?.filter((film) => film.Id === filmId)[0].FilmName || '';

    return repertuar.length === 0
      ? `${selectedFilm}\nНемає сеансів`
      : `${selectedFilm}\nСеанси:\n${repertuar
          .map(
            (cinemaSession) =>
              `Зал - ${cinemaSession.NameZala}, Початок - ${cinemaSession.start_time}`,
          )
          .join('\n')}`;
  };
}
