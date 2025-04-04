import {WEATHER_API} from '../config/constants';

export const getWeatherIconUrl = (iconCode: string, large = false): string => {
  const size = large ? '@2x' : '';
  return `${WEATHER_API.ICON_URL}/${iconCode}${size}.png`;
};
