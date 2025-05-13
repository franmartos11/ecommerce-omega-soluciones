import type { NextApiRequest, NextApiResponse } from 'next';

// la const theme despues deberia obtenerla haciendo un fetch a a la api
const theme = {
  bg1:    '#F97316',
  bg2:    '#C2410C',
  text1:  '#F97316',
  text2:  '#C2410C',
  border: '#FDBA74',
  border2: '#FED7AA',
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof theme>
) {
  // le decimos al navegador/CDN que cachee esta respuesta cada 1 hora
  res.setHeader('Cache-Control', 'public, max-age=3600');
  // devolvemos el objeto theme como JSON
  res.status(200).json(theme);
}
